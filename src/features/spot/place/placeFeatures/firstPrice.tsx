import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";

const FirstPrice = styled(Flex)`
  margin-top: 8px;
  span {
    flex: 1;
    display: inline-block;
    height: 24px;
    background: #130f1d;
    border-radius: 2px;
    border: 1px solid #1f1830;
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 24px;
    margin-right: 10px;
    text-align: center;
    cursor: pointer;
    &:hover {
      color: #6f5aff;
      border-color: #6f5aff;
    }
  }
  span:nth-last-child(1) {
    margin-right: 0;
  }
`;

const firstPrice = ({
  changePrice
}) => {
  const { t } = useTranslation();
  const snapshot = useAppSelector((state) => state.spot?.snapshot);
  const bidsAsksOrigin = useAppSelector(
    (state) => state.spot?.orderBook?.bidsAsksOrigin
  );
  const setPrice = (v: number) => {
    let bid: number[] = bidsAsksOrigin?.bids[0];
    let ask: number[] = bidsAsksOrigin?.asks[0];
    switch (v) {
      case 0:
        changePrice(snapshot?.lastPrice);
        break;
      case 1:
        changePrice(bid[0]);
        break;
      case 2:
        changePrice(ask[0]);
        break;

      default:
        break;
    }
  };
  return (
    <FirstPrice>
      <span onClick={() => setPrice(0)}>{t("StopLast")}</span>
      <span onClick={() => setPrice(1)}>{t("BestBid")}</span>
      <span onClick={() => setPrice(2)}>{t("BestAsk")}</span>
    </FirstPrice>
  );
};

export default firstPrice;
