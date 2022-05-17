import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import PriceWarp from "./priceWarp";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { handleSnapshotDepth } from "../../../utils/calcFun";
import { querySnapshot } from "../../../services/api/spot";
import { updateBidsAsks, updateBidsAsksOrigin } from "../../../store/modules/spotSlice";
import {
  selectCurrentSpot,
  selectSpotId,
  updateSnapshot,
  updateOrderPrice
} from "../../../store/modules/spotSlice";

import Bids from "./bids";
import Asks from "./asks";
import { parseSnapshot } from "../../../utils/wsParser";
import { useSelector } from "react-redux";

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

const OrderBookContent = () => {
  const currentSpot = useSelector(selectCurrentSpot);
  const spotId = useSelector(selectSpotId);

  const deepthIndex = useAppSelector((state) => state.spot.orderBook.deepthIndex);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!spotId) return;

    querySnapshot({ contractId: spotId }).then((res: any) => {
      if (res?.data?.result) {
        let params = {
          bids: res.data.result.bids,
          asks: res.data.result.asks
        };
        const snapshot: SpotSnapshot = parseSnapshot(res.data.result);
        dispatch(updateBidsAsks(handleSnapshotDepth(params, currentSpot?.priceTick, currentSpot?.priceTick)));
        dispatch(updateBidsAsksOrigin(params))
        dispatch(updateSnapshot(snapshot));
        // 切换交易对之后，现货下单区价格输入框内限价时应默认展示最新价
        // 所以在这里获取最新价
        dispatch(updateOrderPrice(String(snapshot.lastPrice)));
      }
    });
  }, [spotId]);

  if (!currentSpot) return <></>;

  return (
    <OrderBookS>
      <Labels>
        <span className="price">
          {t("Price")}({currentSpot.currencyName})
        </span>
        <span className="qty">
          {t("Quantity")}({currentSpot?.commodityName})
        </span>
        <span className="total">
          {t("Turnover")}({currentSpot.currencyName})
        </span>
      </Labels>
      <Asks />
      <PriceWarp />
      <Bids />
    </OrderBookS>
  );
};

export default OrderBookContent;
