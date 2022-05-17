import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";

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

const priceType = ({
  priceTypeTab,
  changePriceType
}) => {
  const { t } = useTranslation();
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
    </PriceType>
  );
};

export default priceType;
