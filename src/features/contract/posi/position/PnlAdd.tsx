import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Flex, CheckboxGroup, Input, Button, message, InputGroup, Tooltip } from "@ccfoxweb/uikit";
import { ReactComponent as EditPnl } from "/public/images/SVG/editPnl.svg";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { chosePercent, featureLoss, featureProfit, place } from "../../../../utils/common";
import { uuid } from "../../../../utils/utils";
import { conditionCancels } from "../../../../services/api/contract";
import { toFix6 } from "../../../../utils/filters";
import { _trackEvent } from "../../../../utils/tools";
const Big = require("big.js");

const PnlAdd = styled(Flex)`
  width: 308px;
  height: 100%;
  flex-direction: column;
  background: #181226;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.6);
  border-radius: 16px;
  padding: 0 24px;
`;

const TitleR = styled.div`
  width: 100%;
  flex: 0 0 64px;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  line-height: 64px;
  text-align: left;
`;

const Main = styled.div`
  flex: 1;
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
const PricePercent = styled(Flex)`
  margin-top: 4px;
  span {
    display: inline-block;
    flex: 1;
    background: #1f1830;
    border-radius: 4px;
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #4a4062;
    line-height: 24px;
    margin-right: 4px;
    text-align: center;
    opacity: 1;
    cursor: pointer;
    &:hover {
      color: #615976;
      outline: 1px solid #3f3755;
      background: #1f1830;
    }
  }
  span:nth-last-child(1) {
    margin-right: 0;
  }
`;
const AllInPercent = styled(PricePercent)`
  span {
    background: rgba(19, 15, 29, 1);
    color: rgba(49, 40, 71, 1);
    &:hover {
      background: rgba(19, 15, 29, 1);
      color: rgba(49, 40, 71, 1);
    }
  }
`;

const StopType = styled(Flex)`
  margin-top: 12px;
`;
const PriceTypeSwitch = styled(Flex)`
  width: 120px;
  height: 32px;
  background: #1f1830;
  border-radius: 4px;
  span.item {
    width: 60px;
    height: 32px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    color: rgba(97, 89, 118, 1);
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
  span.item-indexd {
    color: #fff;
    background: rgba(63, 55, 85, 1);
  }
`;

const CheckBoxC = styled(Flex)`
  justify-content: flex-end;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    margin-left: 3px;
  }
`;

const UPnl = styled.div`
  width: 260px;
  height: 69px;
  background: #130f1d;
  border-radius: 4px;
  padding: 12px 16px;
  margin-top: 24px;
  span.t {
    display: block;
    font-size: 12px;
    font-weight: 500;
    color: #615976;
  }
`;
const UPnlt = styled(Flex)`
  align-items: baseline;
  span.n {
    font-size: 24px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: ${({ c }) => c};
    line-height: 31px;
    margin-right: 8px;
  }
  span.symbol {
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #615976;
    line-height: 15px;
  }
`;

const CreateBtns = styled(Flex)`
  padding-bottom: 24px;
`;

const CancelBtn = styled(Button)`
  flex: 1;
  margin-right: ${({ mr }) => mr};
`;
const SaveBtn = styled(CancelBtn)``;

const AllInInput = styled(Flex)`
  height: 40px;
  padding: 0 12px;
  background: rgba(19, 15, 29, 1);
  border-radius: 4px;
  justify-content: space-between;
  margin-top: 12px;
  span.label {
    font-size: 12px;
    font-weight: 500;
    color: rgba(49, 40, 71, 1);
  }
  span.qs {
    display: flex;
    flex-direction: row;
    align-items: center;
    font-size: 12px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: #312847;
    span.q {
      margin-right: 12px;
    }
    span.r {
      line-height: 16px;
      padding-left: 12px;
      border-left: 1px solid rgba(31, 24, 48, 1);
      min-width: 48px;
      text-align: center;
    }
  }
`;

const pnlAdd = (props) => {
  const [stopPrice, setStopPrice] = useState<string | number>("");
  const [orderNum, setOrderNum] = useState<string | number>("");
  const [stopPriceType, setStopPriceType] = useState(2);
  const [allIn, setAllIn] = useState(false);
  const crossLever = useAppSelector((state) => state.place.maxLever);
  const conditionOrders = useAppSelector((state) => state.assets.conditionOrders);
  const contractList = useAppSelector((state) => state.contract.allContractList);
  const profitPricePercent = [0.25, 0.5, 0.75, 1, 1.5, 2];
  const lossPricePercent = [0.05, 0.1, 0.2, 0.3, 0.4];
  const pricePercent = [0.25, 0.5, 0.75, 1, 1.5, 2];
  const numPercent = [0.2, 0.4, 0.6, 0.8, 1];
  const [loading, setLoading] = useState(false);
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();

  const { t } = useTranslation();
  const renderPerfix = () => {
    return (
      <AddonBefore>{props.pnlFlag > 0 ? t("StopProfitPrice") : t("StopLossPrice")}:</AddonBefore>
    );
  };

  const contractItem = useRef<{
    contractSide?;
    commodityName?;
    currencyName?;
  }>({});

  useEffect(() => {
    contractItem.current = contractList.find((e) => e.contractId === props.posi.contractId);
  }, []);

  useEffect(() => {
    console.log("_input", props.pnlFlag);
    setStopPrice("");
    setOrderNum("");
  }, [props.pnlFlag]);

  const renderAddonAfter = () => {
    return (
      <AddonAfter>
        {contractItem.current?.contractSide === 1
          ? contractItem.current?.currencyName
          : contractItem.current?.commodityName}
      </AddonAfter>
    );
  };
  const renderNumPerfix = () => {
    return <AddonBefore>{props.pnlFlag > 0 ? t("StopProfitQty") : t("StopLossQty")}:</AddonBefore>;
  };

  const renderNumAddonAfter = () => {
    return <AddonAfter>{t("Cont")}</AddonAfter>;
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
      setStopPrice("");
    }
    let pt = _priceTick;
    let reg = /^\d+\.?\d*$/;
    let regNumber = /^\d+\.?\d+$/;
    if (reg.test(n)) {
      if (pt && regNumber.test(n)) {
        let price = Number.isInteger(Number(new Big(n).div(pt)))
          ? n
          : new Big(Math.floor(new Big(n).div(pt))).times(pt).toString();
        setStopPrice(price.length > 8 ? price.slice(0, 9) : price);
      } else {
        setStopPrice(n);
      }
    } else {
      return false;
    }
  };
  const handleChangeNum = (v): void => {
    const _Temp = v.target.value.match(/^\d*()/g)[0] || null;
    setOrderNum(_Temp || "");
  };

  const priceTick = () => {
    let item = contractList.find((el) => el.contractId === props?.posi?.contractId);
    return item ? item?.priceTick : 0.05;
  };

  const setPercentPrice = (percent: number): void => {
    const _input = chosePercent(
      percent,
      props.pnlFlag > 0 ? "profit" : "loss",
      props.posi,
      crossLever,
      stopPrice,
      stopPrice,
      priceTick()
    );
    console.log("_input", _input);
    setStopPrice(props.pnlFlag > 0 ? _input?.inputProfit : _input?.inputLoss);
  };
  const setPercentNum = (e: number): void => {
    setOrderNum(Number(new Big(props.posi?.absQuantity || 0).times(e).round(0, 0).toString()));
  };

  // 预计盈亏
  const featurePL = () => {
    let _pnl =
      props?.pnlFlag > 0
        ? featureProfit(true, stopPrice, props?.posi, orderNum)
        : featureLoss(true, stopPrice, props?.posi, orderNum);
    const _d = contractItem.current.contractSide === 1 ? 2 : 6;

    return props.pnlFlag > 0
      ? Number(_pnl) > 0
        ? toFix6(_pnl, _d)
        : 0
      : Number(_pnl) < 0
      ? toFix6(_pnl, _d)
      : 0;
  };

  //   // 预计盈亏
  // const featurePL1 = () => {
  //   return featureProfit(true, inputProfit, holdPosiItem)
  // }
  // const featurePL2 = () => {
  //   return featureLoss(this.state.checkedLoss, this.state.inputLoss, this.state.holdPosiItem)
  // }

  const close = () => {
    setStopPrice("");
    setOrderNum("");
    setStopPriceType(2);
    setAllIn(false);
    props.closeAdd(false);
  };

  const stopCb = () => {
    setLoading(false);
    message.success(`${props.pnlFlag > 0 ? t("SetProfitS") : t("SetLossS")}`);
    close();
    // message.success(i18n.t('LossOrderSucceed'))
    // this.props.close()
  };

  const btnDisabled = () => {
    return !Number(stopPrice) && !Number(orderNum);
  };

  const placeCondition = () => {
    if (!Number(stopPrice)) {
      message.info(t("PriceWarn"));
      return;
    }
    if (!(Number(orderNum) || allIn)) {
      message.info(t("CountWarn"));
      return;
    }
    console.log("placeCondition", stopPrice, orderNum, allIn, !stopPrice || !(orderNum || allIn));
    let _comparePrice = props?.posi?.openPrice;
    if (props.pnlFlag > 0) {
      if (props?.posi?.side > 0) {
        if (Number(stopPrice) <= Number(_comparePrice)) {
          message.info(t("StopPPriceWarn"));
          return;
        }
      } else {
        if (Number(stopPrice) >= Number(_comparePrice)) {
          message.info(t("StopPPriceWarn"));
          return;
        }
      }
    } else {
      if (props?.posi?.side > 0) {
        if (Number(stopPrice) >= Number(_comparePrice)) {
          message.info(t("StopLPriceWarn"));
          return;
        }
      } else {
        if (Number(stopPrice) <= Number(_comparePrice)) {
          message.info(t("StopLPriceWarn"));
          return;
        }
      }
    }

    // if (allIn) {
    //   let _conditions = props.pnlFlag > 0 ? props.posi?.profitList : props.posi?.lossList
    //   if (_conditions.length) {
    //     let data = _conditions.map((el) => {
    //       return el?.conditionOrderId;
    //     });
    //     conditionCancels({
    //       params: { conditionOrderIdList: data },
    //       headers: { unique: uuid() },
    //     }).then((res) => {
    //       if (res.data.code === 0) {
    //         _trackEvent(data, false, true)

    //         // restfulConditionOrders();
    //         // message.success(t("CancelledSucceed"));
    //       }
    //     });
    //   }
    // }
    setLoading(true);
    let params = {
      modeType: props.posi?.marginType,
      gearingxie: Number(new Big(1).div(Number(props.posi?.initMarginRate)).toString()),
      contractId: props.posi?.contractId,
      side: props.posi?.side > 0 ? -1 : 1,
      quantity: allIn ? 999999 : orderNum,
      positionEffect: 2,
      orderSubType: 4, // 默认标记价触发
      hasReady: true,
      hasCancel: allIn ? true : false,
      uuid: uuid()
      // price: 0
    };
    let stopParams = {
      ...params,
      stopPrice: stopPrice,
      orderSubType: stopPriceType,
      type: 3, // 限价
      price: 0,
      conditionOrderType: calcPnlStatus(stopPrice)
    };
    place(
      stopParams,
      stopCb,
      () => {
        setLoading(false);
      },
      false
    );
  };

  /**
   * 判断止盈止损方向
   * @param {止盈止损价格} PnlPrice
   * return 1 止盈 2 止损
   */
  const calcPnlStatus = (PnlPrice) => {
    let _price = Number(props.posi.openPrice);
    if (Number(props.posi.side) > 0) {
      return Number(PnlPrice) > _price ? 1 : 2;
    } else {
      return Number(PnlPrice) < _price ? 1 : 2;
    }
  };

  const toolTips = () => {
    return (
      <Tooltip text={props.pnlFlag > 0 ? t("AllStopPTips") : t("AllStopLTips")} mb="5px">
        {`${props.pnlFlag > 0 ? t("AllProfit") : t("AllLoss")}`}
      </Tooltip>
    );
  };

  return (
    <PnlAdd>
      <TitleR>{props.pnlFlag > 0 ? t("stopProfit") : t("stopLoss")}</TitleR>
      <Main>
        <InputGroup
          isDark={true}
          startIcon={renderPerfix()}
          // hasClear={value != ''}
          ta={"right"}
          scale={"md"}
          endIcon={renderAddonAfter()}
        >
          <Input
            scale={"md"}
            type="text"
            value={stopPrice}
            maxLength={9}
            onChange={handleChange}
            isDark={true}
          />
        </InputGroup>
        <PricePercent>
          {(props.pnlFlag > 0 ? profitPricePercent : lossPricePercent).map((e, i) => {
            return (
              <span key={i} onClick={() => setPercentPrice(e)}>
                {e * 100}%
              </span>
            );
          })}
        </PricePercent>
        {allIn ? (
          <>
            <AllInInput>
              <span className="label">
                {props.pnlFlag > 0 ? t("StopProfitQty") : t("StopLossQty")}:
              </span>
              <span className="qs">
                <span className="q">{props?.posi?.absQuantity}</span>
                <span className="r">{t("Cont")}</span>
              </span>
            </AllInInput>
            <AllInPercent>
              {numPercent.map((e, i) => {
                return <span key={i}>{e * 100}%</span>;
              })}
            </AllInPercent>
          </>
        ) : (
          <>
            <InputGroup
              isDark={true}
              startIcon={renderNumPerfix()}
              // hasClear={value != ''}
              endIcon={renderNumAddonAfter()}
              mt="12px"
              ta={"right"}
              scale={"md"}
            >
              <Input
                scale={"md"}
                type="text"
                value={orderNum}
                maxLength={10}
                onChange={handleChangeNum}
                isDark={true}
              />
            </InputGroup>
            <PricePercent>
              {numPercent.map((e, i) => {
                return (
                  <span key={i} onClick={() => setPercentNum(e)}>
                    {e * 100}%
                  </span>
                );
              })}
            </PricePercent>
          </>
        )}
        <StopType>
          <PriceTypeSwitch>
            <span
              className={`item ${stopPriceType === 2 ? "item-indexd" : ""}`}
              onClick={() => setStopPriceType(2)}
            >
              {t("StopLast")}
            </span>
            <span
              className={`item ${stopPriceType === 4 ? "item-indexd" : ""}`}
              onClick={() => setStopPriceType(4)}
            >
              {t("StopMark")}
            </span>
          </PriceTypeSwitch>
          <CheckBoxC>
            <span>
              <CheckboxGroup
                // text={`$props.pnlFlag > 0 ? t('AllProfit') : t('AllLoss')}`}
                text={toolTips()}
                checked={allIn}
                onChange={() => {
                  setAllIn(!allIn);
                  setOrderNum(allIn ? "" : props.posi?.absQuantity);
                }}
                isDark
              />
            </span>
          </CheckBoxC>
        </StopType>
        <UPnl>
          <span className="t">{props.pnlFlag > 0 ? t("UProfit") : t("ULoss")}</span>
          <UPnlt c={props.pnlFlag > 0 ? colorUp : colorDown}>
            <span className="n">{featurePL()}</span>
            <span className="symbol">{contractItem.current?.currencyName}</span>
          </UPnlt>
        </UPnl>
      </Main>
      <CreateBtns>
        <CancelBtn variant={"secondary"} scale={"md"} isDark={true} mr={"8px"} onClick={close}>
          {t("Cancel")}
        </CancelBtn>
        <SaveBtn
          variant={"primary"}
          disabled={btnDisabled()}
          isLoading={loading}
          scale={"md"}
          isDark={true}
          onClick={() => placeCondition()}
        >
          {t("Save")}
        </SaveBtn>
      </CreateBtns>
    </PnlAdd>
  );
};

export default pnlAdd;
