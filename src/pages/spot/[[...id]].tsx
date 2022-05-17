import React, { useEffect } from "react";
import styled from "styled-components";
import "rsuite/dist/rsuite.min.css";
import { queryAvailable } from "../../services/api/spot";
import { useAppDispatch, useAppSelector } from "../../store/hook";
import useInit from "../../hooks/useInit";
import useSocketIO from "../../hooks/useSocketIO";
import { useRouter } from "next/router";
import Layout from "../../features/spot/layout";
import {
  selectSpotList,
  setAccountList,
  updateSpotId,
  updateCurrentSpot,
  selectSpotId
} from "../../store/modules/spotSlice";
import { getInjectInfo } from "../../functions/info";
import { setShowFavor, setPlaceConfirm } from "../../store/modules/appSlice";
import Head from "../../features/spot/title";
import "rsuite/dist/rsuite.min.css";
import { useSelector } from "react-redux";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

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
  const spotId = useSelector(selectSpotId);
  const allSpotList = useAppSelector((state) => state.spot?.allSpotList);
  const resolution = useAppSelector((state) => state.spot?.resolution); // kline resolution
  const { init, setSpotCommonData } = useInit();
  const { disconnect, initSocket, reSubscribe, authSubscribe } = useSocketIO("spot");
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const socketStatus = useAppSelector((state) => state.app.socketStatus);

  const router = useRouter();
  const { id } = router.query;

  const emitMarketTopic = (newSpotId: number) => {
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
        topic: "cash_kline",
        params: {
          symbols: [
            {
              symbol: newSpotId,
              ranges: _resolution && _resolution[1] ? [_resolution[1]] : ["900000"]
            }
          ]
        }
      }
    ]);
  };

  useEffect(() => {
    init();
    setSpotCommonData();
    initSocket();
    const _showStarRow = getInjectInfo("_showStarRow") === "0" ? false : true;
    dispatch(setShowFavor(_showStarRow));
    const NoPrompt = getInjectInfo("NoPrompt") === "0" ? false : true;
    dispatch(setPlaceConfirm(NoPrompt));
    return () => {
      disconnect();
    };
  }, []);

  useEffect(() => {
    if (!allSpotList?.length) return;
    let _id = id || ["BTC_USDT"];
    let _contractItem =
      allSpotList.find((el) => el.symbol === _id[0].replace("_", "/")) ||
      allSpotList.find((el) => el.symbol === _id[0].replace("_", "-"));

    let contractId = _contractItem?.id;
    if (contractId) {
      dispatch(updateSpotId(contractId));
      dispatch(updateCurrentSpot(_contractItem));
    }
  }, [id, allSpotList]);

  useEffect(() => {
    if (spotId) {
      if (socketStatus) {
        reSubscribe([
          {
            topic: "cash_snapshot_indicator",
            params: {
              symbols: [
                {
                  symbol: spotId
                  // interval: 200000 //#时间间隔，微秒
                }
              ]
            }
          },
          {
            topic: "cash_snapshot_depth",
            params: {
              symbols: [
                {
                  symbol: spotId
                  // interval: 200000 //#时间间隔，微秒
                }
              ]
            }
          },
          {
            topic: "cash_tick",
            params: {
              symbols: [{ symbol: spotId }]
            }
          }
        ]);
      }
    }
  }, [spotId, socketStatus]);

  useEffect(() => {
    spotId && socketStatus && emitMarketTopic(spotId);
  }, [spotId, resolution, socketStatus]);

  useEffect(() => {
    if (isLogin) {
      queryAvailable().then((res) => {
        if (res.data.code === 0 && res.data.data.length > 0) {
          dispatch(setAccountList(res.data.data));
        }
      });
      if (socketStatus) {
        authSubscribe();
        reSubscribe([
          {
            topic: "cash_match"
          }
        ]);
      }
    }
  }, [isLogin, socketStatus]);

  return (
    <Contract>
      <Head />
      <Layout></Layout>
    </Contract>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code", "spotTitle"]))
  }
});

export async function getStaticPaths() {
  return {
    paths: [
      "/spot/BTC_USDT",
      "/spot/ETH_USDT",
      "/spot/LTC_USDT",
      "/spot/EOS_USDT",
      "/spot/BCH_USDT",
      "/spot/UNI_USDT",
      "/spot/DOT_USDT",
      "/spot/FIL_USDT",
      "/spot/SUSHI_USDT",
      "/spot/LINK_USDT",
      "/spot/DOGE_USDT",
      "/spot/AXS_USDT",
      "/spot/ICP_USDT",
      "/spot/ADA_USDT",
      "/spot/FTM_USDT",
      "/spot/BTC_USD-R",
      "/spot/ETH_USD-R"
      // { params: { id: 'BTC_USDT' } } // See the "paths" section below
    ],
    fallback: true // See the "fallback" section below
  };
}

export default ContractPage;
