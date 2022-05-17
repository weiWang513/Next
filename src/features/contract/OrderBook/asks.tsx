import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";

import { useAppSelector } from "../../../store/hook";
import useUpDownColor from "../../../hooks/useUpDownColor";
import OrderItem from "./orderItem";
import OrderShadow from "./orderShadow";

const Asks = styled.div<{f?}>`
  flex: ${({ f }) => f || "0 0 286px"};
  display: flex;
  width: 100%;
  min-height: 286px;
  overflow: hidden;
  flex-direction: column-reverse;
  // justify-content: flex-start;
`;

const OrderLine = styled(Flex)`
  position: relative;
  flex-direction: column;
  align-items: flex-end;
  background: ${({ bgColorM }) => bgColorM};
  &:hover {
    span.order-shandow {
      background: ${({ bgColorH }) =>
        bgColorH ? bgColorH : `rgba(236, 81, 109, 0.3)`};
    }
`;

const AsksLine = styled(OrderLine)`
  margin-top: 2px;
  height: 20px;
`;

const asks = (props) => {
  const bidsAsks = useAppSelector((state) => state.orderBooks.bidsAsks);
  const entrustControlType = useAppSelector(
    (state) => state.orderBooks.entrustControlType
  );
  const {
    colorUp,
    colorDown,
    orderDownColorArea,
    orderDownHoverColorArea,
    orderUpColorArea,
    orderUpDownHoverColorArea,
  } = useUpDownColor();

  const renderAsks = () => {
    const _list = bidsAsks?.asks?.slice(
      0,
      entrustControlType === 0 ? 13 : entrustControlType === 1 ? 26 : 0
    );
    let max = _list[_list.length - 1]?.[2] || 1;
    return (
      <>
        {entrustControlType !== 2 && (
          <Asks f={entrustControlType === 1 ? 1 : ""}>
            {_list.map((el, index) => {
              return (
                <AsksLine
                  // width={`${
                  //   (el[2] / (_list[_list.length - 1][2] || 1)) * 100
                  // }%`}
                  key={index}
                  bgColor={orderDownColorArea}
                  bgColorH={orderDownHoverColorArea}
                  bgColorM={
                    index % 2 ? "rgba(24, 18, 38, 1)" : "rgba(19, 15, 29, 1)"
                  }
                >
                  {/* <span className="order-shandow"></span> */}
                  <OrderShadow
                    order={el}
                    max={max}
                    bgColor={orderDownColorArea}
                  />
                  {/* <OrderItem c={`${colorDown} !important`}>
                    <span className="price" onClick={() => changePrice(formatByPriceTick(el[0]))}>{formatByPriceTick(el[0])}</span>
                    <span className="qty" onClick={() => changeCount(el[1])}>{countType ? toFix64(calcValue(el[1])) : el[1]}</span>
                    <span className="total">{countType ? toFix64(calcValue(el[2])) : el[2]}</span>
                  </OrderItem> */}
                  <OrderItem item={el} />
                </AsksLine>
              );
            })}
          </Asks>
        )}
      </>
    );
  };
  return <>{renderAsks()}</>;
};

export default asks;
