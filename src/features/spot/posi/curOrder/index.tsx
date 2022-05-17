import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Button, message, useModal, ModalProps, Modal } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { uuid } from "../../../../utils/utils";
import { cancelAllOrder, cancelOrder } from "../../../../services/api/spot";
import { formatSpotPriceByTick, toFix6, dateFormat2, getCurrencyPrecisionById } from "../../../../utils/filters";
import NoData from "../../../../components/NoData";
import { ReactComponent as GraphTip } from "/public/images/components/graph_tip.svg";

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
      flex: 0 0 150px;
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

const DialogContent = styled.div`
  padding: 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 24px;
`;

const Btns = styled(Flex)`
  justify-content: space-between;
  margin: 24px 0;
`;

const DialogConfirmCancelAllOrders: React.FC<ModalProps> = ({
  title,
  onOk,
  onDismiss,
  ...props
}) => {
  const { t } = useTranslation();

  const handleOkClicked = () => {
    onOk?.();
    onDismiss?.();
  }

  return <Modal
    title={''}
    onDismiss={onDismiss}
    isDark={true}
    {...props}>

    {/* 弹窗内容 */}
    <DialogContent>
      <GraphTip />
      <div>{t('CancelAllOrders')}</div>
    </DialogContent>
    {/* Footer Buttons */}
    <Btns>
      <Button
        width="47%"
        variant={"secondary"}
        onClick={() => onDismiss?.()}
        isDark={true}>
        {t('Cancel')}
      </Button>
      <Button
        width="47%"
        variant={"primary"}
        onClick={() => handleOkClicked()}
      >
        {t('ConfirmB')}
      </Button>
    </Btns>
  </Modal>
};

const CurOrder = () => {
  const [orderList, setOrderList] = useState([]);

  const hideOther = useAppSelector((state) => state.spot?.hideOther);
  const contractId = useAppSelector((state) => state.spot?.spotId);
  const spotList = useAppSelector((state) => state.spot?.spotList);
  const curOrder = useAppSelector((state) => state.spot?.curOrder);
  const { colorUp, colorDown } =
    useUpDownColor();
  const { t } = useTranslation();

  const [openConfirmDialog] = useModal(
    <DialogConfirmCancelAllOrders
      onOk={() => doCancelAllOrder()}>
    </DialogConfirmCancelAllOrders>,
  );

  useEffect(() => {
    let _list = hideOther
      ? curOrder.filter((el) => el?.contractId === contractId)
      : curOrder || [];
    setOrderList(_list);
  }, [hideOther, contractId, curOrder]);

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
      }
    });
  };

  const handleCancleAllOrder = () => {
    openConfirmDialog?.();
  };

  const doCancelAllOrder = () => {
    if (!curOrder.length) {
      message.error(t("openOrdersEmpty"));
      return false;
    }
    cancelAllOrder({
      headers: { unique: uuid() },
    }).then((res) => {
      if (res.data.code === 0) {
        message.success(t("CancelledSucceed"));
      }
    });
  };

  const curItem = (id) => {
    if (!id) return null
    const spotItem = spotList.find(item => item.contractId === id)
    return spotItem ? spotItem : {}
  }

  const getValue = el => {
    return toFix6(el.price * el.quantity, getCurrencyPrecisionById(curItem(el.contractId).currencyId))
  }


  return (
    <Table>
      <div className="table-head">
        <span className="symbol">{t("SpotPair")}</span>
        <span>{t("OrderType")}</span>
        <span>{t("Side")}</span>
        <span>{t("OrderPrice")}</span>
        <span>{t("OrderAmount")}</span>
        <span>{t("FilledAmount")}</span>
        <span>{t("RemainingAmount")}</span>
        <span>{t("OrderMoney")}</span>
        <span className="time">{t("Time")}</span>
        <span className="operate">
          <span>{t("PosiOption")}</span>
          <Button
            variant={"text"}
            isDark={true}
            scale={"xs"}
            onClick={() => handleCancleAllOrder()}
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
                  {curItem(el.contractId).symbol}
                </span>
              </span>
              <span>{el.orderType === 1 ? t("limit") : t("market")}</span>
              <span
                style={{
                  color: el.side > 0 ? colorUp : colorDown,
                }}
              >
                {el.side > 0 ? t("Buy") : t("Sell")}
              </span>
              <span>{formatSpotPriceByTick(el.price, el.contractId)}</span>
              <span>{toFix6(el.quantity, getCurrencyPrecisionById(curItem(el.contractId).commodityId))} {curItem(el.contractId).commodityName}</span>
              <span>{toFix6(el.matchQty, getCurrencyPrecisionById(curItem(el.contractId).commodityId))} {curItem(el.contractId).commodityName}</span>
              <span>{toFix6(el.leftQuantity, getCurrencyPrecisionById(curItem(el.contractId).commodityId))} {curItem(el.contractId).commodityName}</span>
              <span>{getValue(el)} {curItem(el.contractId).currencyName}</span>
              <span className="time">{dateFormat2(el.placeTimestamp / 1000)}</span>
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
