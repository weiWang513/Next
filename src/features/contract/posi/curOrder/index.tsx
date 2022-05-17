import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, message } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { _shouldRestful } from "../../../../utils/tools";
import { uuid } from "../../../../utils/utils";
import { cancels, cancelOrder } from "../../../../services/api/contract";
import { formatByPriceTick, toFix6 } from "../../../../utils/filters";
import NoData from "../../../../components/NoData";

const Table = styled.div`
  height: 528px;
  .table-head {
    height: 32px;
    display: flex;
    align-items: center;
  }
  .table-body {
    height: 495px;
    overflow: overlay;
  }
  .table-row {
    height: 40px;
    display: flex;
    align-items: center;
    &:nth-child(even) {
      background: #08060f;
    }
  }
  .table-head > span,
  .table-row > span {
    flex: 1;
    font-size: 12px;
    font-weight: 500;
    color: #3f3755;
    text-align: left;
    padding-left: 16px;
    &.symbol {
      flex: 0 0 180px;
    }
    &.time {
      flex: 0 0 160px;
    }
    &.operate {
      flex: 0 0 180px;
      padding-right: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  .table-row > span {
    color: #ffffff;
    & > .symbol-text {
      font-size: 16px;
      font-family: DINPro-Bold;
      font-weight: bold;
      color: #FFFFFF;
    }
    & > .side-text {
      margin-left: 8px;
      padding: 0 6px;
      border-radius: 9px;
      line-height: 16px;
      font-size: 10px;
      font-weight: 500;
    }
  }
`;

const CurOrder = () => {
  const [orderList, setOrderList] = useState([]);

  const hideOther = useAppSelector((state) => state.contract.hideOther);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const curDelegateInfo = useAppSelector(
    (state) => state.assets.curDelegateInfo
  );
  const conditionOrders = useAppSelector(
    (state) => state.assets.conditionOrders
  );
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } =
    useUpDownColor();
  const { t } = useTranslation();

  useEffect(() => {
    let _list = hideOther
      ? curDelegateInfo.OpenOrders.filter((el) => el?.contractId === contractId)
      : curDelegateInfo.OpenOrders || [];
    setOrderList(_list);
  }, [hideOther, contractId, curDelegateInfo]);

  const handleCancleOrder = (item) => {
    const params = {
      contractId: item.contractId,
      originalOrderId: item.orderId,
    };
    cancelOrder({
      params,
      headers: { unique: uuid() },
    }).then((res) => {
      if (res.data.code === 0) {
        message.success(t("CancelledSucceed"));
        _shouldRestful();
      }
    });
  };
  const handleCancleAllOrder = () => {
    if (!curDelegateInfo.OpenOrders.length) {
      message.error(t("openOrdersEmpty"));
      return false;
    }
    let data = curDelegateInfo.OpenOrders.map((el) => {
      return {
        contractId: el?.contractId,
        originalOrderId: el?.orderId,
        clientOrderId: el?.clientOrderId,
      };
    });
    cancels({
      data: { cancels: data },
      headers: { unique: uuid() },
    }).then((res) => {
      if (res.data.code === 0) {
        message.success(t("CancelledSucceed"));
        _shouldRestful();
      }
    });
  };

  const getProfitCond = (v) => {
    let _profitOrder = conditionOrders.find(
      (el) => el?.uuid === v && el?.conditionOrderType === 1
    );
    if (_profitOrder) {
      return _profitOrder?.triggerPrice;
    }
  };

  const getLossCond = (v) => {
    let _lossOrder = conditionOrders.find(
      (el) => el?.uuid === v && el?.conditionOrderType === 2
    );
    if (_lossOrder) {
      return _lossOrder?.triggerPrice;
    }
  };

  const getSideEffect = item => {
    if (item.side > 0) {
      return item.positionEffect === 1 ? t("BuyOpenLong") : t("BuyCloseShort")
    } else {
      return item.positionEffect === 1 ? t("SellOpenShort") : t("SellCloseLong")
    }
  }

  return (
    <Table>
      <div className="table-head">
        <span className="symbol">{t("ContractPair")}</span>
        <span>{t("OrderPrice")}</span>
        <span>{t("OrderValue")}</span>
        <span>{t("OrderAmount")}({t("Cont")})</span>
        <span>{t("FilledAmount")}({t("Cont")})</span>
        <span>{t("RemainingAmount")}({t("Cont")})</span>
        <span>{t("FilledPrice")}</span>
        <span>{t("PositionMode")}</span>
        <span>{t("OrderStatus")}</span>
        <span>{t("posiItem")}</span>
        <span className="time">{t("orderCashTime")}</span>
        <span className="operate">
          <span>{t("PosiOption")}</span>
          <Button
            variant={"text"}
            isDark={true}
            scale={"xs"}
            onClick={() => handleCancleAllOrder()}CancelAll
          >
            {t("CancelAll")}
          </Button>
        </span>
      </div>
      {orderList.length > 0 ? (
        <div className="table-body">
          {orderList.map((el, index) => (
            <section className="table-row" key={index}>
              <span className="symbol">
                <span className="symbol-text">
                  {el.symbol}
                </span>
                <span
                  className="side-text"
                  style={{
                    color: el.side > 0 ? colorUp : colorDown,
                    background:
                      el.side > 0 ? orderUpColorArea : orderDownColorArea,
                  }}
                >
                  {getSideEffect(el)}
                </span>
              </span>
              <span>{formatByPriceTick(el.price, el.contractId)}</span>
              <span>{toFix6(el.value)}</span>
              <span>{el.quantity}</span>
              <span>{el.matchQty}</span>
              <span>{el.leftQuantity}</span>
              <span>{formatByPriceTick(el.avgPrice, el.contractId)}</span>
              <span>
                {el.positionEffect === 1
                  ? `${el.marginType === 1 ? t("FullPosition") : t("isolated")} / ${el.lever}`
                  : "--"}
              </span>
              <span>{el.state === 1 ? t("Unfilled") : t("PartiallyFilled")}</span>
              <span>
                <div style={{ color: colorUp }}>
                  {getProfitCond(el.clientOrderId || el.clOrderId) || "-"}
                </div>
                <div style={{ color: colorDown }}>
                  {getLossCond(el.clientOrderId || el.clOrderId) || "-"}
                </div>
              </span>
              <span className="time">{el.time}</span>
              <span className="operate">
                <Button
                  width={"100%"}
                  variant={"secondary"}
                  isDark={true}
                  scale={"xs"}
                  onClick={() => handleCancleOrder(el)}
                >
                  {t("CancelOrder")}
                </Button>
              </span>
            </section>
          ))}
        </div>
      ) : (
        <NoData />
      )}
    </Table>
  );
};

export default CurOrder;
