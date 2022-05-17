import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  updateCloseFlag,
  updateCount,
  updatePassive,
  updatePrice,
  updatePriceType,
  updatePriceTypeTab,
  updateQtyBuy,
  updateQtySell,
  updateSetSL,
  updateSetSP,
  updateStopPrice,
} from "../../../../store/modules/placeSlice";

const PriceType = styled(Flex)`
  margin-top: 16px;
  width: 288px;
  height: 28px;
  background: #08060f;
  border-radius: 4px;
  cursor: pointer;
  span.mode-item {
    flex: 1;
    text-align: center;
    height: 28px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 28px;
  }
  span.index-mode {
    background: #1f1830;
    color: #ffffff;
  }
`;

const priceType = (props) => {
  const priceTypeTab = useAppSelector((state) => state.place.priceTypeTab);
  const posiMode = useAppSelector((state) => state.place.posiMode);
  const closeFlag = useAppSelector((state) => state.place.closeFlag);
  const Passive = useAppSelector((state) => state.place.Passive);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const changePriceType = (v: number): void => {
    dispatch(updatePrice(""));
    dispatch(updateStopPrice(""));
    dispatch(updateCount(""));
    dispatch(updateQtySell(""));
    dispatch(updateQtyBuy(""));
    dispatch(updatePriceTypeTab(v));

    if (v < 4) {
      dispatch(updatePriceType(v));
    } else {
      dispatch(updateSetSL(false));
      dispatch(updateSetSP(false));
      dispatch(updatePriceType(3));
    }
    if (posiMode === 0 && closeFlag) {
      dispatch(updateCloseFlag(false));
    }
    if (Passive) {
      dispatch(updatePassive(false));
    }
  };
  return (
    <PriceType>
      <span
        className={`mode-item ${priceTypeTab === 1 ? "index-mode" : ""}`}
        onClick={() => changePriceType(1)}
      >
        {t("LimitOrders")}
      </span>
      <span
        className={`mode-item ${priceTypeTab === 3 ? "index-mode" : ""}`}
        onClick={() => changePriceType(3)}
      >
        {t("MarketOrders")}
      </span>
      <span
        className={`mode-item ${priceTypeTab === 4 ? "index-mode" : ""}`}
        onClick={() => changePriceType(4)}
      >
        {t("ConditionOrders")}
      </span>
    </PriceType>
  );
};

export default priceType;
