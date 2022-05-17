import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import {
  updateCount,
  updatePrice,
  updateQtyBuy,
  updateQtySell,
} from "../../../store/modules/placeSlice";
import useUpDownColor from "../../../hooks/useUpDownColor";
import { formatByPriceTick, toFix64 } from "../../../utils/filters";
const Big = require("big.js");
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
  span.total {
    flex: 0 0 120px;
    text-align: right;
    padding-right: 16px;
  }
`;

const OrderItem = styled(Labels)`
  height: 20px !important;
  cursor: pointer;
  z-index: 2;
  position: absolute;
  top: 0;
  height: 20px;
  span {
    font-size: 12px;
    font-weight: 400;
    line-height: 15px;
    color: #fff !important;
  }
  span.price {
    color: ${({ c }) => `${c}`};
  }
`;
const orderItem = (props) => {
  const futureQuot = useAppSelector((state) => state.contract.snapshot);
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const countType = useAppSelector((state) => state.place.countType);
  const {
    colorUp,
    colorDown,
    orderDownColorArea,
    orderDownHoverColorArea,
    orderUpColorArea,
    orderUpDownHoverColorArea,
  } = useUpDownColor();
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

  const changeCount = (v: number) => {
    dispatch(updateCount(countType ? calcValue(v) : v));
    dispatch(updateQtyBuy(v));
    dispatch(updateQtySell(v));
  };

  const changePrice = (v: number) => {
    dispatch(updatePrice(v));
  };
  return (
    <OrderItem c={`${props.isBids ? colorUp : colorDown} !important`}>
      <span
        className="price"
        onClick={() => changePrice(formatByPriceTick(props.item[0]))}
      >
        {formatByPriceTick(props.item[0])}
      </span>
      <span className="qty" onClick={() => changeCount(props.item[1])}>
        {countType ? toFix64(calcValue(props.item[1])) : props.item[1]}
      </span>
      <span className="total">
        {countType ? toFix64(calcValue(props.item[2])) : props.item[2]}
      </span>
    </OrderItem>
  );
};

export default orderItem;
