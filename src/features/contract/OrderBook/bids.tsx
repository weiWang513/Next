import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";

import { useAppSelector } from "../../../store/hook";
import useUpDownColor from "../../../hooks/useUpDownColor";
import OrderItem from "./orderItem";
import OrderShadow from "./orderShadow";

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

const BidsLine = styled(OrderLine)`
  margin-bottom: 2px;
  height: 20px;
`;

const Bids = styled.div<{f?}>`
  flex: ${({ f }) => f || "0 0 286px"};
  // display: flex;
  // flex-direction: column;
  width: 100%;
  min-height: 286px;
  overflow: hidden;
`;

const bids = (props) => {
  const bidsAsks = useAppSelector((state) => state.orderBooks.bidsAsks);
  const entrustControlType = useAppSelector(
    (state) => state.orderBooks.entrustControlType
  );
  const { orderUpColorArea, orderUpDownHoverColorArea } = useUpDownColor();

  const renderBids = () => {
    const _list = bidsAsks?.bids?.slice(
      0,
      entrustControlType === 0 ? 13 : entrustControlType === 2 ? 26 : 0
    );
    let max = _list[_list.length - 1]?.[2] || 1;
    return (
      <>
        {entrustControlType !== 1 && (
          <Bids f={entrustControlType === 2 ? 1 : ""}>
            {_list.map((el, index) => {
              return (
                <BidsLine
                  // width={`${
                  //   (el[2] / (_list[_list.length - 1][2] || 1)) * 100
                  // }%`}
                  key={index}
                  bgColor={orderUpColorArea}
                  bgColorH={orderUpDownHoverColorArea}
                  bgColorM={
                    index % 2 ? "rgba(24, 18, 38, 1)" : "rgba(19, 15, 29, 1)"
                  }
                >
                  {/* <span className="order-shandow"></span> */}
                  <OrderShadow
                    order={el}
                    max={max}
                    bgColor={orderUpColorArea}
                  />
                  {/* <OrderItem c={`${colorUp} !important`}>
                    <span className="price" onClick={() => changePrice(formatByPriceTick(el[0]))}>{formatByPriceTick(el[0])}</span>
                    <span className="qty" onClick={() => changeCount(el[1])}>{countType ? toFix64(calcValue(el[1])) : el[1]}</span>
                    <span className="total">{countType ? toFix64(calcValue(el[2])) : el[2]}</span>
                  </OrderItem> */}
                  <OrderItem item={el} isBids={true} />
                </BidsLine>
              );
            })}
          </Bids>
        )}
      </>
    );
  };

  return <>{renderBids()}</>;
};

export default bids;
