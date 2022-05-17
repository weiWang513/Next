import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useAppDispatch } from "../../../store/hook";
import useUpDownColor from "../../../hooks/useUpDownColor";
import {
  formatSpotPriceByTick,
  getCurrencyPrecisionById,
  toFix6,
  formatQuantity
} from "../../../utils/filters";
import { useSelector } from "react-redux";
import {
  selectCurrentSpot,
  updateOrderPrice,
  updateOrderQty
} from "../../../store/modules/spotSlice";
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
  const currentSpot = useSelector(selectCurrentSpot);
  const { colorUp, colorDown } = useUpDownColor();
  const dispatch = useAppDispatch();

  const changeCount = (v: number) => {
    dispatch(updateOrderQty(v.toString()));
  };

  const changePrice = (v: number) => {
    dispatch(updateOrderPrice(v.toString()));
  };

  const price = props.item[0];
  const quantity = props.item[1];
  const precisionOfTotal = getCurrencyPrecisionById(currentSpot.currencyId);
  const total = new Big(Number(price) || 0).times(Number(quantity) || 0);

  const getLotSizeL = () => {
    return String(currentSpot?.lotSize).split('.')?.[1]?.length || 0
  }

  return (
    <OrderItem c={`${props.isBids ? colorUp : colorDown} !important`}>
      <span className="price" onClick={() => changePrice(formatSpotPriceByTick(price))}>
        {formatSpotPriceByTick(price)}
      </span>
      <span className="qty" onClick={() => changeCount(props.item[1])}>
        {toFix6(quantity, getLotSizeL())}
      </span>
      <span className="total">{toFix6(total, precisionOfTotal)}</span>
    </OrderItem>
  );
};

export default orderItem;
