import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, message } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { uuid } from "../../../../utils/utils";
import { restfulConditionOrders } from "../../../../utils/common";
import {
  cancelCondOrder,
  conditionCancels,
} from "../../../../services/api/contract";
import {
  formatByPriceTick,
  dateFormat2,
} from "../../../../utils/filters";
import NoData from "../../../../components/NoData";
import { _trackEvent } from "../../../../utils/tools";

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
      flex: 0 0 250px;
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
    & > .pnl-text {
      margin-left: 4px;
      padding: 0 6px;
      border-radius: 9px;
      border: 1px solid #615976;
      line-height: 14px;
      font-size: 10px;
      color: #615976;
      font-weight: 500;
    }
  }
`;

const ConOrder = () => {
  const [orderList, setOrderList] = useState([]);

  const hideOther = useAppSelector((state) => state.contract.hideOther);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const contractList = useAppSelector((state) => state.contract.contractList);
  const curDelegateInfo = useAppSelector(
    (state) => state.assets.curDelegateInfo
  );
  const conditionOrders = useAppSelector(
    (state) => state.assets.conditionOrders
  );
  const {
    colorUp,
    colorDown,
    orderUpColorArea,
    orderDownColorArea,
  } = useUpDownColor();
  const { t } = useTranslation();

  useEffect(() => {
    let _list = hideOther
      ? conditionOrders.filter((el) => el?.contractId === contractId)
      : conditionOrders || [];

    setOrderList(_list);
  }, [hideOther, contractId, conditionOrders]);

  const getSymbol = (v) => {
    return contractList.length
      ? contractList.find((el) => el.contractId === v).symbol
      : "";
  };

  const getPnLType = (v) => {
    switch (v.conditionOrderType) {
      case 0:
        return t("CommonCond");
      case 1:
        return t("StopProfitT");
      case 2:
        return t("StopLossT");

      default:
        break;
    }
  };

  const getTriggerType = item => {
    switch (item.triggerType) {
      case 2:
        return t("Lastest");
      case 3:
        return t("Index");
      case 4:
        return t("Marks");
      default:
        break;
    }
  }

  const TriggeringConditions = (item) => {
    let _order = curDelegateInfo.OpenOrders.find(
      (el) => el?.clientOrderId === item.uuid || el?.clOrderId === item.uuid
    );
    let _comparePrice =
      item.status === 5
        ? _order
          ? _order?.price
          : item.curtPrice
        : item.curtPrice;
    let orderStatus = "";
    if (Number(_comparePrice) < Number(item.triggerPrice)) {
      orderStatus = "≥";
    } else {
      orderStatus = "≤";
    }
    switch (item.triggerType) {
      case 2:
        return `${orderStatus}${item.triggerPrice}`;
      case 3:
        return `${orderStatus}${item.triggerPrice}`;
      case 4:
        return `${orderStatus}${item.triggerPrice}`;
      default:
        break;
    }
  };

  const getTriggerStatus = (v) => {
    switch (v.status) {
      case 1:
        return t("NotTriggered");
      case 2:
        return t("TriggerSucceed");
      case 3:
        return t("OrderFailed");
      case 4:
        return t("Canceled");

      default:
        return t("NotTriggered");
    }
  };

  const getSideEffect = item => {
    if (item.side > 0) {
      return item.positionEffect === 1 ? t("BuyOpenLong") : t("BuyCloseShort")
    } else {
      return item.positionEffect === 1 ? t("SellOpenShort") : t("SellCloseLong")
    }
  }

  const cancleAll = () => {
    if (!conditionOrders.length) {
      return;
    }
    let data = conditionOrders.map((el) => {
      return el?.conditionOrderId;
    });
    conditionCancels({
      params: { conditionOrderIdList: data },
      headers: { unique: uuid() },
    }).then((res) => {
      if (res.data.code === 0) {
        _trackEvent(data, false, false)
        restfulConditionOrders();
        message.success(t("CancelledSucceed"));
      }
    });
  };

  const cancleOrder = (v) => {
    const params = {
      conditionOrderId: v.conditionOrderId,
    };
    cancelCondOrder({
      params,
      headers: { unique: uuid() },
    }).then((res) => {
      if (res.data.code === 0) {
        _trackEvent(v.conditionOrderId, false, false)
        restfulConditionOrders();
        message.success(t("CancelledSucceed"));
      }
    });
  };

  return (
    <Table>
      <div className="table-head">
        <span className="symbol">{t("ContractPair")}</span>
        <span>{t("OrderPrice")}</span>
        <span>{t("OrderAmount")}({t("Cont")})</span>
        <span>{t("TriggeringType")}</span>
        <span>{t("TriggerPrice")}</span>
        <span>{t("PositionMode")}</span>
        <span>{t("TriggerStatus")}</span>
        <span>{t("orderCashTime")}</span>
        <span className="operate">
          <span>{t("PosiOption")}</span>
          <Button
            variant={"text"}
            isDark={true}
            scale={"xs"}
            onClick={() => cancleAll()}
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
                  {getSymbol(el.contractId)}
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
                <span className="pnl-text">{getPnLType(el)}</span>
              </span>
              <span>
                {el.orderType === 1
                  ? formatByPriceTick(el.orderPrice, el.contractId)
                  : t("Market")}
              </span>
              <span>{el.quantity === 999999 ? t("AllClose") : el.quantity}</span>
              <span>{getTriggerType(el)}</span>
              <span>{TriggeringConditions(el)}</span>
              <span>
                {el.positionEffect === 1
                  ? `${el.marginType === 1 ? t("FullPosition") : t("isolated")}${
                      el.marginRate ? ` / ${Math.round(1 / el.marginRate)}x` : ""
                    }`
                  : "--"}
              </span>
              <span>
                {getTriggerStatus(el)}
              </span>
              <span>{dateFormat2(el.createTime)}</span>
              <span className="operate">
                <Button
                  width={"100%"}
                  variant={"secondary"}
                  isDark={true}
                  scale={"xs"}
                  onClick={() => cancleOrder(el)}
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

export default ConOrder;
