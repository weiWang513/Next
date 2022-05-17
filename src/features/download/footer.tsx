import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { useTranslation } from "next-i18next";
import useInterval from "../../hooks/useInterval";
import { Big } from "big.js";
import { dateFormat2, formatBigNumber } from "../../utils/filters";
import useInit from "../../hooks/useInit";
import useSocketIO from "../../hooks/useSocketIO";
import { getTradingVolume } from "../../store/modules/homeSlice";
import ChangeSize from "../../hooks/useClientSize";

const Footer = styled.footer<{ bgColor?: string }>`
  box-sizing: border-box;
  position: relative;
  bottom: 0px;
  left: 0;
  width: 100%;

  padding: 0 24px;
  background: ${({ bgColor }) => (bgColor ? bgColor : `transparent`)};
  display: flex;
  flex-direction: column-reverse;
  justify-content: center;
  align-items: center;
  height: 88px;
  margin-top: 74px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0px;
    position: fixed;
    height: 64px;
    bottom: 0;
    flex-direction: row;
    justify-content: space-between;
  }
`;
const BottomLeft = styled.aside`
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 14px;
  }
`;
const BottomRight = styled.aside`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-bottom: 0;
    height: 100%;
  }
  & > div {
    font-size: 12px;
    margin-right: 8px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.5);
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 14px;
      margin-right: 0;
    }
  }
  & > section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md} {
      margin-left: 8px;
      height: 24px;
      padding: 0 8px;
      background: rgba(216, 216, 216, 0.1);
      border-radius: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    div {
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 14px;
      }
    }
    span {
      margin-left: 4px;
      margin-right: 4px;
      font-size: 12px;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.5);
      ${({ theme }) => theme.mediaQueries.md} {
        font-size: 14px;
      }
    }
  }
`;
interface CoinItem {
  latest: number;
  currencyId: number;
}

const LoginFooter = ({ bgColor }: { bgColor?: string }) => {
  const realTime = useAppSelector((state) => state.app.realTime);
  const tradingVolume = useAppSelector((state) => state?.home?.tradingVolume);
  // const coinList: CoinItem[] = useAppSelector((state) => state?.contract?.coinList);
  const [pageTime, setPageTime] = useState(null);
  const [tradingVolume24hList, setTradingVolume24hList] = useState([]);

  const { t } = useTranslation();
  const { setCommonData } = useInit();
  const { disconnect, initSocket } = useSocketIO("future");
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCommonData();
    initSocket();
    return () => {
      disconnect();
    };
  }, []);

  const getData = () => {
    dispatch(getTradingVolume());
  };

  useInterval(getData, 10000);

  const getTime = () => {
    setPageTime(pageTime + 1000);
  };

  const getAmount = (currencyId) => {
    // 这里原本的意愿应该是展示USDT合约成交额，ETH币本位合约成交额，BTC币本位合约成交额

    let tradeObj = new Big(0);
    if (currencyId === 1) {
      // eth
      tradingVolume24hList.forEach((item) => {
        if (item.currencyId === 1) {
          tradeObj = tradeObj.plus(item?.currencyTurnover || 0);
        }
      });
    } else if (currencyId === 2) {
      // btc
      tradingVolume24hList.forEach((item) => {
        if (item.currencyId === 2) {
          tradeObj = tradeObj.plus(item?.currencyTurnover || 0);
        }
      });
    } else if (currencyId === 7) {
      // usdt
      tradingVolume24hList.forEach((item) => {
        if (item.currencyId === 7) {
          tradeObj = tradeObj.plus(item?.usdtTurnover || 0);
        }
      });
    }

    // return toFix6(tradeObj?.toString(), currencyId === 7 ? 2 : 6) || "";
    return formatBigNumber(tradeObj?.toString());
  };

  useInterval(getTime, 1000);

  useEffect(() => {
    if (
      !tradingVolume.contractTradingVolume24h ||
      tradingVolume.contractTradingVolume24h.length === 0
    ) {
      return;
    }

    setTradingVolume24hList(tradingVolume?.contractTradingVolume24h);
  }, [tradingVolume]);

  // useEffect(() => {
  //   if (!tradingVolume.tradingVolume24h || tradingVolume.tradingVolume24h.length === 0 || coinList.length === 0) {
  //     return
  //   }
  //   let tempList = []
  //   tradingVolume?.tradingVolume24h.map((el: { currencyId; volume }) => {
  //     let mapObj = {...el}
  //     let latest =
  //       coinList?.find(
  //         (item: { currencyId }) => item.currencyId === el.currencyId
  //       )?.latest;
  //     mapObj.volume = new Big(el.volume || 0).div(latest).toString()
  //     tempList.push(mapObj)
  //   });
  //   setTradingVolume24hList(tempList)
  // }, [tradingVolume, coinList]);

  useEffect(() => {
    realTime && setPageTime(realTime);
  }, [realTime]);
  let size = ChangeSize();
  useEffect(() => {}, [size]);
  return (
    <Footer bgColor={bgColor}>
      <BottomLeft>© 2019 - 2022 ccfox.com All rights reserved.</BottomLeft>
      <BottomRight>
        <div>
          {size.width > 767 ? dateFormat2(pageTime) + "|" : ""} {t("DayQuoteVolume")}:
        </div>
        <section>
          <div>{getAmount(7)}</div>
          <span>USDT{size.width > 767 ? "" : " / "}</span>
        </section>
        <section>
          <div>{getAmount(1)}</div>
          <span>ETH{size.width > 767 ? "" : " / "}</span>
        </section>
        <section>
          <div>{getAmount(2)}</div>
          <span>BTC</span>
        </section>
      </BottomRight>
    </Footer>
  );
};

export default LoginFooter;
