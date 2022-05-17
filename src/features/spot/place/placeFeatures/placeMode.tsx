import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
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

const placeMode = ({
  side,
  changeSide
}) => {
  const { colorUp, colorDown } = useUpDownColor();
  const { t } = useTranslation();

  return (
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
  );
};

export default placeMode;
