import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  updateCloseFlag,
  updateCount,
  updatePassive,
  updatePositionEffect,
  updatePrice,
  updateQtyBuy,
  updateQtySell,
  updateSetSL,
  updateSetSP,
  updateSide,
  updateStopPrice,
} from "../../../../store/modules/placeSlice";
import useUpDownColor from "../../../../hooks/useUpDownColor";

const PlaceMode = styled(Flex)`
  width: 288px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  span.mode-item {
    flex: 1;
    text-align: center;
    height: 32px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #615976;
    line-height: 32px;
    background: #08060f;
    border-radius: 4px;
  }
  span.index-mode {
    background: #6f5aff;
    color: #ffffff;
  }
  span.side-item {
    flex: 1;
    text-align: center;
    height: 32px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #615976;
    line-height: 32px;
    border-radius: 4px;
    background: rgba(8, 6, 15, 1);
  }
  span.side-item-buy {
    background: ${({ bgcB }) => bgcB};
    color: #fff;
  }
  span.side-item-sell {
    color: #fff;
    background: ${({ bgcS }) => bgcS};
  }
`;

const placeMode = (props) => {
  const positionEffect = useAppSelector((state) => state.place.positionEffect);
  const side = useAppSelector((state) => state.place.side);
  const posiMode = useAppSelector((state) => state.place.posiMode);
  const dispatch = useAppDispatch();
  const { colorUp, colorDown, colorUpArea, colorDownArea } = useUpDownColor();
  const closeFlag = useAppSelector((state) => state.place.closeFlag);
  const Passive = useAppSelector((state) => state.place.Passive);
  const { t } = useTranslation();

  const changePositionE = (v: number): void => {
    resetPriceCount();
    dispatch(updateSetSL(false));
    dispatch(updateSetSP(false));
    dispatch(updatePositionEffect(v));
  };
  const changeSide = (v: number): void => {
    resetPriceCount();
    dispatch(updateSide(v));
  };
  const resetPriceCount = (): void => {
    dispatch(updatePrice(""));
    dispatch(updateCount(""));
    dispatch(updateStopPrice(""));
    dispatch(updateQtyBuy(0));
    dispatch(updateQtySell(0));
    if (posiMode === 0 && closeFlag) {
      dispatch(updateCloseFlag(false));
    }
    if (Passive) {
      dispatch(updatePassive(false));
    }
  };
  return (
    <>
      {posiMode ? (
        <PlaceMode>
          <span
            className={`mode-item ${positionEffect === 1 ? "index-mode" : ""}`}
            onClick={() => changePositionE(1)}
          >
            {t("Open")}
          </span>
          <span
            className={`mode-item ${positionEffect === 2 ? "index-mode" : ""}`}
            onClick={() => changePositionE(2)}
          >
            {t("Close")}
          </span>
        </PlaceMode>
      ) : (
        <PlaceMode bgcB={colorUp} bgcS={colorDown}>
          <span
            className={`side-item ${side === 1 ? "side-item-buy" : ""}`}
            onClick={() => changeSide(1)}
          >
            {t("Buy")}
          </span>
          <span
            className={`side-item  ${side === -1 ? "side-item-sell" : ""}`}
            onClick={() => changeSide(-1)}
          >
            {t("Sell")}
          </span>
        </PlaceMode>
      )}
    </>
  );
};

export default placeMode;
