import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Flex, Button, Input, Modal, ModalProps, useModal, Slider, message } from "@ccfoxweb/uikit";
import { useTranslation, Trans } from "next-i18next";
import { ReactComponent as DeleteOrder } from "/public/images/SVG/deleteOrder.svg";
import { useAppSelector } from "../../../../store/hook";
import { formatByPriceTick, toFix6 } from "../../../../utils/filters";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import NoData from "./PnlNoData";
import PnlAdd from "./PnlAdd";
import { featureProfit } from "../../../../utils/common";
import { cancelCondOrder } from "../../../../services/api/contract";
import { uuid } from "../../../../utils/utils";
import { _trackEvent } from "../../../../utils/tools";
const Big = require("big.js");

const ModeContent = styled.div`
  padding-top: 0;
  padding-bottom: 24px;
  width: 100%;
`;

const PosiInfo = styled.div`
  height: 96px;
  background: #1f1830;
  border-radius: 8px;
  padding: 16px;
  padding-top: 4px;
`;

const PosiInfoT = styled(Flex)`
  height: 40px;
  span.symbol {
    font-size: 16px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: #ffffff;
  }
  span.side {
    dispaly: inline-block;
    padding: 0 6px;
    line-height: 20px;
    border-radius: 9px;
    font-size: 10px;
    font-weight: 500;
    color: ${({ c }) => c};
    background: ${({ bgc }) => bgc};
    margin-left: 4px;
  }
  span.posi-mode {
    dispaly: inline-block;
    padding: 0 6px;
    line-height: 20px;
    background: #3f3755;
    border-radius: 9px;
    font-size: 10px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    margin-left: 4px;
    color: #ffffff;
  }
  span.qty {
    dispaly: inline-block;
    flex: 1;
    dispaly: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
    span {
      color: #fff;
    }
  }
`;

const Qty = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  line-height: 17px;
  span {
    color: #fff;
  }
`;

const Info = styled(Flex)``;
const InfoL = styled.div`
  height: 40px;
  flex: 1;
  padding-right: 24px;
  border-right: 1px solid rgba(24, 18, 38, 1);
`;
const InfoR = styled.div`
  height: 40px;
  flex: 1;
  padding-left: 24px;
`;
const InfoLine = styled(Flex)`
  height: 18px;
  margin-bottom: 4px;
  justify-content: space-between;
  span.label {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
  }
  span.value {
    font-size: 12px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: ${({ c }) => c || "#FFFFFF"};
  }
`;

const PnlTWarp = styled(Flex)`
  justify-content: space-between;
  height: 48px;
  span.l {
    font-size: 14px;
    font-weight: 500;
    color: #615976;
  }
  span.r {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    strong.p {
      color: ${({ pc }) => pc};
    }
    strong.lo {
      color: ${({ lc }) => lc};
    }
  }
`;

const Pnl = styled.div`
  display: flex;
  font-size: 12px;
  font-weight: 500;
  color: #615976;
`;
const Pnln = styled.div<{ c? }>`
  color: ${({ c }) => c};
`;

const OrderItem = styled(Flex)`
  width: 352px;
  height: 85px;
  // padding: 12px 20px;
  background: #1f1830;
  border-radius: 4px;
  margin-bottom: 8px;
  span.l {
    display: inline-block;
    width: 4px;
    height: 85px;
    background: ${({ bgc }) => bgc};
    border-radius: 4px 0px 0px 4px;
  }
`;

const OrderInfo = styled.div`
  position: relative;
  flex: 1;
  padding: 12px 0 12px 16px;
`;

const OrderItemLine = styled(Flex)`
  margin-bottom: ${({ mb }) => mb};
  span {
    font-size: 12px;
    font-weight: 500;
    color: rgba(97, 89, 118, 1);
  }
  span.n {
    font-size: 12px;
    font-weight: 500;
    color: ${({ c }) => c || "#615976"};
  }
  span.type {
    padding: 0 6px;
    height: 20px;
    font-size: 10px;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
    background: #3f3755;
    border-radius: 9px;
    margin-left: 8px;
  }
`;

const OrderList = styled.div`
  height: 268px;
  overflow: overlay;
`;

const DeleteOrderIcon = styled(DeleteOrder)`
  position: absolute;
  // top: 45px;
  bottom: 8px;
  right: 8px;
  cursor: pointer;
`;

const CreateBtns = styled(Flex)`
  margin-top: 16px;
`;

const CreateProfitBtn = styled(Button)`
  flex: 1;
  margin-right: ${({ mr }) => mr};
`;

const CreateLossBtn = styled(CreateProfitBtn)``;

const pnlEditModal: React.FC<ModalProps> = ({ title, onDismiss, ...props }) => {
  const [subOpen, setSubOpen] = useState(false);
  const [cancelUuid, setCancelUuid] = useState(uuid());
  const { t } = useTranslation();
  const contractList = useAppSelector((state) => state.contract.allContractList);
  const [pnlFlag, setPnlFlag] = useState(1);

  const conditionOrders = useAppSelector((state) => state.assets.conditionOrders);

  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();

  const contractItem = useRef<{
    contractSide?;
    commodityName?;
    currencyName?;
  }>({});

  useEffect(() => {
    contractItem.current = contractList.find((e) => e.contractId === props.posi.contractId);
  }, []);
  const subOpenAction = (v: number): void => {
    if (v > 0) {
      let _f = props.posi?.profitList.find((e) => e.quantity === 999999);
      if (_f) {
        message.info(t("StopPWarn"));
        return;
      }
    } else {
      let _f = props.posi?.lossList.find((e) => e.quantity === 999999);
      if (_f) {
        message.info(t("StopLWarn"));
        return;
      }
    }
    setPnlFlag(v);
    setSubOpen(true);
  };

  const subPanel = () => {
    return <PnlAdd posi={props.posi} pnlFlag={pnlFlag} closeAdd={(v) => setSubOpen(v)} />;
  };

  const TriggeringConditions = (item) => {
    let _comparePrice = item.curtPrice;
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

  const getPriceType = (item) => {
    switch (item.triggerType) {
      case 2:
        return t("StopLast");
      case 3:
        return t("StopIndex");
      case 4:
        return t("StopMark");

      default:
        break;
    }
  };

  // 预计盈亏
  const featurePL = (e) => {
    return featureProfit(
      true,
      e.triggerPrice,
      props?.posi,
      e.quantity === 999999 ? props.posi.absQuantity : e.quantity
    );
  };
  // const featurePL2 = (e) => {
  //   return featureLoss(true, e.triggerPrice, props?.posi)
  // }

  const cancleOrder = (v) => {
    console.log(v, "cancleOrder");
    const params = {
      conditionOrderId: v.conditionOrderId
    };
    cancelCondOrder({
      params,
      headers: { unique: cancelUuid }
    })
      .then((res) => {
        setCancelUuid(uuid());
        if (res.data.code === 0) {
          // this.props.cancleConOrder(v.orderId)
          // restfulConditionOrders()
          // message.success(I18n.t('CancelledSucceed'))
          _trackEvent(v.conditionOrderId, false, false);
          message.success(t("CancelS"));
        }
      })
      .catch((err) => {
        setCancelUuid(uuid());
        console.log(err, "-----wangwei----order");
      });
  };

  return (
    <Modal
      title={t("SetPnl")}
      onDismiss={onDismiss}
      subOpen={subOpen}
      subPanel={subPanel()}
      subPanelWidth={308}
      isDark={true}
      width={400}
      {...props}
    >
      <ModeContent>
        <PosiInfo>
          <PosiInfoT
            c={props?.posi?.side > 0 ? colorUp : colorDown}
            bgc={props?.posi?.side > 0 ? orderUpColorArea : orderDownColorArea}
          >
            <span className="symbol">{props.posi?.symbol}</span>
            <span className="side">{props?.posi?.side > 0 ? t("OpenLong") : t("OpenShort")}</span>
            <span className="posi-mode">{`${
              props.posi?.marginType === 1 ? t("FullPosition") : t("isolated")
            }/${new Big(1)
              .div(props.posi?.initMarginRate || 0.01)
              .round()
              .toString()}x`}</span>
            <Qty>
              {t("Quantity")}:<span>{props?.posi?.absQuantity}</span>
              {t("Cont")}
            </Qty>
          </PosiInfoT>
          <Info>
            <InfoL>
              <InfoLine>
                <span className="label">{t("EntryPrice")}:</span>
                <span className="value">
                  {formatByPriceTick(props?.posi?.openPrice, props?.posi?.contractId)}
                </span>
              </InfoLine>
              <InfoLine>
                <span className="label">{t("LiqPrice")}:</span>
                <span className="value">
                  {props?.strongPrice > 0
                    ? formatByPriceTick(props?.strongPrice, props?.posi?.contractId)
                    : 0}
                </span>
              </InfoLine>
            </InfoL>
            <InfoR>
              <InfoLine>
                <span className="label">{t("StopLast")}:</span>
                <span className="value">
                  {formatByPriceTick(props?.posi?.lastPrice, props?.posi?.contractId)}
                </span>
              </InfoLine>
              <InfoLine>
                <span className="label">{t("StopMark")}:</span>
                <span className="value">
                  {formatByPriceTick(props?.posi?.clearPrice, props?.posi?.contractId)}
                </span>
              </InfoLine>
            </InfoR>
          </Info>
        </PosiInfo>
        <PnlTWarp pc={colorUp} lc={colorDown}>
          <span className="l">{t("CurentPnl")}:</span>
          <Pnl>
            {t("HasBeenSet")} <Pnln c={colorUp}>{props.posi?.profitList?.length}</Pnln>{" "}
            {t("StopProfit")} / <Pnln c={colorDown}>{props.posi?.lossList?.length}</Pnln>{" "}
            {t("StopLoss")}
          </Pnl>
        </PnlTWarp>
        <OrderList>
          {props?.posi?.profitList?.length === 0 && props?.posi?.lossList?.length === 0 && (
            <NoData />
          )}
          {props?.posi?.profitList?.map((e, i) => {
            return (
              <OrderItem bgc={colorUp} key={i}>
                <span className="l"></span>
                <OrderInfo>
                  <OrderItemLine c="#fff" mb="8px">
                    <span>
                      {t("stopProfitPrice")}: <span className="n">{TriggeringConditions(e)}</span>{" "}
                      {contractItem.current?.contractSide === 2
                        ? contractItem.current?.commodityName
                        : contractItem.current?.currencyName}
                    </span>
                    <span className="type">{getPriceType(e)}</span>
                  </OrderItemLine>
                  <OrderItemLine c="#fff" mb="8px">
                    <span>
                      {t("holdPosiAmount")}:{" "}
                      <span className="n">
                        {e.quantity === 999999 ? t("stopAllP") : `${e.quantity} ${t("Cont")}`}
                      </span>
                    </span>
                  </OrderItemLine>
                  <OrderItemLine c="#fff">
                    <span>
                      {t("UProfit")}:{" "}
                      <span className="n">
                        {toFix6(featurePL(e), contractItem.current?.contractSide === 1 ? 2 : 6)}
                      </span>{" "}
                      {contractItem.current?.currencyName}
                    </span>
                  </OrderItemLine>
                  <DeleteOrderIcon onClick={() => cancleOrder(e)} />
                </OrderInfo>
              </OrderItem>
            );
          })}
          {props?.posi?.lossList?.map((e, i) => {
            return (
              <OrderItem bgc={colorDown} key={i}>
                <span className="l"></span>
                <OrderInfo>
                  <OrderItemLine c="#fff" mb="8px">
                    <span>
                      {t("StopLossPrice")}: <span className="n">{TriggeringConditions(e)}</span>{" "}
                      {contractItem.current?.contractSide === 2
                        ? contractItem.current?.commodityName
                        : contractItem.current?.currencyName}
                    </span>
                    <span className="type">{getPriceType(e)}</span>
                  </OrderItemLine>
                  <OrderItemLine c="#fff" mb="8px">
                    <span>
                      {t("holdPosiAmount")}:{" "}
                      <span className="n">
                        {e.quantity === 999999 ? t("stopAllL") : `${e.quantity} ${t("Cont")}`}
                      </span>
                    </span>
                  </OrderItemLine>
                  <OrderItemLine c="#fff">
                    <span>
                      {t("ULoss")}:{" "}
                      <span className="n">
                        {toFix6(featurePL(e), contractItem.current?.contractSide === 1 ? 2 : 6)}
                      </span>{" "}
                      {contractItem.current?.currencyName}
                    </span>
                  </OrderItemLine>
                  <DeleteOrderIcon onClick={() => cancleOrder(e)} />
                </OrderInfo>
              </OrderItem>
            );
          })}
        </OrderList>
        <CreateBtns>
          <CreateProfitBtn
            onClick={() => subOpenAction(1)}
            mr="8px"
            scale={"md"}
            variant={"success"}
          >
            {t("createSProfit")}
          </CreateProfitBtn>
          <CreateLossBtn onClick={() => subOpenAction(-1)} scale={"md"} variant={"danger"}>
            {t("createSLoss")}
          </CreateLossBtn>
        </CreateBtns>
      </ModeContent>
      {/* <Button onClick={subOpenAction}>open sub modal</Button> */}
    </Modal>
  );
};

export default pnlEditModal;
