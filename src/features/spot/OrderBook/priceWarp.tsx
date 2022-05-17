import React, { FC } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useAppSelector } from "../../../store/hook";
import { formatSpotPriceByTick, formatSpotCurrency2FiatValue } from "../../../utils/filters";
import { useSelector } from "react-redux";
import {
  selectCoinList,
  selectCurrentSpot,
  selectExchangeList,
  selectSpotSnapshot,
  selectPrevSpotSnapshot,
  selectBidsAsksOrigin,
  selectPreBidsAsksOrigin
} from "../../../store/modules/spotSlice";
import valInDict from "../../../utils/valInDict";
import { FIAT_SYMBOL_DICT } from "../../../contants";
import ReverseGreenRed from "../../../components/ReverseGreenRed/ReverseGreenRed";
import { Big } from "big.js";

const PriceWarp = styled(Flex)`
  justify-content: space-between;
  flex: 0 0 49px;
  padding: 0 16px;
  background: rgba(24, 18, 38, 1);
  span.last-price {
    font-size: 18px;
    font-weight: 900;
    color: #fff;
    line-height: 23px;
    margin-right: 10px;
  }
  span.last-price-fiat {
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
`;

const FiatPrice: FC = () => {
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const snapshot = useSelector(selectBidsAsksOrigin);
  const exchangeList = useSelector(selectExchangeList);

  // 当前币种USDT价格
  const coinLatest = Number(snapshot?.lp) || 0;
  // 当前法币（包含U汇率）
  const exchange = exchangeList.find((item: Exchange) => item.name === userHabit.currency);
  // 计算法币价格
  // const fiatPrice = new Big(coinLatest).times(Number(exchange?.rate) || 0).toFixed(2);
  const fiatPrice = formatSpotCurrency2FiatValue(
    new Big(coinLatest).times(Number(exchange?.rate) || 0).toString()
  );

  return (
    <>
      ≈
      {valInDict({
        key: userHabit.currency,
        dict: FIAT_SYMBOL_DICT
      })}
      {fiatPrice}
    </>
  );
};

const Price = () => {
  const snapshot = useSelector(selectBidsAsksOrigin);
  const prevSnapshot = useSelector(selectPreBidsAsksOrigin);

  const lastPrice = new Big(snapshot?.lp || 0);
  const prevLastPrice = new Big(prevSnapshot?.lp || 0);
  const priceChange = lastPrice.minus(prevLastPrice).toString();

  return (
    <PriceWarp>
      <span className="last-price">
        <ReverseGreenRed value={priceChange} disableWhenEqual={true}>
          {formatSpotPriceByTick(snapshot?.lp)}
        </ReverseGreenRed>
      </span>
      <span className="last-price-fiat">
        <FiatPrice />
      </span>
    </PriceWarp>
  );
};

export default Price;
