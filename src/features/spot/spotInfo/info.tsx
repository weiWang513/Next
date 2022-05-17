import React, { FC, MouseEvent, useEffect, useState } from "react";

import styled from "styled-components";
import { ReactComponent as SpotListClose } from "/public/images/SVG/contractListClose.svg";
import { ReactComponent as SpotListOpen } from "/public/images/SVG/contractListOpen.svg";
import { ReactComponent as SpotInfoI } from "/public/images/SVG/contractInfo.svg";

import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  selectCoinList,
  selectCurrentSpot,
  selectExchangeList,
  selectSpotSnapshot,
  selectVisibleSpotList,
  toggleSpotListVisible
} from "../../../store/modules/spotSlice";

import { Flex } from "@ccfoxweb/uikit";
import SpotList from "../spotList/index";
import SpotInfoC from "./spotInfo";
import ReverseGreenRed from "../../../components/ReverseGreenRed/ReverseGreenRed";

import { useSelector } from "react-redux";
import { ossCoin } from "../../../utils/oss";
import { useTranslation } from "react-i18next";
import valInDict from "../../../utils/valInDict";
import { FIAT_SYMBOL_DICT } from "../../../contants";
import {
  formatSpotPriceByTick,
  getCurrencyPrecisionById,
  toFix6,
  formatSpotCurrency2FiatValue
} from "../../../utils/filters";
import useUpDownColor from "../../../hooks/useUpDownColor";

const Big = require("big.js");

const SpotInfo = styled(Flex)`
  flex: 1;
`;
const SpotWarp = styled(Flex)`
  flex: 0 0 290px;
  padding-left: 8px;
  position: relative;
`;
const Icon = styled.div<{ f: string }>`
  flex: 0 0 40px;
  height: 40px;
  cursor: pointer;
  background: rgba(8, 6, 15, 1);
  border-radius: 4px;
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
const SpotIn = styled.div`
  flex: 1;
  margin-left: 8px;
`;
const Spot = styled(Flex)`
  img.icon {
    margin-right: 10px;
    display: block;
    width: 20px;
    height: 20px;
  }
  span.symbol {
    font-size: 18px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: #ffffff;
    line-height: 23px;
    margin-right: 8px;
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
    display: flex;
    align-items: center;
    font-size: 14px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: ${({ c }) => c || "#FFFFFF"};
    line-height: 18px;
  }
  span.sub-value {
    margin-right: 4px;
    display: block;
    min-width: 50px;
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

const LastestPrice = styled.div<{ c: string }>`
  font-size: 16px;
  font-weight: bold;
  color: ${({ c }) => c};
  line-height: 21px;
`;

const FiatPriceWrap = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #615976;
  line-height: 18px;
`;

const FiatPrice: FC = () => {
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const exchangeList = useSelector(selectExchangeList);
  const snapshot = useSelector(selectSpotSnapshot);

  // 当前币种USDT价格
  const coinLatest = Number(snapshot?.lastPrice) || 0;
  // 当前法币（包含U汇率）
  const exchange = exchangeList.find((item: Exchange) => item.name === userHabit.currency);
  // 计算法币价格
  const fiatPrice = formatSpotCurrency2FiatValue(
    new Big(coinLatest).times(Number(exchange?.rate) || 0).toString()
  );

  return (
    <FiatPriceWrap>
      ≈
      {valInDict({
        key: userHabit.currency,
        dict: FIAT_SYMBOL_DICT
      })}
      {fiatPrice}
    </FiatPriceWrap>
  );
};

const Info = () => {
  const currentSpot = useSelector(selectCurrentSpot);
  const snapshot = useSelector(selectSpotSnapshot);
  const visibleSpotList = useSelector(selectVisibleSpotList);
  const [visibleSpotInfo, toggleSpotInfo] = useState(false);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const { colorUp, colorDown } = useUpDownColor();

  // 点击页面其它位置则隐藏弹窗
  const hideDialog = () => {
    toggleSpotInfo(false);
    dispatch(toggleSpotListVisible(false));
  };

  useEffect(() => {
    document.addEventListener("click", hideDialog);
    return () => {
      document.removeEventListener("click", hideDialog);
    };
  }, []);

  const handleSpotListBtnClicked = (e: MouseEvent) => {
    dispatch(toggleSpotListVisible(!visibleSpotList));
    if (!visibleSpotInfo) {
      // 避免触发 document.addEventListener("click")
      e.stopPropagation();
    }
  };

  const handleSpotInfoBtnClicked = (e: MouseEvent) => {
    toggleSpotInfo(!visibleSpotInfo);
    if (!visibleSpotInfo) {
      // 避免触发 document.addEventListener("click")
      e.stopPropagation();
    }
  };

  if (!currentSpot || !snapshot) {
    return <></>;
  }

  return (
    <SpotInfo>
      <SpotWarp>
        <Icon onClick={handleSpotListBtnClicked} f={visibleSpotList ? "#6f5aff" : ""}>
          {visibleSpotList ? <SpotListClose /> : <SpotListOpen />}
        </Icon>
        <SpotList visible={visibleSpotList} />
        <SpotIn>
          <Spot>
            <img
              className="icon"
              src={ossCoin(currentSpot.symbol.split("/" || "-")[0])}
              alt={currentSpot.symbol.split("/" || "-")[0]}
            />
            <span className="symbol">{currentSpot.symbol}</span>
          </Spot>
        </SpotIn>
        <Icon onClick={handleSpotInfoBtnClicked} f={visibleSpotInfo ? "#6f5aff" : ""}>
          <SpotInfoI />
          <SpotInfoC
            visible={visibleSpotInfo}
            coinSymbol={currentSpot.symbol.split("/" || "-")[0]}
          />
        </Icon>
      </SpotWarp>
      <Indictor>
        {/* 最新价格、法币价格 */}
        <IndictorItem>
          <span className="label">
            <ReverseGreenRed value={snapshot.priceChange}>
              <LastestPrice c={Number(snapshot?.priceChangeRadio) > 0 ? colorUp : colorDown}>
                {formatSpotPriceByTick(snapshot?.lastPrice)}
              </LastestPrice>
            </ReverseGreenRed>
          </span>
          <span className="value">
            <FiatPrice />
          </span>
        </IndictorItem>
        {/* 24h涨跌 */}
        <IndictorItem>
          <span className="label">{t("24hChange")}</span>
          <span className="value">
            <span className="sub-value">
              <ReverseGreenRed
                value={formatSpotPriceByTick(snapshot.priceChange)}
                needPrefix={true}
              />
            </span>
            <span className="sub-value">
              <ReverseGreenRed value={snapshot.priceChange} needPrefix={true}>
                {Number(
                  new Big(Number(snapshot?.priceChangeRadio) || 0).times(100).round(2, 0).toString()
                )}
                %
              </ReverseGreenRed>
            </span>
          </span>
        </IndictorItem>
        {/* 24h最高价 */}
        <IndictorItem>
          <span className="label">{t("24hHigh")}</span>
          <span className="value">{formatSpotPriceByTick(snapshot.priceHigh)}</span>
        </IndictorItem>
        {/* 24h最低价 */}
        <IndictorItem>
          <span className="label">{t("24hLow")}</span>
          <span className="value">{formatSpotPriceByTick(snapshot.priceLow)}</span>
        </IndictorItem>
        {/* 24h成交量(BTC) */}
        <IndictorItem>
          <span className="label">
            {t("24hVol")}({currentSpot?.commodityName})
          </span>
          <span className="value">
            {toFix6(snapshot.totalVolume, getCurrencyPrecisionById(currentSpot.commodityId))}
          </span>
        </IndictorItem>
        {/* 24h成交额(USDT) */}
        <IndictorItem>
          <span className="label">
            {t("24hTurnover")}({currentSpot?.currencyName})
          </span>
          <span className="value">
            {toFix6(snapshot.totalTurnover, getCurrencyPrecisionById(currentSpot.currencyId))}
          </span>
        </IndictorItem>
      </Indictor>
    </SpotInfo>
  );
};

export default Info;
