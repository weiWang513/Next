import React from "react";
import styled from "styled-components";
import { Flex, Tooltip } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../store/hook";
import { formatByPriceTick, toFix6 } from "../../../utils/filters";
import useUpDownColor from "../../../hooks/useUpDownColor";
import { MarkedPriceLink } from "../../../utils/utils";

const Big = require("big.js");
const PriceWarp = styled(Flex)`
  justify-content: space-between;
  flex: 0 0 49px;
  padding: 0 16px;
  background: rgba(24, 18, 38, 1);
`;
const LastPrice = styled(Flex)`
  span.last-price {
    font-size: 18px;
    font-weight: 900;
    color: ${({ c }) => c};
    line-height: 23px;
    margin-right: 10px;
  }
  span.price-change-r {
    font-size: 14px;
    font-weight: 500;
    color: ${({ c }) => c};
    line-height: 17px;
  }
`;
const IndexPrice = styled(Flex)`
  justify-content: flex-end;
  span.label {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
  span.index-price {
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 17px;
    margin-left: 10px;
  }
`;

const Price = () => {
  const snapshot = useAppSelector((state) => state.contract.snapshot);
  const bidsAsksOrigin = useAppSelector((state) => state.orderBooks.bidsAsksOrigin);
  const { colorUp, colorDown } = useUpDownColor();
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const { t } = useTranslation();
  return (
    <PriceWarp>
      <LastPrice c={snapshot?.priceChangeRadio > 0 ? colorUp : colorDown}>
        <span className="last-price">
          {formatByPriceTick(bidsAsksOrigin?.lp, bidsAsksOrigin?.contractId) || "--"}
        </span>
        <span className="price-change-r">
          {snapshot?.priceChangeRadio > 0 ? "+" : ""}
          {toFix6(new Big(snapshot?.priceChangeRadio || 0).times(100).toString())}%
        </span>
      </LastPrice>
      <IndexPrice>
        <Tooltip
          text={t("positionToolTips2")}
          mb="5px"
          href={MarkedPriceLink(userHabit?.locale)}
          hrefText={t("learnMore")}
          placement={"bottom"}
        >
          <span className="label">{t("StopMark")}</span>
        </Tooltip>
        <span className="index-price">
          {formatByPriceTick(bidsAsksOrigin?.cp, bidsAsksOrigin?.contractId) || "--"}
        </span>
      </IndexPrice>
    </PriceWarp>
  );
};

export default Price;
