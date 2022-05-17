import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Flex, Button, Input, Modal, ModalProps, message } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getTriggerSymbol, place } from "../../../../utils/common";
import { uuid } from "../../../../utils/utils";
import {
  updateCount,
  updateLossInput,
  updatePrice,
  updateProfitInput,
  updateStopPrice
} from "../../../../store/modules/placeSlice";
import { toFix6 } from "../../../../utils/filters";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { posiReverseQCalc, posiReverseVCalc } from "../../../../utils/tools";
import { posiReverse } from "../../../../services/api/contract";
import {
  updatePosiReversePrice,
  updatePosiReverseQty
} from "../../../../store/modules/assetsSlice";
import { setInjectInfo } from "../../../../functions/info";
const Big = require("big.js");

const ConfirmContent = styled.div`
  // height: 249px;
  width: 100%;
`;

const SymbolW = styled(Flex)`
  height: 40px;
  span.symbol {
    display: flex;
    font-size: 16px;
    font-weight: bold;
    margin-right: 4px;
    color: #fff;
  }
  span.side {
    display: flex;
    background: ${({ bgcB }) => bgcB};
    border-radius: 9px;
    padding: 0 6px;
    margin-right: 4px;
    line-height: 20px;
    span {
      font-size: 10px;
      font-weight: 500;
      color: ${({ c }) => c};
    }
  }
  span.lever {
    display: flex;
    background: #3f3755;
    border-radius: 9px;
    padding: 0 6px;
    line-height: 20px;
    span {
      font-size: 10px;
      font-weight: 500;
      color: #ffffff;
    }
  }
`;
const InfoItem = styled(Flex)`
  width: 100%;
  justify-content: space-between;
  span.l {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
  span.r {
    font-size: 12px;
    color: #615976;
    line-height: 15px;
    span.v {
      font-weight: bold;
      color: #ffffff;
      margin-right: 2px;
    }
  }
`;

const StopPNL = styled(Flex)`
  width: 288px;
  height: 58px;
  background: #1f1830;
  border-radius: 8px;
  margin-top: 12px;
`;

const StopPNLI = styled(Flex)`
  height: 38px;
  flex: 1;
  flex-direction: column;
  span.p {
    font-size: 14px;
    font-weight: bold;
    color: #14af81;
    line-height: 17px;
  }
  span.l {
    font-size: 14px;
    font-weight: bold;
    color: #ec516d;
    line-height: 17px;
  }
  span.label {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
`;

const StopPNLIL = styled(StopPNLI)`
  border-right: 1px solid #181226;
`;

const BtnW = styled(Flex)`
  justify-content: space-between;
  margin: 24px 0;
`;

const ConfirmContentTips = styled.div`
  width: 336px;
  padding: 20px 24px;
  background: rgba(31, 24, 48, 1);
  border-radius: 0px 0px 16px 16px;
  span {
    font-size: 12px;
    color: #615976;
  }
  span.t {
    font-size: 12px;
    color: #615976;
  }
  span.sub-t {
    font-size: 12px;
    font-weight: 600;
    color: #fff;
  }
`;
const NoPNL = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  width: 288px;
  height: 58px;
  background: #1f1830;
  border-radius: 8px;
  margin-top: 12px;
  span.t {
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 18px;
  }
  span.s-t {
    font-size: 12px;
    font-weight: 500;
    color: #3f3755;
    line-height: 17px;
  }
`;

const ModalT = styled(Flex)`
  span {
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;
    line-height: 22px;
    display: inline-block;
    margin-right: 8px;
  }
`;

const CustomModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const posiReverseQty = useAppSelector((state) => state.assets.posiReverseQty);
  const posiReversePriceType = useAppSelector((state) => state.assets.posiReversePriceType);
  const posiReversePrice = useAppSelector((state) => state.assets.posiReversePrice);
  const contractList = useAppSelector((state) => state.contract.allContractList);

  const posiReverseQ = useRef<number | string>("");
  const posiReverseValue = useRef<number | string>("");
  const contractItem = useRef<{ contractSide?; currencyName?; commodityName? }>({});

  const _uuid = useRef(uuid());

  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();

  const getPlaceSide = () => {
    switch (props.posi?.side) {
      case 1:
        return t("OpenShort");
      case -1:
        return t("OpenLong");

      default:
        break;
    }
  };

  const cancel = (f): void => {
    f();
    dispatch(updatePosiReversePrice(""));
    dispatch(updatePosiReverseQty(""));
  };

  const confirm = (f): void => {
    if (posiReverseQ.current < 1) {
      message.info(t("NumNotEno"));
    }
    const params = {
      contractId: props.posi?.contractId,
      posiSide: props.posi?.posiSide,
      marginType: props.posi?.marginType,
      marginRate: props.posi?.initMarginRate,
      closeNum: posiReverseQty,
      openNum: posiReverseQ.current <= posiReverseQty ? posiReverseQ.current : posiReverseQty,
      orderType: posiReversePriceType,
      price: posiReversePriceType === 1 ? posiReversePrice : ""
    };

    posiReverse({ params, headers: { unique: _uuid.current } })
      .then((res) => {
        dispatch(updatePosiReversePrice(""));
        dispatch(updatePosiReverseQty(""));
        _uuid.current = uuid();
        setInjectInfo("riskChecked", 1);
        onDismiss();
        if (res.data.code === 0) {
          message.success(t("submitSuccess"));
        }
      })
      .catch((err) => {
        dispatch(updatePosiReversePrice(""));
        dispatch(updatePosiReverseQty(""));
        _uuid.current = uuid();
        onDismiss();
        console.log(err);
      });
  };

  useEffect(() => {
    contractItem.current = contractList.find((item) => item.contractId === props.posi?.contractId);
    console.log("props.posi", props.posi);
  }, []);

  useEffect(() => {
    posiReverseQ.current = posiReverseQCalc(props.posi, contractItem.current, posiReverseQty);
    posiReverseValue.current = posiReverseVCalc(props.posi, contractItem.current, posiReverseQty);
  }, [props.posi]);

  const renderModalT = () => {
    return (
      <ModalT>
        <span>{t("PlaceConfirm")}</span>
      </ModalT>
    );
  };

  return (
    <Modal title={renderModalT()} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      <ConfirmContent>
        <SymbolW
          bgcB={props.posi?.side < 0 ? orderUpColorArea : orderDownColorArea}
          c={props.posi?.side < 0 ? colorUp : colorDown}
        >
          <span className="symbol">{props.posi?.symbol}</span>
          <span className="side">
            <span>{getPlaceSide()}</span>
          </span>
          <span className="lever">
            <span>
              {props.posi?.marginType === 1 ? t("FullPosition") : t("isolated")} /{" "}
              {new Big(1)
                .div(props.posi.initMarginRate || 0.01)
                .round()
                .toString()}
              x
            </span>
          </span>
        </SymbolW>
        <InfoItem>
          <span className="l">{t("ClosePQty")}:</span>
          <span className="r">
            <span className="v">{posiReverseQty}</span> {t("Cont")}
          </span>
        </InfoItem>
        <InfoItem>
          <span className="l">{t("ClosePValue")}:</span>
          <span className="r">
            <span className="v">
              {toFix6(posiReverseValue.current, contractItem.current?.contractSide === 1 ? 2 : 6)}
            </span>{" "}
            {contractItem.current.currencyName}
          </span>
        </InfoItem>
        <InfoItem>
          <span className="l">{t("ClosePOpenQty")}:</span>
          <span className="r">
            <span className="v">
              {posiReverseQ.current <= posiReverseQty ? posiReverseQ.current : posiReverseQty}
            </span>{" "}
            {t("Cont")}
          </span>
        </InfoItem>
        <InfoItem>
          <span className="l">{t("reversePriceType")}:</span>
          <span className="r">
            <span className="v">
              {posiReversePriceType === 3 ? t("market") : `${posiReversePrice}`}
            </span>{" "}
            {posiReversePriceType === 3
              ? ""
              : contractItem.current.contractSide === 1
              ? contractItem.current.currencyName
              : contractItem.current?.commodityName}
          </span>
        </InfoItem>
        <BtnW>
          <Button
            scale={"md"}
            width="47%"
            variant={"secondary"}
            onClick={() => cancel(onDismiss)}
            isDark={true}
          >
            {t("Cancel")}
          </Button>
          <Button scale={"md"} width="47%" variant={"primary"} onClick={confirm} isDark={true}>
            {t("ConfirmB")}
          </Button>
        </BtnW>
      </ConfirmContent>
      <ConfirmContentTips>
        <span className="sub-t">[{t("notice")}]：</span>
        <span className="t">{t("reverseTips")}</span>
      </ConfirmContentTips>
    </Modal>
  );
};

export default CustomModal;
