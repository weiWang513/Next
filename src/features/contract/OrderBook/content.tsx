import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import PriceWarp from "./priceWarp";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { handleSnapshotDepth } from "../../../utils/calcFun";
import { querySnapshot } from "../../../services/api/contract";
import { updateBidsAsks } from "../../../store/modules/orderBooks";
import { updateSnapshot } from "../../../store/modules/contractSlice";
import { futureSnapshotIndicator } from "../../../utils/dataHelper";

import Bids from "./bids";
import Asks from "./asks";
const OrderBookS = styled(Flex)`
  flex-direction: column;
  flex: 1;
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
  span.total {
    flex: 0 0 120px;
    text-align: right;
    padding-right: 16px;
  }
`;

// const OrderItem = styled(Labels)`
//   height: 20px !important;
//   cursor: pointer;
//   z-index: 2;
//   position: absolute;
//   top: 0;
//   height: 20px;
//   span{
//     font-size: 12px;
//     font-weight: 400;
//     line-height: 15px;
//     color: #fff !important;
//   }
//   span.price{
//     color: ${({c}) => `${c}`};
//   }
// `

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
// const OrderLine = styled(Flex)`
//   position: relative;
//   flex-direction: column;
//   align-items: flex-end;
//   background: ${({ bgColorM }) => bgColorM};
//   &:hover {
//     span.order-shandow {
//       background: ${({ bgColorH }) =>
//         bgColorH ? bgColorH : `rgba(236, 81, 109, 0.3)`};
//     }
//   }
//   span.order-shandow {
//     display: block;
//     width: ${({ width }) => width};
//     height: 20px;
//     background: ${({ bgColor }) =>
//       bgColor ? bgColor : `rgba(236, 81, 109, 0.2)`};
//   }
// `;

const ShowdowItem = styled.span<{
  width: string;
  bgColor: string;
}>`
  display: block;
  width: ${({ width }) => width};
  height: 20px;
  background: ${({ bgColor }) =>
    bgColor ? bgColor : `rgba(236, 81, 109, 0.2)`};
`;

const BidsLine = styled(OrderLine)`
  margin-bottom: 2px;
  height: 20px;
`;
const AsksLine = styled(OrderLine)`
  margin-top: 2px;
  height: 20px;
`;
const OrderLineShadow = styled.div`
  // position: absolute;
  // top: 0;
  // bottom: 0;
  // right: 16px;
`;

const OrderBookContent = (props) => {
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const deepthIndex = useAppSelector((state) => state.orderBooks.deepthIndex);
  const countType = useAppSelector((state) => state.place.countType);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!contractId) return;

    querySnapshot({ contractId: contractId }).then((res) => {
      if (res.data.result) {
        let params = {
          bids: res.data.result.bids,
          asks: res.data.result.asks,
        };
        dispatch(
          updateBidsAsks(
            handleSnapshotDepth(params, deepthIndex, contractItem?.priceTick)
          )
        );
        dispatch(
          updateSnapshot(futureSnapshotIndicator(res.data.result).result)
        );
      }
    });
  }, [contractId]);

  const calcWidth = (el, max) => {
    return `${(el[2] / max) * 100}%`;
  };

  return (
    <OrderBookS>
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
        <span className="total">
          {t("Accumulative")}(
          {countType
            ? contractItem?.contractSide === 1
              ? contractItem?.commodityName
              : contractItem?.currencyName
            : t("Cont")}
          )
        </span>
      </Labels>
      <Asks />
      <PriceWarp />
      <Bids />
    </OrderBookS>
  );
};

export default OrderBookContent;
