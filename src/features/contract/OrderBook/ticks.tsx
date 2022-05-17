import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  dateFormatForTick,
  formatByPriceTick,
  toFix64,
} from "../../../utils/filters";
import useUpDownColor from "../../../hooks/useUpDownColor";
import { queryTickTrade } from "../../../services/api/contract";
import { updateFutureTick } from "../../../store/modules/contractSlice";

const Big = require("big.js");
const Tiks = styled.div`
  width: 320px;
  height: 653px;
  flex-direction: column;
  overflow: hidden;
`;
const Labels = styled(Flex)`
  height: 32px;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #3f3755;
    line-height: 32px;
  }
  span.price {
    flex: 0 0 100px;
    text-align: left;
    padding-left: 16px;
  }
  span.qty {
    flex: 0 0 100px;
    text-align: right;
    padding-right: 10px;
  }
  span.time {
    flex: 0 0 120px;
    text-align: right;
    padding-right: 16px;
  }
`;

const TikItem = styled(Labels)`
  height: 20px !important;
  cursor: pointer;
  z-index: 2;
  background: ${({ bgColorM }) => bgColorM};
  &:hover {
    background: rgba(8, 6, 15, 1);
  }
  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    color: #fff !important;
  }
  span.price {
    color: ${({ c }) => `${c} !important`};
  }
`;

const tiks = (props) => {
  const countType = useAppSelector((state) => state.place.countType);
  const futureTick = useAppSelector((state) => state.contract.futureTick);
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const futureQuot = useAppSelector((state) => state.contract.snapshot);
  const {
    colorUp,
    colorDown,
    orderDownColorArea,
    orderDownHoverColorArea,
    orderUpColorArea,
    orderUpDownHoverColorArea,
  } = useUpDownColor();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const calcValue = (v) => {
    if (!v) return 0;
    return contractItem.contractSide === 1
      ? new Big(v || 0).times(contractItem.contractUnit).toString()
      : new Big(v || 0)
          .times(contractItem.contractUnit)
          .div(futureQuot ? futureQuot.lastPrice : 1)
          .toString();
  };

  useEffect(() => {
    if(!contractId) return
    queryTickTrade({ contractId: contractId }).then((res) => {
      if (res.data && res.data.data && res.data.data.trades.length > 0) {
        dispatch(updateFutureTick(res.data.data.trades.reverse().slice(0, 50)));
      }
    });
  }, [contractId]);

  return (
    <Tiks>
      <Labels>
        <span className="price">
          {t("Price")}(
          {contractItem.contractSide === 2
            ? contractItem?.commodityName
            : contractItem.currencyName}
          )
        </span>
        <span className="qty">
          {t("Quantity")}(
          {countType
            ? contractItem?.contractSide === 1
              ? contractItem?.commodityName
              : contractItem?.currencyName
            : t("Cont")}
          )
        </span>
        <span className="time">{t("Time")}</span>
      </Labels>
      {futureTick.map((e, i) => {
        return (
          <TikItem
            key={i}
            c={e[3] === 1 ? colorUp : colorDown}
            bgColorM={i % 2 ? "rgba(19, 15, 29, 1)" : "rgba(24, 18, 38, 1)"}
          >
            <span className="price">{formatByPriceTick(e[1])}</span>
            <span className="qty">
              {countType ? toFix64(calcValue(e[2])) : e[2]}
            </span>
            <span className="time">{dateFormatForTick(e[0] / 1000)}</span>
          </TikItem>
        );
      })}
    </Tiks>
  );
};

export default tiks;
