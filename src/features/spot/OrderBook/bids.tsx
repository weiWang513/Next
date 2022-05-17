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
      background: ${({ bgColorH }) => (bgColorH ? bgColorH : `rgba(236, 81, 109, 0.3)`)};
    }
`;

const BidsLine = styled(OrderLine)`
  margin-bottom: 2px;
  height: 20px;
`;

const Bids = styled.div<{ f? }>`
  flex: ${({ f }) => f || "0 0 286px"};
  // display: flex;
  // flex-direction: column;
  width: 100%;
  min-height: 286px;
  overflow: hidden;
`;

const bids = (props) => {
  const bidsAsks = useAppSelector((state) => state.spot.orderBook.bidsAsks);
  const entrustControlType = useAppSelector((state) => state.spot.orderBook.entrustControlType);
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
                  key={index}
                  bgColor={orderUpColorArea}
                  bgColorH={orderUpDownHoverColorArea}
                  bgColorM={index % 2 ? "rgba(24, 18, 38, 1)" : "rgba(19, 15, 29, 1)"}
                >
                  <OrderShadow order={el} max={max} bgColor={orderUpColorArea} />
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
