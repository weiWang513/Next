import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import CountUp from "react-countup";
import { Big } from "big.js";
import { getTradingVolume } from "../../../store/modules/homeSlice";
import useInterval from "../../../hooks/useInterval";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { formatMillions, formatBigNumber, formatBigNumberSymbol } from "../../../utils/filters";

const InfoWarp = styled.div`
  margin-top: 80px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 520px;
  }
  h1 {
    font-size: 28px;
    font-weight: bold;
    color: #ffffff;
    line-height: 30px;
    margin-top: 0px;
    width: 366px;
    padding: 0 10px;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 32px;
      margin-top: 16px;
      line-height: 40px;
      width: auto;
      padding: 0;
    }
  }
  h2 {
    font-size: 14px;
    color: #ffffff;
    line-height: 16px;
    margin-top: 10px;
    width: 366px;
    padding: 0 10px;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 14px;
      color: #ffffff;
      line-height: 16px;
      margin-top: 10px;
      width: auto;
      padding: 0;
    }
  }
  ul {
    padding-top: 16px;
    display: none;
    ${({ theme }) => theme.mediaQueries.md} {
      display: flex;
    }
    li {
      width: 80px;
      display: flex;
      flex-direction: column;
      margin: 0 20px;
      &:first-child,
      &:last-child {
        width: 115px;
        margin: 0;
      }
      ${({ theme }) => theme.mediaQueries.md} {
        width: 200px;
        display: flex;
        flex-direction: column;
        margin: 0;
        &:first-child,
        &:last-child {
          width: 240px;
        }
      }
    }
  }
`;

const CountUpTtile = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: #ffffff;
  line-height: 17px;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
    line-height: 18px;
  }
`;

const CountUpWrap = styled(CountUp)`
  padding-top: 4px;
  font-size: 18px;
  font-weight: 900;
  color: #ffffff;
  line-height: 23px;
  font-family: DINPro-Black;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 28px;
    line-height: 36px;
  }
`;

const ExchangeInfo = () => {
  const { t } = useTranslation();

  const [tradingVolume24h, setTradingVolume24h] = useState(null);
  const tradingVolume24hRef = useRef(null);
  const [tradingUserCount, setTradingUserCount] = useState(null);
  const tradingUserCountRef = useRef(null);
  const [ventureFund, setVentureFund] = useState(null);
  const ventureFundRef = useRef(null);

  const dispatch = useAppDispatch();
  const tradingVolume = useAppSelector((state) => state?.home?.tradingVolume);
  const contractList = useAppSelector((state) => state.contract.contractList);

  const getData = () => {
    dispatch(getTradingVolume());
  };

  useInterval(getData, 20 * 1000);

  useEffect(() => {
    setTradingUserCount(tradingVolume?.tradingUserCount || 0);

    // let _tradingVolume24h = new Big(0);
    // tradingVolume?.tradingVolume24h?.map((el: { currencyId; volume }) => {
    //   _tradingVolume24h = new Big(el?.volume || 0).plus(_tradingVolume24h);
    // });
    // setTradingVolume24h(formatMillions(_tradingVolume24h?.toString()));

    // setVentureFund(formatMillions(tradingVolume?.ventureFund?.toString()));

    // 新24h成交量
    if (!tradingVolume.contractTradingVolume24h) {
      return;
    }

    let _tradingVolume24h = new Big(0);
    tradingVolume?.contractTradingVolume24h
      ?.filter((el: { contractId }) => el.contractId !== 999999)
      ?.map((el: { usdtTurnover }) => {
        _tradingVolume24h = new Big(el?.usdtTurnover || 0).plus(_tradingVolume24h);
      });

    setTradingVolume24h(_tradingVolume24h?.toString());
  }, [tradingVolume]);

  //未平仓价值
  useEffect(() => {
    if (tradingVolume?.openInterest?.length === 0 || contractList.length === 0) {
      return;
    }

    let _ventureFund = new Big(0);

    tradingVolume?.openInterest?.find((el: any) => {
      let item: any = contractList?.find((ele: any) => ele.contractId === el.contractId);
      _ventureFund = new Big(
        item?.contractSide === 1
          ? new Big(el.openInterest || 0).times(item?.contractUnit || 0).times(item?.lastPrice || 0)
          : new Big(el.openInterest || 0)
      ).plus(_ventureFund);
    });
    let _num = _ventureFund?.toString();
    setVentureFund(_num);
  }, [tradingVolume, contractList]);

  useEffect(() => {
    ventureFundRef.current = Number(ventureFund);
  }, [ventureFund]);

  useEffect(() => {
    tradingVolume24hRef.current = Number(tradingVolume24h);
  }, [tradingVolume24h]);

  useEffect(() => {
    tradingUserCountRef.current = Number(tradingUserCount);
  }, [tradingUserCount]);

  return (
    <InfoWarp>
      {/* <Line /> */}
      {/* <h1>{t("BannerTitle")}</h1> */}
      <h1>{t("homeH1")}</h1>
      <h2>{t("homeH2")}</h2>
      <ul>
        <li>
          <CountUpTtile>{t("DayQuoteVolume")}</CountUpTtile>
          <CountUpWrap
            start={formatBigNumber(tradingVolume24hRef.current, false)}
            end={formatBigNumber(tradingVolume24h, false)}
            duration={1}
            decimals={3}
            separator={","}
            prefix={"$"}
            suffix={formatBigNumberSymbol(tradingVolume24h)}
          />
        </li>
        <li>
          <CountUpTtile>{t("TotalUser")}</CountUpTtile>
          <CountUpWrap
            start={tradingUserCountRef.current}
            end={Number(tradingUserCount)}
            duration={2}
            decimals={0}
            separator={","}
          />
        </li>
        <li>
          <CountUpTtile>{t("positionValue")}</CountUpTtile>
          <CountUpWrap
            start={formatBigNumber(ventureFundRef.current, false)}
            end={formatBigNumber(ventureFund, false)}
            duration={1}
            decimals={3}
            separator={","}
            prefix={"$"}
            suffix={formatBigNumberSymbol(ventureFund)}
          />
        </li>
      </ul>
    </InfoWarp>
  );
};

export default ExchangeInfo;
