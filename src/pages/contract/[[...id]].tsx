import React, { useEffect } from "react";
import styled from "styled-components";
import { useToast } from "@ccfoxweb/uikit";
import "rsuite/dist/rsuite.min.css";
import {
  queryCommonData,
  queryVarietyMarginAll,
  queryMarginInfo,
  queryAllContract
} from "../../services/api/contract";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { useAppDispatch, useAppSelector } from "../../store/hook";
import useInit from "../../hooks/useInit";
import useSocketIO from "../../hooks/useSocketIO";
import { useRouter } from "next/router";
import Layout from "../../features/contract/layout";
import {
  setVarietyMarginAll,
  updateContractId,
  updateContractItem,
  setAllContractList
} from "../../store/modules/contractSlice";
import {
  updateCount,
  updateLever,
  updateLossInput,
  updateMaxLever,
  updateModeType,
  updatePassive,
  updatePosiMode,
  updatePrice,
  updatePriceType,
  updateProfitInput,
  updateQtyBuy,
  updateQtySell,
  updateSetSL,
  updateSetSP,
  updateStopPrice,
  initPlaceData
} from "../../store/modules/placeSlice";
import { updateAccountList, updateAccountListTemp } from "../../store/modules/assetsSlice";
import { getInjectInfo } from "../../functions/info";
import { setShowFavor, setPlaceConfirm } from "../../store/modules/appSlice";
import GetPosiMode from "../../components/getPosiMode";
import Head from "../../features/contract/title";
import "rsuite/dist/rsuite.min.css";
// import { initSnapshotDeepth } from "../../hooks/snapshot_deepth";

const Big = require("big.js");

const Contract = styled.div`
  height: 100vh;
  width: 100%;
  > ::-webkit-scrollbar {
    display: none !important;
  }
  + ::-webkit-scrollbar {
    display: none !important;
  }
`;
const ContractPage = ({}) => {
  const dispatch = useAppDispatch();

  // const { t } = useTranslation();
  // const contractList = useAppSelector((state) => state.contract.contractList);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const allContractList = useAppSelector((state) => state.contract.allContractList);
  const notice = useAppSelector((state) => state.contract.notice);
  const resolution = useAppSelector((state) => state.contract.resolution); // kline resolution
  const { init, setCommonData } = useInit();
  const { disconnect, initSocket, reSubscribe, authSubscribe } = useSocketIO();
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const socketStatus = useAppSelector((state) => state.app.socketStatus);

  const router = useRouter();
  const { id } = router.query;

  const { toastWarning } = useToast();

  const emitMarketTopic = (contractId) => {
    if (resolution === "") return;

    let resolutionArr = [
      ["1", "60000"],
      ["3", "180000"],
      ["5", "300000"],
      ["15", "900000"],
      ["30", "1800000"],
      ["60", "3600000"],
      ["120", "7200000"],
      ["240", "14400000"],
      ["360", "21600000"],
      ["720", "43200000"],
      ["1D", "86400000"],
      ["1W", "604800000"]
    ];
    let _resolution = resolutionArr.find((el) => {
      return el[0] === resolution;
    });

    reSubscribe([
      {
        topic: "future_kline",
        params: {
          symbols: [
            {
              symbol: contractId,
              ranges: _resolution && _resolution[1] ? [_resolution[1]] : ["900000"]
            }
          ]
        }
      }
    ]);
  };

  useEffect(() => {
    init();
    setCommonData();
    initSocket();
    const _showStarRow = getInjectInfo("_showStarRow") === "0" ? false : true;
    dispatch(setShowFavor(_showStarRow));
    const NoPrompt = getInjectInfo("NoPrompt") === "0" ? false : true;
    dispatch(setPlaceConfirm(NoPrompt));
    queryAllContract().then((res) => {
      if (res.data.code === 0) {
        dispatch(setAllContractList(res.data.data));
      }
    });
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (!allContractList?.length) return;

    let _id = id || ["BTC_USDT"];

    let _contractItem: { contractId? } = {};
    _contractItem =
      allContractList.find((el) => el.symbol === _id[0].replace("_", "/")) ||
      allContractList.find((el) => el.symbol === _id[0].replace("_", "-"));

    let contractId = _contractItem?.contractId || 1000000;

    _contractItem = allContractList.find((el) => el.contractId === contractId);

    if (contractId) {
      queryVarietyMarginAll({}).then((res) => {
        dispatch(setVarietyMarginAll(res.data?.data));
        let _margin = res.data?.data[`${contractId}`]?.[0]?.initRate;
        const maxLever = new Big(1)
          .div(_margin || 0.01)
          .round()
          .toString();
        dispatch(updateMaxLever(Number(maxLever)));
        if (getInjectInfo("placeParams")) {
          const placeParams = JSON.parse(getInjectInfo("placeParams"));
          placeParams.lever &&
            dispatch(updateLever(placeParams.lever < maxLever ? placeParams.lever : maxLever));
          placeParams.priceType && dispatch(updatePriceType(placeParams.priceType));
          placeParams.modeType && dispatch(updateModeType(placeParams.modeType));
        }
      });
      dispatch(updateContractId(contractId));
      dispatch(updateContractItem(_contractItem));
    }
  }, [id, allContractList]);

  useEffect(() => {
    if (contractId && socketStatus) {
      reSubscribe([
        {
          topic: "future_snapshot_indicator",
          params: {
            symbols: [{ symbol: contractId }]
            // interval: 200000 //#时间间隔，微秒
          }
        },
        {
          topic: "future_snapshot_depth",
          params: {
            symbols: [{ symbol: contractId }]
            // interval: 200000 //#时间间隔，微秒
          }
        },
        {
          topic: "future_tick",
          params: {
            symbols: [{ symbol: contractId }]
          }
        }
      ]);
    }
  }, [contractId, socketStatus]);

  useEffect(() => {
    dispatch(updatePrice(""));
    dispatch(updateStopPrice(""));
    dispatch(updateCount(""));
    dispatch(updateQtySell(""));
    dispatch(updateQtyBuy(""));
    dispatch(updateSetSL(false));
    dispatch(updateSetSP(false));
    dispatch(updateProfitInput(""));
    dispatch(updateLossInput(""));
    dispatch(updatePassive(false));
  }, [id]);

  useEffect(() => {
    contractId && socketStatus && emitMarketTopic(contractId);
  }, [contractId, resolution, socketStatus]);

  useEffect(() => {
    if (isLogin && notice.title) {
      toastWarning(notice.title, notice.data);
    }
  }, [notice]);

  useEffect(() => {
    if (isLogin) {
      queryMarginInfo().then((res) => {
        if (res.data.code === 0) {
          dispatch(updateAccountList(res.data.data));
          dispatch(updateAccountListTemp(res.data.data));
        }
      });
      if (socketStatus) {
        authSubscribe();
        reSubscribe([
          {
            topic: "match"
          },
          {
            topic: "notice"
          },
          {
            topic: "condition_order"
          }
        ]);
      }
    }
  }, [isLogin, socketStatus]);

  useEffect(() => {
    console.log("contractId", contractId);

    if (contractId) {
      dispatch(initPlaceData());
    }
  }, [contractId]);

  return (
    <Contract>
      <Head />
      <Layout></Layout>
      <GetPosiMode />
    </Contract>
  );
};

// export const getStaticProps = async ({ locale }) => {
//   let fetchContractList = await queryCommonData();
//   let contractList = fetchContractList.data.data.contracts;
//   let props = {
//     props: {
//       ...(await serverSideTranslations(locale, ["common", "home", "code"])),
//       contractList,
//       locale,
//     },
//   };
//   return props;
// };
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code", "contractTitle"]))
  }
});

export async function getStaticPaths() {
  // let fetchContractList = await queryCommonData();
  // let contractList = fetchContractList.data.data.contracts;
  // console.log("contract", contractList);
  // const symbolA = contractList?.map((el) => el.symbol);
  // console.log(symbolA, 'symbolA')
  return {
    paths: [
      "/contract/BTC_USDT",
      "/contract/ETH_USDT",
      "/contract/LTC_USDT",
      "/contract/EOS_USDT",
      "/contract/BCH_USDT",
      "/contract/UNI_USDT",
      "/contract/DOT_USDT",
      "/contract/FIL_USDT",
      "/contract/SUSHI_USDT",
      "/contract/LINK_USDT",
      "/contract/DOGE_USDT",
      "/contract/AXS_USDT",
      "/contract/ICP_USDT",
      "/contract/ADA_USDT",
      "/contract/FTM_USDT",
      "/contract/BTC_USD-R",
      "/contract/ETH_USD-R"
      // { params: { id: 'BTC_USDT' } } // See the "paths" section below
    ],
    fallback: true // See the "fallback" section below
  };
}

export default ContractPage;
