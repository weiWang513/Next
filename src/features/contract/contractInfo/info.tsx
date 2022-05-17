import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Flex, Tooltip } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { toFix6, filterTime, formatBigNumber, formatByPriceTick } from "../../../utils/filters";
const Big = require("big.js");
import dayjs from "dayjs";
import useInterval from "../../../hooks/useInterval";
import ContractList from "../contractList/index";
import { ReactComponent as ContractListClose } from "/public/images/SVG/contractListClose.svg";
import { ReactComponent as ContractListOpen } from "/public/images/SVG/contractListOpen.svg";
import { ReactComponent as ContractInfoI } from "/public/images/SVG/contractInfo.svg";
import useUpDownColor from "../../../hooks/useUpDownColor";
import ContractInfoC from "./contractInfo";
import { FundingRateLink, MarkedPriceLink } from "../../../utils/utils";
import { updateContractListShow } from "../../../store/modules/contractSlice";
const ContractInfo = styled(Flex)`
  flex: 1;
`;
const ContractWarp = styled(Flex)`
  flex: 0 0 290px;
  padding-left: 8px;
  position: relative;
`;
const Icon = styled.div<{ f }>`
  flex: 0 0 40px;
  height: 40px;
  cursor: pointer;
  background: rgba(8, 6, 15, 1);
  border-radius: 4px;
  // overflow: hidden;
  position: relative;
  path {
    fill: ${({ f }) => f || ""};
  }
  &:hover {
    path {
      fill: #6f5aff;
    }
  }
`;
const ContractIn = styled.div`
  flex: 1;
  margin-left: 8px;
`;
const Contract = styled(Flex)`
  span.symbol {
    font-size: 18px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: #ffffff;
    line-height: 23px;
    margin-right: 8px;
  }
  span.type {
    padding: 0 4px;
    height: 17px;
    background: #1f1830;
    border-radius: 2px;
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
`;
const PriceWarp = styled(Flex)`
  span.last-price {
    min-width: 50px;
    font-size: 14px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: ${({ c }) => c};
    line-height: 18px;
    margin-right: 8px;
  }
  span.price-change-r {
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: ${({ c }) => c};
    line-height: 15px;
  }
`;

const Indictor = styled(Flex)`
  flex: 1;
  justify-content: flex-start;
  margin-left: 8px;
`;
const IndictorItem = styled.div<{ width?; c? }>`
  // flex: 0 0 80px;
  min-width: ${({ width }) => (width ? width : "80px")};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  // padding-right: 10px;
  padding-left: 12px;
  span.t {
    margin-bottom: 5px;
  }
  span.label {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
  span.value {
    font-size: 14px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: ${({ c }) => c || "#FFFFFF"};
    line-height: 18px;
  }

  span.funding-rate {
    color: #6f5aff;
    padding-right: 8px;
  }

  span.finish {
    min-width: 56px;
    display: inline-block;
  }

  span.price-change {
    display: inline-block;
    color: ${({ c }) => c || "#FFFFFF"};
    padding-right: 7px;
    min-width: 60px;
    font-size: 14px;
  }
`;

const Info = () => {
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const snapshot = useAppSelector((state) => state.contract.snapshot);
  const contractListShow = useAppSelector((state) => state.contract.contractListShow);
  const pageRealTime = useRef(0);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const timer = null;
  const realTime = useAppSelector((state) => state.app.realTime);
  const [finishTime, setFinishTime] = useState<string | number>("");
  const [showContractInfo, setShowContractInfo] = useState(false);
  const { t } = useTranslation();

  const dispatch = useAppDispatch();
  useInterval(() => {
    pageRealTime.current += 1000;
    setFinishTime(finishTimeFun());
  }, 1000);
  const { colorUp, colorDown } = useUpDownColor();

  useEffect(() => {
    pageRealTime.current = realTime || 0;
  }, [realTime]);

  useEffect(() => {
    // pageRealTime = realTime || 0
    // clearInterval(this.timer)
    // useInterval
    // this.timer = setInterval(() => {
    //   this.pageRealTime += 1000
    //   this.setState({ finishTime: this.finishTimeFun() })
    // }, 1000)
    // return () => {
    //   cleanup
    // }
  }, [realTime]);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      setShowContractInfo(false);
      dispatch(updateContractListShow(false));
    });

    return () => {
      document.removeEventListener("click", (e) => {
        setShowContractInfo(false);
        dispatch(updateContractListShow(false));
      });
    };
  }, []);

  // const calcValue = (v: number): string => {
  //   return new Big(v || 0).times(contractItem?.contractUnit || 0.01).toString();
  // };

  const finishTimeFun = (): string | number => {
    let finishTime = "--";
    let contractType = contractItem.contractType;
    if (!contractType) return "--";

    if (contractType === 1) {
      //定期
      finishTime = new Big(contractItem.deliveryTime)
        .div(1000)
        .sub(pageRealTime.current)
        .toString();
    } else {
      // 永续
      let date = new Date(pageRealTime.current || 0),
        dateMillisecond = dayjs(
          `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        ).valueOf(), //当前日期凌晨毫秒数
        finalArr = [], //最终分段时间数组
        segs = new Big(86400000).div(contractItem.perpetualSettleFrequency); //每段时间毫秒数,交割时间间隔
      for (let i = 0; i <= contractItem.perpetualSettleFrequency; i++) {
        finalArr.push(new Big(dateMillisecond).plus(new Big(segs).times(i)));
      }
      let finalTime = finalArr.find((el) => {
        //永续最终结算时间
        return Number(pageRealTime.current) <= Number(el);
      });

      finishTime =
        new Big(finalTime || 0).sub(pageRealTime.current).toString() <= 0
          ? 0
          : new Big(finalTime || 0).sub(pageRealTime.current).toString();
    }
    let _time: string | number = filterTime(finishTime);
    return _time;
  };

  const getPriTickL = () => {
    let priceTick = contractItem?.priceTick;
    let _l = String(priceTick).split(".")[1]?.length;
    return _l || 2;
  };

  return (
    <ContractInfo>
      <ContractWarp>
        <Icon
          onClick={(e) => {
            dispatch(updateContractListShow(!contractListShow));

            if (!showContractInfo) {
              e.stopPropagation();
            }
          }}
          f={contractListShow ? "#6f5aff" : ""}
        >
          {contractListShow ? <ContractListClose /> : <ContractListOpen />}
        </Icon>
        <ContractIn>
          <Contract>
            <span className="symbol">{contractItem?.symbol}</span>
            <span className="type">
              {contractItem?.contractSide === 1 ? t("UBased") : t("CurrencyBased")}
            </span>
          </Contract>
          <PriceWarp c={snapshot?.priceChangeRadio > 0 ? colorUp : colorDown}>
            <span className="last-price">{formatByPriceTick(snapshot?.lastPrice)}</span>
            <span className="price-change-r">
              {snapshot?.priceChangeRadio > 0 ? "+" : ""}
              {Number(new Big(snapshot?.priceChangeRadio || 0).times(100).round(2, 0).toString())}%
            </span>
          </PriceWarp>
        </ContractIn>
        <Icon
          onClick={(e) => {
            setShowContractInfo(!showContractInfo);
            if (!showContractInfo) {
              e.stopPropagation();
            }
          }}
          f={showContractInfo ? "#6f5aff" : ""}
        >
          {/* <Link href="/contractMarket"> */}
          <ContractInfoI />
          {/* </Link> */}
          {/* {showContractInfo && ( */}
          <ContractInfoC
            closeContractInfo={() => setShowContractInfo(false)}
            showContractInfo={showContractInfo}
          />
          {/* )} */}
          {/* <ContractInfoC closeContractInfo={() => setShowContractInfo(false)} /> */}
        </Icon>
        <ContractList contractListShow={contractListShow} />
      </ContractWarp>
      <Indictor>
        <IndictorItem>
          <span className="t">
            <Tooltip
              text={t("MarkedPriceTips")}
              mb="5px"
              href={MarkedPriceLink(userHabit?.locale)}
              hrefText={t("learnMore")}
            >
              <span className="label">{t("MarkedPrice")}</span>
            </Tooltip>
          </span>
          <span className="value">{toFix6(snapshot?.clearPrice, getPriTickL())}</span>
        </IndictorItem>
        <IndictorItem>
          <span className="t">
            <Tooltip text={t("IndexedPriceTips")} mb="5px">
              <span className="label">{t("IndexPriced")}</span>
            </Tooltip>
          </span>
          <span className="value">{toFix6(snapshot?.indexPrice, getPriTickL())}</span>
        </IndictorItem>
        <IndictorItem c={snapshot?.priceChangeRadio > 0 ? colorUp : colorDown}>
          <span className="t">
            <Tooltip text={t("24hChangeTips")} mb="5px">
              <span className="label">{t("24hChange")}</span>
            </Tooltip>
          </span>
          <span>
            <span className="price-change">{toFix6(snapshot?.priceChange, getPriTickL())}</span>
            {/* <span className="price-change">{new Big(snapshot?.priceChangeRadio || 0).times(100).round(2, 0).toString()}%</span> */}
          </span>
        </IndictorItem>
        <IndictorItem>
          <span className="t">
            <Tooltip
              text={t("FundingFeeCountdownTips")}
              mb="5px"
              href={FundingRateLink(userHabit?.locale)}
              hrefText={t("learnMore")}
            >
              <span className="label">
                {t("FundingFee")}/{t("Countdown")}
              </span>
            </Tooltip>
          </span>
          <span>
            <span className="value funding-rate">
              {new Big(snapshot?.fundingRate || 0).times(100).toFixed(4, 0).toString()}%
            </span>
            <span className="value finish">{finishTime}</span>
          </span>
        </IndictorItem>
        <IndictorItem>
          <span className="t">
            <Tooltip text={t("24hVolTips")} mb="5px">
              <span className="label">
                {t("24hVol")}({contractItem?.commodityName})
              </span>
            </Tooltip>
          </span>
          <span className="value">
            {formatBigNumber(
              contractItem?.contractSide === 1
                ? snapshot?.commodity24turnover
                : snapshot?.usdt24turnover
            )}
          </span>
        </IndictorItem>
        <IndictorItem>
          <span className="t">
            <Tooltip text={t("24hTurnoverTips")} mb="5px">
              <span className="label">
                {t("24hTurnover")}({contractItem?.currencyName})
              </span>
            </Tooltip>
          </span>
          <span className="value">
            {formatBigNumber(
              contractItem?.contractSide === 1
                ? snapshot?.usdt24turnover
                : snapshot?.commodity24turnover
            )}
          </span>
        </IndictorItem>
        {/* <IndictorItem>
          <span className="label">24h最高价</span>
          <span className="value">{toFix6(snapshot?.priceHigh)}</span>
        </IndictorItem>
        <IndictorItem>
          <span className="label">24h最低价</span>
          <span className="value">{toFix6(snapshot?.priceLow)}</span>
        </IndictorItem> */}
        <IndictorItem>
          <span className="t">
            <Tooltip text={t("AllPositionTips")} mb="5px">
              <span className="label">{t("AllPosition")}</span>
            </Tooltip>
          </span>
          <span className="value">{toFix6(snapshot?.posiVol)}</span>
        </IndictorItem>
      </Indictor>
    </ContractInfo>
  );
};

export default Info;
