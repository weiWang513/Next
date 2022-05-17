import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updatePrice } from "../../../../store/modules/placeSlice";

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

const firstPrice = (props) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const snapshot = useAppSelector((state) => state.contract.snapshot);
  const bidsAsksOrigin = useAppSelector(
    (state) => state.orderBooks.bidsAsksOrigin
  );
  const setPrice = (v: number) => {
    let bid: number[] = bidsAsksOrigin?.bids[0];
    let ask: number[] = bidsAsksOrigin?.asks[0];
    switch (v) {
      case 0:
        dispatch(updatePrice(snapshot?.lastPrice));
        break;
      case 1:
        dispatch(updatePrice(bid[0]));
        break;
      case 2:
        dispatch(updatePrice(ask[0]));
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
