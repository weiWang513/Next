import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Flex,
  Button,
  Input,
  Modal,
  ModalProps,
  InputGroup,
  Slider,
  message
} from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import {
  updateCostBuy,
  updateCostSell,
  updateCount,
  updateLever,
  updateModeType,
  updatePercent
} from "../../../../store/modules/placeSlice";
import { ReactComponent as Minus } from "/public/images/SVG/minus.svg";
import { ReactComponent as Plus } from "/public/images/SVG/plus.svg";
import { ReactComponent as LeverTips } from "/public/images/SVG/leverTip.svg";
import { ReactComponent as LeverWarn } from "/public/images/SVG/leverWarn.svg";
import { adjustMarginRate } from "../../../../services/api/contract";
import { uuid } from "../../../../utils/utils";
import { savePlaceParams } from "../../../../utils/common";
import { _shouldRestful } from "../../../../utils/tools";
const Big = require("big.js");

const ModeContent = styled.div`
  width: 100%;
  padding-top: 0;
  padding-bottom: 24px;
`;

const Warn = styled(Flex)`
  width: 288px;
  min-height: 28px;
  background: rgba(236, 81, 109, 0.2);
  border-radius: 4px;
  padding: 8px;
  align-items: flex-start;
  span {
    flex: 0 0 248px;
    font-size: 12px;
    font-weight: 500;
    color: #ec516d;
    line-height: 20px;
    text-align: left;
  }
  margin-top: 8px;
  margin-bottom: 8px;
  text-align: center;
  justify-content: center;
`;
const Tips = styled(Flex)`
  width: 288px;
  min-height: 28px;
  background: rgba(255, 182, 37, 0.2);
  border-radius: 4px;
  padding: 8px;
  align-items: flex-start;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #ffb625;
    line-height: 20px;
    text-align: left;
  }
  margin-top: 18px;
  justify-content: center;
`;

const MinusIcon = styled(Minus)`
  cursor: pointer;
`;
const PlusIcon = styled(Plus)`
  cursor: pointer;
`;

const leverModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const lever = useAppSelector((state) => state.place.lever);
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const varietyMarginAll = useAppSelector((state) => state.contract.varietyMarginAll);
  const maxLever = useAppSelector((state) => state.place.maxLever);
  const [posiMaxLever, setPosiMaxLever] = useState(100);
  const [leverS, setLever] = useState<number | string>(1);
  const [dotList, setDotList] = useState<number[] | null>([1]);

  const [adjustMarginRateUuid, setAjustMarginRateUuid] = useState(uuid());
  const dispatch = useAppDispatch();
  useEffect(() => {
    setLever(props.lever);
  }, [props.lever]);

  useEffect(() => {
    if (props.isPosi) {
      getPosiMaxLever();
    }
  }, []);

  const confirm = (): void => {
    if (props.isPosi) {
      changeMarginRate(props.posi, leverS, () => onDismiss());
      if (props.posi?.contractId === contractItem?.contractId) {
        dispatch(updateCount(""));
        dispatch(updateCostBuy(""));
        dispatch(updateCostSell(""));
        dispatch(updatePercent(0));
      }
    } else {
      let _lever = leverS > maxLever ? maxLever : leverS;
      dispatch(updateLever(_lever));
      dispatch(updateCount(""));
      dispatch(updateCostBuy(""));
      dispatch(updateCostSell(""));
      dispatch(updatePercent(0));
      savePlaceParams("lever", _lever);
      onDismiss();
    }
  };

  const getPosiMaxLever = () => {
    let _margin = varietyMarginAll[`${props.posi.contractId}`]?.[0]?.initRate;
    const maxLever = new Big(1)
      .div(_margin || 0.01)
      .round()
      .toString();

    setPosiMaxLever(maxLever);
  };

  const changeMarginRate = (item, lever, f) => {
    // let marginRate = String(1 / lever).slice(0, 8);
    let marginRate = new Big(1)
      .div(lever || 0.01)
      .round(6)
      .toString();
    const params = {
      contractId: item.contractId,
      // initMarginRate: marginType === 1 ? '0' : marginRate,
      initMarginRate: marginRate,
      marginType: item.marginType,
      posiSide: item.posiSide
    };

    adjustMarginRate({
      params: params,
      headers: { unique: adjustMarginRateUuid }
    })
      .then((res) => {
        setAjustMarginRateUuid(uuid());
        if (res.data.code === 0) {
          message.success(t("ModifiedSuccessful"));
          // message.success(I18n.t('ChangedSuccess'))
          _shouldRestful();
          f();
        }
      })
      .catch((err) => {
        setAjustMarginRateUuid(uuid());
        f();
      });
  };

  const handleChange = (e) => {
    let _maxLever = props.isPosi ? posiMaxLever : maxLever;
    // let reg = /^\d+\.?\d*$/;
    // if (reg.test(e.target.value)) {
    if (e.target.value === "") {
      setLever(e?.target?.value);
      return;
    }
    if (Number(e?.target?.value) <= Number(_maxLever)) {
      setLever(Number(e?.target?.value));
    } else {
    }
    // } else {

    // }
  };
  const handleSliderChange = (newValue: number) => {
    setLever(newValue);
  };
  const changeLever = (v: number): void => {
    let L = leverS;
    let _maxLever = props.isPosi ? posiMaxLever : maxLever;
    if (v > 0) {
      if (Number(leverS) + 1 > Number(_maxLever)) {
        return;
      }
      setLever(Number(L) + 1);
    } else {
      if (Number(leverS) - 1 < 1) {
        return;
      }
      setLever(Number(L) - 1);
    }
  };
  const { t } = useTranslation();
  const btnDisabled = (): boolean => {
    let _maxLever = props.isPosi ? posiMaxLever : maxLever;
    return leverS > _maxLever || !Number(leverS);
  };
  const renderTips = () => {
    let _maxLever = props.isPosi ? posiMaxLever : maxLever;
    return (
      <>
        {leverS > _maxLever && (
          <Tips>
            <LeverTips />
            <span>
              {props.isPosi ? props.posi?.symbol : contractItem?.symbol} {t("MaxLeverTip")}
              {_maxLever}x
            </span>
          </Tips>
        )}
      </>
    );
  };

  const getDotList = () => {
    // 25倍及以下：每五倍一档
    // 50倍及以下：每十倍一档
    // 50倍以上：每二十五倍一档

    let _maxLever = props.isPosi ? posiMaxLever : maxLever;

    const _during = _maxLever <= 25 ? 5 : _maxLever <= 50 ? 10 : _maxLever > 50 ? 25 : 25;

    let _dotList = [1];

    for (let i = 1; i <= Number(_maxLever) / _during; i++) {
      _dotList.push(i * _during);
    }

    setDotList(_dotList);
  };

  useEffect(() => {
    getDotList();
  }, [props.isPosi, posiMaxLever, maxLever]);

  return (
    <Modal
      title={t("AdjustLeverage")}
      width={"336px"}
      onDismiss={onDismiss}
      {...props}
      isDark={true}
    >
      <ModeContent>
        <InputGroup
          isDark={true}
          startIcon={<MinusIcon onClick={() => changeLever(-1)} />}
          // hasClear={value != ''}
          endIcon={<PlusIcon onClick={() => changeLever(1)} />}
          ep={1}
          sp={1}
          scale={"md"}
          ta={"center"}
        >
          <Input
            scale={"md"}
            type="text"
            fontSize={20}
            value={leverS}
            onChange={handleChange}
            isDark={true}
          />
        </InputGroup>
        {leverS >= 50 && (
          <Warn>
            <LeverWarn /> <span>{t("LeverWarn")}</span>
          </Warn>
        )}
        <Slider
          name="slider"
          min={1}
          max={props.isPosi ? posiMaxLever : maxLever}
          value={leverS === "" ? 1 : leverS}
          onValueChanged={handleSliderChange}
          step={1}
          dotList={dotList}
          showLabel
        />
        {renderTips()}
        <Button
          width="100%"
          variant={"primary"}
          onClick={confirm}
          mt="44px"
          isDark={true}
          disabled={btnDisabled()}
        >
          {t("ConfirmB")}
        </Button>
      </ModeContent>
    </Modal>
  );
};

export default leverModal;
