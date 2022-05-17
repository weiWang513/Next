import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  Flex,
  Button,
  Input,
  Modal,
  ModalProps,
  InputGroup,
  CheckboxGroup,
  message,
  Tooltip
} from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { ReactComponent as Ques } from "/public/images/SVG/ques.svg";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getInjectInfo, setInjectInfo } from "../../../../functions/info";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { formatByPriceTick } from "../../../../utils/filters";
import {
  updatePosiReversePrice,
  updatePosiReversePriceType,
  updatePosiReverseQty
} from "../../../../store/modules/assetsSlice";
import { posiReverseQCalc, posiReverseVCalc } from "../../../../utils/tools";
import { posiReverse } from "../../../../services/api/contract";
import { uuid } from "../../../../utils/utils";
const Big = require("big.js");

const ModeContent = styled.div`
  width: 100%;
  padding-top: 0;
  padding-bottom: 24px;
  user-select: none;
`;

const BtnW = styled(Flex)`
  justify-content: space-between;
  margin: 24px 0 0 0;
`;
const PosiInfo = styled.div`
  width: 100%;
  border-radius: 8px;
  // padding: 0 0 16px 0;
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
  padding-right: 16px;
  border-right: 1px solid rgba(24, 18, 38, 1);
`;
const InfoR = styled.div`
  height: 40px;
  flex: 1;
  padding-left: 16px;
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
    span {
      color: rgba(97, 89, 118, 1);
    }
  }
`;

const AddonBefore = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
`;
const AddonAfter = styled.div`
  width: 43px;
  font-size: 12px;
  text-align: center;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #ffffff;
  padding-left: 12px;
  line-height: 16px;
  border-left: 1px solid rgba(63, 55, 85, 1);
`;

const PriceWarp = styled(Flex)`
  margin-top: 16px;
`;

const PriceTypeSw = styled(Flex)`
  flex: 0 0 120px;
  height: 32px;
  background: #1f1830;
  border-radius: 4px;
  margin-right: 8px;
  span {
    dispaly: inline-block;
    flex: 1;
    height: 32px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
  span.index {
    background: #3f3755;
    color: #fff;
  }
`;

const Warn = styled.div`
  width: 288px;
  background: rgba(236, 81, 109, 0.1);
  border-radius: 8px;
  padding: 16px;
  margin-top: 16px;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #ec516d;
    line-height: 17px;
    margin-top: 4px;
    display: inline-block;
  }
`;
const CheckT = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #ec516d;
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

const CancleOrderW = styled.div`
  margin-top: 16px;
`;

const ToolTipsT = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  line-height: 17px;
  margin-bottom: 8px;
`;

const posiReverseModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const { t } = useTranslation();
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();
  const contractList = useAppSelector((state) => state.contract.allContractList);
  const posiReverseQty = useAppSelector((state) => state.assets.posiReverseQty);
  const posiReversePriceType = useAppSelector((state) => state.assets.posiReversePriceType);
  const posiReversePrice = useAppSelector((state) => state.assets.posiReversePrice);
  const placeConfirm = useAppSelector((state) => state.app.placeConfirm);
  const posListProps = useAppSelector((state) => state.assets.posListProps);

  const [checked, setChecked] = useState(false);
  const dispatch = useAppDispatch();
  const [cancleOrderF, setCancleOrderF] = useState(false);
  const posiReverseMax = useRef(0);

  const contractItem = useRef<{ contractSide?; currencyName?; commodityName? }>({});
  const posiReverseQ = useRef<number | string>("");
  const posiReverseValue = useRef<number | string>("");
  const _uuid = useRef(uuid());

  useEffect(() => {
    contractItem.current = contractList.find((item) => item.contractId === props.posi?.contractId);
    let _checked = Boolean(getInjectInfo("riskChecked"));
    setChecked(_checked);
    dispatch(updatePosiReversePriceType(3));
    dispatch(updatePosiReversePrice(""));
    dispatch(
      updatePosiReverseQty(cancleOrderF ? props.posi?.absQuantity : Math.abs(props.posi?.fairQty))
    );
  }, []);

  useEffect(() => {
    if (Number(posiReverseQty)) {
      posiReverseQ.current = posiReverseQCalc(props.posi, contractItem.current, posiReverseQty);
      posiReverseValue.current = posiReverseVCalc(props.posi, contractItem.current, posiReverseQty);
      console.log("posiReverseQty", posiReverseQty, posiReverseQ.current, posiReverseValue.current);
    }
  }, [props.posi, posiReverseQty]);

  useEffect(() => {
    if (
      !posListProps?.find(
        (e) => e.contractId === props.posi.contractId && e.side === props.posi.side
      )
    ) {
      onDismiss();
      return;
    }
  }, [posListProps]);

  const confirm = (): void => {
    console.log("confirm", posiReverseQ.current);
    if (!Number(posiReverseQ.current)) {
      message.info(t("NumNotEno"));
      return;
    }
    let _f = checkReversePosiMode();
    if (_f) {
      message.info(t("MarginR"));
      return;
    }
    setInjectInfo("known", 1);
    if (posiReversePriceType === 1) {
      priceCompare();
    } else {
      Place();
    }
  };

  const checkReversePosiMode = () => {
    let _reversed = posListProps.find(
      (e) => e.contractId === props.posi.contractId && e.side === props.posi.side * -1
    );
    if (
      _reversed &&
      (_reversed.marginType !== props.posi.marginType ||
        _reversed.initMarginRate !== props.posi.initMarginRate)
    ) {
      return true;
    }
  };

  const Place = () => {
    if (placeConfirm) {
      props.showModal();
      onDismiss();
    } else {
      PlaceH();
    }
  };

  const PlaceH = (): void => {
    console.log("posiReverseQ", posiReverseQ.current);
    if (posiReverseQ.current < 1) {
      message.info(t("NumNotEno"));
      return;
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

  const cancel = (): void => {
    dispatch(updatePosiReversePrice(""));
    dispatch(updatePosiReverseQty(""));
    onDismiss();
  };

  const renderNumPerfix = () => {
    return (
      <AddonBefore>
        {t("posiReverseMax", {
          posiQty: cancleOrderF ? props.posi?.absQuantity : Math.abs(props.posi?.fairQty)
        })}
      </AddonBefore>
    );
  };

  const renderNumAddonAfter = () => {
    return <AddonAfter>{t("Cont")}</AddonAfter>;
  };

  const handleChangeNum = (v): void => {
    const _Temp = v.target.value.match(/^\d*()/g)[0] || null;
    dispatch(updatePosiReverseQty(_Temp || ""));
  };

  const renderPerfix = () => {
    return <AddonBefore>{t("OrderPrice")}:</AddonBefore>;
  };

  const disable = () => {
    let _maxPosi = cancleOrderF ? props.posi?.absQuantity : Math.abs(props.posi?.fairQty);
    const _d =
      Number(posiReverseQty) &&
      Number(posiReverseQty) <= _maxPosi &&
      ((posiReversePriceType === 1 && Number(posiReversePrice)) || posiReversePriceType === 3) &&
      checked;
    console.log("disable", _d);
    return _d;
  };

  const handleChange = (v) => {
    // let n = v.target.value
    // if (n === '') {
    //   setStopPrice('')
    //   return
    // }
    // if (!Number(n) && Number(n)!== 0) {
    //   return
    // }
    // const _priceTick = String(priceTick()).split('.')[1].length
    // // const _Temp = v.target.value.match(/^\d*(\.?\d{0,2})/g)[0] || null
    // let _de = v.target.value.indexOf('.') > 0 ? v.target.value.split('.')[1].length : 0
    // if (_de <= _priceTick) {
    //   setStopPrice(n)
    // }

    let n = v.target.value;
    let _priceTick = priceTick();
    if (!_priceTick) {
      return false;
    }
    if (n === "") {
      dispatch(updatePosiReversePrice(""));
    }
    let pt = _priceTick;
    let reg = /^\d+\.?\d*$/;
    let regNumber = /^\d+\.?\d+$/;
    if (reg.test(n)) {
      if (pt && regNumber.test(n)) {
        let price = Number.isInteger(Number(new Big(n).div(pt)))
          ? n
          : new Big(Math.floor(new Big(n).div(pt))).times(pt).toString();
        dispatch(updatePosiReversePrice(price.length > 8 ? price.slice(0, 9) : price));
      } else {
        dispatch(updatePosiReversePrice(n));
      }
    } else {
      return false;
    }
  };
  const priceTick = () => {
    let item = contractList.find((el) => el.contractId === props?.posi?.contractId);
    return item ? item?.priceTick : 0.05;
  };

  const renderModalT = () => {
    const tips = props.posi?.posiSide === 0 ? t("posiReverseS") : t("posiReverseD");
    return (
      <ModalT>
        <span>{t("posiReverse")}</span>
        <Tooltip
          text={tips}
          tipWidth={314}
          hideTargetDecoration
          textTitle={
            <ToolTipsT>{`[${t("posiReverse")} - ${
              props.posi?.posiSide === 0 ? t("SingleSide") : t("DoubleSide")
            }]`}</ToolTipsT>
          }
        >
          <Ques />
        </Tooltip>
      </ModalT>
    );
  };

  const priceCompare = () => {
    let clearPrice = new Big(props.posi?.clearPrice || 1);
    let lastPrice = new Big(props.posi?.lastPrice || 1);
    let _lever = new Big(1).div(props.posi?.initMarginRate).round(0, 0);
    let comparePriceH = Number(
      clearPrice.times(new Big(1).plus(new Big(0.5).div(_lever))).toString()
    );
    let comparePriceL = Number(
      lastPrice.times(new Big(1).minus(new Big(0.5).div(_lever))).toString()
    );
    console.log("comparePriceH", comparePriceH, comparePriceL, posiReversePrice);
    if (
      (props.posi?.side < 0 && Number(posiReversePrice) > comparePriceH) ||
      (props.posi?.side > 0 && Number(posiReversePrice) < comparePriceL)
    ) {
      message.info(t("NumNotEno"));
    } else {
      Place();
      console.log("comparePriceH", "comparePriceH");
    }
  };

  const setPriceType = (v: number): void => {
    dispatch(updatePosiReversePriceType(v));
    if (v === 1) {
      dispatch(updatePosiReversePrice(props?.posi?.lastPrice));
    } else {
      dispatch(updatePosiReversePrice(""));
    }
  };
  return (
    <Modal title={renderModalT()} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
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
            <Qty></Qty>
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
                <span className="label">{t("StopLast")}:</span>
                <span className="value">
                  {formatByPriceTick(props?.posi?.lastPrice, props?.posi?.contractId)}
                </span>
              </InfoLine>
            </InfoL>
            <InfoR>
              <InfoLine>
                <span className="label">{t("PosiQty")}:</span>
                <span className="value">
                  {props.posi?.absQuantity} <span>{t("Cont")}</span>{" "}
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
        <InputGroup
          isDark={true}
          startIcon={renderNumPerfix()}
          // hasClear={value != ''}
          endIcon={renderNumAddonAfter()}
          mt="16px"
          ta={"right"}
          scale={"md"}
        >
          <Input
            scale={"md"}
            type="text"
            value={posiReverseQty}
            maxLength={10}
            onChange={handleChangeNum}
            isDark={true}
          />
        </InputGroup>
        <CancleOrderW>
          <CheckboxGroup
            text={<Tooltip text={t("ClosePOrderTips")}>{t("ClosePOrder")}</Tooltip>}
            checked={cancleOrderF}
            onChange={() => setCancleOrderF(!cancleOrderF)}
            isDark
          />
        </CancleOrderW>
        <PriceWarp>
          <PriceTypeSw>
            <span
              className={posiReversePriceType === 3 ? "index" : ""}
              onClick={() => setPriceType(3)}
            >
              {t("market")}
            </span>
            <span
              className={posiReversePriceType === 1 ? "index" : ""}
              onClick={() => setPriceType(1)}
            >
              {t("limit")}
            </span>
          </PriceTypeSw>
          {posiReversePriceType === 1 && (
            <InputGroup
              isDark={true}
              startIcon={renderPerfix()}
              // hasClear={value != ''}
              ta={"right"}
              scale={"sm"}
            >
              <Input
                scale={"md"}
                type="text"
                value={posiReversePrice}
                maxLength={9}
                onChange={handleChange}
                isDark={true}
              />
            </InputGroup>
          )}
        </PriceWarp>
        <Warn>
          <CheckboxGroup
            text={<CheckT>{t("posiReverseWarnT")}</CheckT>}
            checked={checked}
            onChange={() => setChecked(!checked)}
            scale={"md"}
            bg="rgba(236, 81, 109, 1)"
            isDark
          />
          <span>{t("posiReverseWarn")}</span>
        </Warn>
        <BtnW>
          <Button
            scale={"md"}
            width="47%"
            variant={"secondary"}
            onClick={() => cancel()}
            isDark={true}
          >
            {t("Cancel")}
          </Button>
          <Button
            scale={"md"}
            width="47%"
            variant={"primary"}
            disabled={!disable()}
            isDark={true}
            onClick={confirm}
          >
            {t("ConfirmB")}
          </Button>
        </BtnW>
      </ModeContent>
    </Modal>
  );
};

export default posiReverseModal;
