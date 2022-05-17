import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { InputGroup, Input, Modal, ModalProps, Select, Slider, Button } from "@ccfoxweb/uikit";
import {
  toFix6,
  toDeExponential,
  formatQuantity,
  formatByPriceTick,
  formatPrice,
  formatAmount
} from "../../../../utils/filters";
import { getDecimal } from "../../../../utils/common";
import { ReactComponent as Minus } from "/public/images/SVG/minus.svg";
import { ReactComponent as Plus } from "/public/images/SVG/plus.svg";
import { useTranslation } from "next-i18next";
import { entrustValue, calcClosePrice } from "./math";
import { useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
const Big = require("big.js");

const TabHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 56px;
  & > div {
    position: relative;
    height: 100%;
    padding: 0 12px;
    font-size: 16px;
    font-weight: 600;
    color: #615976;
    line-height: 56px;
    cursor: pointer;
    &.active {
      color: #6f5aff;
      i {
        position: absolute;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 3px;
        background: #6f5aff;
        border-radius: 2px;
      }
    }
  }
`;
const ModalContent = styled.div`
  display: flex;
  width: 100%;
  padding-bottom: 24px;
`;
const ChooseArea = styled.aside`
  flex: 1;
`;
const SideRow = styled.section`
  display: flex;
  width: 100%;
  margin-top: 12px;
  & > div {
    flex: 1;
    height: 32px;
    background: #1f1830;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    &.active {
      color: #ffffff;
    }
  }
`;
const ModeRow = styled.section`
  display: flex;
  width: 100%;
  margin-top: 12px;
  & > div {
    flex: 1;
    height: 32px;
    background: #1f1830;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    &.active {
      background: #4a4062;
      color: #ffffff;
    }
  }
`;

const IconWarp = styled.div`
  width: 40px;
  height: 40px;
  justify-content: center;
  cursor: pointer;
`;
const SlideWarp = styled.div`
  padding-top: 8px;
`;
const Inputlabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
`;
const InputUnit = styled.span`
  width: 44px;
  border-left: 1px solid #3f3755;
  text-align: right;
  font-size: 12px;
  font-weight: 500;
  color: #ffffff;
  line-height: 16px;
`;

const ResultArea = styled.aside`
  box-sizing: border-box;
  width: 232px;
  padding: 14px 16px;
  margin-left: 16px;
  background: #1f1830;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
const TopWarp = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > article {
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 20px;
  }
  & > ul {
    padding-top: 10px;
    li {
      padding: 10px 12px;
      background: #181226;
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      & + li {
        margin-top: 4px;
      }
      .label-text {
        font-size: 12px;
        font-weight: 500;
        color: #615976;
        line-height: 16px;
      }
      .value-text {
        font-size: 14px;
        font-family: DINPro-Bold;
        font-weight: bold;
        color: #ffffff;
        line-height: 18px;
      }
    }
  }
`;
const TipsText = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: #3f3755;
  line-height: 18px;
`;
const OptionText = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  span {
    font-size: 14px;
    font-weight: 500;
    color: #615976;
  }
  div {
    font-size: 12px;
    font-weight: 500;
  }
  &:hover span {
    color: #fff;
  }
`;

const CalcModal: React.FC<ModalProps> = ({ onDismiss, ...props }) => {
  const [tabTitles, setTabTitles] = useState([]);
  const [calcType, setCalcType] = useState(0);
  const [contractId, setContractId] = useState(null);
  const [tradeSide, setTradeSide] = useState(1); // 1 long;-1 short 买卖方向
  const [posiMode, setPosiMode] = useState(0); //0 xN ;1 cross; 仓位模式
  const [lever, setLever] = useState("1");
  const [openPrice, setOpenPrice] = useState("");
  const [posiQty, setPosiQty] = useState("");
  const [closePrice, setClosePrice] = useState("");
  const [avail, setAvail] = useState("");
  const [profitRatio, setProfitRatio] = useState("");
  const [contractItem, setContractItem] = useState<{
    contractSide?;
    contractUnit?;
    takerFeeRatio?;
    makerFeeRatio?;
    minMaintainRate?;
  }>({});
  const { colorUp, colorDown } = useUpDownColor();
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const contractList = useAppSelector((state) => state.contract.contractList);
  const _contractId = useAppSelector((state) => state.contract.contractId);
  const _contractItem = useAppSelector((state) => state.contract.contractItem);
  const varietyMarginAll = useAppSelector((state) => state.contract.varietyMarginAll);
  const { t } = useTranslation();

  const minLever = 1;
  const [maxLever, setMaxLever] = useState(100);

  useEffect(() => {
    setContractItem(_contractItem);
    setContractId(_contractId);
    getMaxLever(_contractId);
  }, []);

  useEffect(() => {
    setTabTitles([t("calcType1"), t("calcResSP"), t("calcType2")]);
  }, [userHabit.locale]);

  const getMaxLever = (id) => {
    if (!varietyMarginAll[`${id}`]) {
      return;
    }
    let _margin = varietyMarginAll[`${id}`][0]?.initRate;
    const mLever = new Big(1)
      .div(_margin || 0.01)
      .round()
      .toString();
    setMaxLever(Number(mLever));
    console.log("maxLever", mLever);
    if (Number(lever) > Number(mLever)) {
      setLever(mLever.toString());
    }
  };

  const _entrustValue = () => {
    return entrustValue(posiQty, openPrice, contractItem?.contractSide, contractItem?.contractUnit);
  };

  const _calcClosePrice = () => {
    return calcClosePrice(profitRatio, openPrice, lever, contractItem?.contractSide, tradeSide);
  };

  const calcProfitLoss = () => {
    if (!Number(posiQty) || !Number(closePrice) || !Number(openPrice)) return "--";
    let data = "--";
    let contractSide = contractItem?.contractSide;
    let contractUnit = contractItem?.contractUnit;
    data =
      contractSide == 1
        ? new Big(posiQty)
            .times(tradeSide)
            .times(new Big(closePrice).sub(openPrice))
            .times(contractUnit)
            .toString()
        : new Big(posiQty)
            .times(tradeSide)
            .times(new Big(1).div(openPrice).sub(new Big(1).div(closePrice)))
            .times(contractUnit)
            .toString();
    return toFix6(data, getDecimal(null, contractId));
  };

  const calcProfitLossRatio = () => {
    if (!Number(closePrice) || !Number(openPrice) || !Number(lever)) return "--";
    let data = "--";
    let contractSide = contractItem?.contractSide;
    data =
      contractSide === 1
        ? new Big(lever)
            .times(tradeSide)
            .times(new Big(closePrice).sub(openPrice))
            .div(openPrice)
            .times(100)
            .toString()
        : new Big(lever)
            .times(tradeSide)
            .times(new Big(1).div(openPrice).sub(new Big(1).div(closePrice)))
            .times(openPrice)
            .times(100)
            .toString();
    return toFix6(data) + "%";
  };

  const takerFee = () => {
    if (!Number(_entrustValue())) return "--";
    let data = new Big(_entrustValue()).times(contractItem?.takerFeeRatio).toString();
    return toDeExponential(data);
  };

  const makerFee = () => {
    if (!Number(_entrustValue())) return "--";
    let data = new Big(_entrustValue()).times(contractItem?.makerFeeRatio).toString();
    return toDeExponential(data);
  };

  const calcStrongPrice = () => {
    if (!Number(_entrustValue()) || !Number(openPrice) || !Number(posiQty)) return "--";
    let data = "--";
    let contractUnit = contractItem?.contractUnit;
    let contractSide = contractItem?.contractSide;
    let minMaintainRate = contractItem?.minMaintainRate;
    let entrustValue = _entrustValue();

    if (posiMode === 1) {
      //  全仓
      if (!Number(avail)) return "--";

      data =
        contractSide === 1
          ? new Big(openPrice)
              .sub(
                new Big(tradeSide).times(
                  new Big(avail)
                    .plus(new Big(entrustValue).div(lever))
                    .div(posiQty)
                    .div(contractUnit)
                    .sub(new Big(openPrice).times(minMaintainRate))
                )
              )
              .toString()
          : // abs(下单数量)* 合约单位 * 参考价 / { 合约单位 * abs(下单数量)* ( 1 - 下单数量对方向 * 最低维持保证金率) + 下单数量对方向 * 开仓价 * (可用资金 + 委托价值* 下单杠杆倍数的倒数) }
            new Big(posiQty)
              .times(contractUnit)
              .times(openPrice)
              .div(
                new Big(contractUnit)
                  .times(posiQty)
                  .times(new Big(1).sub(new Big(tradeSide).times(minMaintainRate)))
                  .plus(
                    new Big(tradeSide)
                      .times(openPrice)
                      .times(new Big(avail).plus(new Big(entrustValue).div(lever)))
                  )
              )
              .toString();
    } else {
      if (!Number(lever)) return "--";
      data =
        contractSide === 1
          ? new Big(openPrice)
              .sub(
                new Big(tradeSide).times(
                  new Big(0)
                    .plus(new Big(entrustValue).div(lever))
                    .div(posiQty)
                    .div(contractUnit)
                    .sub(new Big(openPrice).times(minMaintainRate))
                )
              )
              .toString()
          : // （方向*开仓价）/（杠杆倍数的倒数-最低维持保证金率+方向）
            new Big(openPrice)
              .times(tradeSide)
              .div(new Big(1).div(lever).sub(minMaintainRate).plus(tradeSide))
              .toString();
    }
    return toFix6(Math.max(Number(data), 0));
  };

  const calcClosePriceRatio = () => {
    let _calcClosePrice = calcClosePrice(
      profitRatio,
      openPrice,
      lever,
      contractItem?.contractSide,
      tradeSide
    );
    if (!Number(_calcClosePrice) || !Number(openPrice)) return "--";
    let data = "--";
    let contractSide = contractItem?.contractSide;
    data =
      contractSide === 1
        ? new Big(1)
            .times(tradeSide)
            .times(new Big(_calcClosePrice).sub(openPrice))
            .div(openPrice)
            .times(100)
            .toString()
        : new Big(1)
            .times(tradeSide)
            .times(new Big(1).div(openPrice).sub(new Big(1).div(_calcClosePrice)))
            .times(openPrice)
            .times(100)
            .toString();
    return toFix6(data) + "%";
  };

  const leverMinus = () => {
    if (Number(lever) === minLever) {
      return false;
    }
    const leverStr = (Number(lever) - 1).toString();
    setLever(leverStr);
  };
  const leverPlus = () => {
    if (Number(lever) === maxLever) {
      return false;
    }
    const leverStr = (Number(lever) + 1).toString();
    setLever(leverStr);
  };
  const handleContractChange = (option) => {
    setContractItem(option);
    setContractId(option?.value);
    getMaxLever(option?.value);
  };

  const ModalHeader = () => (
    <TabHeader>
      {tabTitles.map((item, index) => (
        <div
          className={calcType === index ? "active" : ""}
          onClick={() => setCalcType(index)}
          key={index}
        >
          <span>{item}</span>
          <i></i>
        </div>
      ))}
    </TabHeader>
  );
  return (
    <Modal title={<ModalHeader />} isDark={true} width={"580px"} onDismiss={onDismiss} {...props}>
      <ModalContent>
        <ChooseArea>
          {contractList?.length > 0 && (
            <Select
              width={"100%"}
              maxHeight={300}
              scale={"md"}
              isDark={true}
              options={contractList?.map((item) => {
                return {
                  label: (
                    <OptionText key={item.contractId}>
                      <span
                        style={{
                          color: item.contractId === contractId ? "#fff" : ""
                        }}
                      >
                        {item.symbol}
                      </span>
                      <div
                        style={{
                          color: item?.priceChangeRadio > 0 ? colorUp : colorDown
                        }}
                      >
                        {formatByPriceTick(item?.lastPrice, item.contractId)}
                      </div>
                    </OptionText>
                  ),
                  // label: item.symbol,
                  value: item.contractId,
                  ...item
                };
              })}
              value={contractId}
              onChange={handleContractChange}
            />
          )}
          <SideRow>
            <div
              className={tradeSide > 0 ? "active" : ""}
              style={{
                background: tradeSide > 0 ? colorUp : ""
              }}
              onClick={() => setTradeSide(1)}
            >
              {t("buyLong")}
            </div>
            <div
              className={tradeSide < 0 ? "active" : ""}
              style={{
                background: tradeSide < 0 ? colorDown : ""
              }}
              onClick={() => setTradeSide(-1)}
            >
              {t("sellShort")}
            </div>
          </SideRow>
          {calcType === 1 && (
            <ModeRow>
              <div className={posiMode === 1 ? "active" : ""} onClick={() => setPosiMode(1)}>
                {t("FullPosition")}
              </div>
              <div className={posiMode === 0 ? "active" : ""} onClick={() => setPosiMode(0)}>
                {t("isolated")}
              </div>
            </ModeRow>
          )}
          <InputGroup
            startIcon={
              <IconWarp onClick={() => leverMinus()}>
                <Minus />
              </IconWarp>
            }
            endIcon={
              <IconWarp onClick={() => leverPlus()}>
                <Plus />
              </IconWarp>
            }
            mt={"12px"}
            scale={"md"}
            isDark={true}
            ta={"center"}
          >
            <Input
              type="text"
              value={lever}
              onChange={(event) => {
                setLever(
                  formatQuantity(event.target.value, lever, 1) > 100
                    ? "100"
                    : formatQuantity(event.target.value, lever, 1)
                );
              }}
            />
          </InputGroup>
          <SlideWarp>
            <Slider
              name="slider"
              min={minLever}
              max={maxLever}
              value={lever ? lever : "1"}
              onValueChanged={(newValue) => setLever(newValue)}
              step={1}
              dotList={[minLever, maxLever]}
              showLabel
            />
          </SlideWarp>
          <InputGroup
            startIcon={<Inputlabel>{t("OrderPrice")}</Inputlabel>}
            endIcon={
              <InputUnit>
                {contractItem?.contractSide === 1
                  ? contractItem?.currencyName
                  : contractItem?.commodityName}
              </InputUnit>
            }
            mt={"30px"}
            scale={"md"}
            isDark={true}
            ta={"right"}
          >
            <Input
              type="text"
              value={openPrice}
              onChange={(event) => {
                setOpenPrice(formatPrice(event.target.value, openPrice, contractItem?.priceTick));
              }}
            />
          </InputGroup>
          {calcType !== 2 && (
            <InputGroup
              startIcon={<Inputlabel>{t("OrderAmount")}</Inputlabel>}
              endIcon={<InputUnit>{t("Cont")}</InputUnit>}
              mt={"12px"}
              scale={"md"}
              isDark={true}
              ta={"right"}
            >
              <Input
                type="text"
                value={posiQty}
                onChange={(event) => {
                  setPosiQty(formatQuantity(event.target.value, posiQty, contractItem?.lotSize));
                }}
              />
            </InputGroup>
          )}
          {calcType === 0 && (
            <InputGroup
              startIcon={<Inputlabel>{t("calcResCP")}</Inputlabel>}
              endIcon={
                <InputUnit>
                  {contractItem?.contractSide === 1
                    ? contractItem?.currencyName
                    : contractItem?.commodityName}
                </InputUnit>
              }
              mt={"12px"}
              scale={"md"}
              isDark={true}
              ta={"right"}
            >
              <Input
                type="text"
                value={closePrice}
                onChange={(event) => {
                  setClosePrice(
                    formatPrice(event.target.value, closePrice, contractItem?.priceTick)
                  );
                }}
              />
            </InputGroup>
          )}
          {calcType === 1 && posiMode === 1 && (
            <InputGroup
              startIcon={<Inputlabel>{t("Available")}</Inputlabel>}
              endIcon={
                <InputUnit>
                  {contractItem?.contractSide === 1
                    ? contractItem?.currencyName
                    : contractItem?.commodityName}
                </InputUnit>
              }
              mt={"12px"}
              scale={"md"}
              isDark={true}
              ta={"right"}
            >
              <Input
                type="text"
                value={avail}
                onChange={(event) => {
                  setAvail(formatAmount(event.target.value, avail));
                }}
              />
            </InputGroup>
          )}
          {calcType === 2 && (
            <InputGroup
              startIcon={<Inputlabel>{t("calcPLR")}</Inputlabel>}
              endIcon={<InputUnit>%</InputUnit>}
              mt={"12px"}
              scale={"md"}
              isDark={true}
              ta={"right"}
            >
              <Input
                type="text"
                value={profitRatio}
                onChange={(event) => {
                  setProfitRatio(formatAmount(event.target.value, profitRatio));
                }}
              />
            </InputGroup>
          )}
        </ChooseArea>
        <ResultArea>
          <TopWarp>
            <article>{t("calcRes")}</article>
            {calcType === 0 && (
              <ul>
                <li>
                  <span className="label-text">{t("calcResPL")}</span>
                  <span className="value-text">{calcProfitLoss()}</span>
                </li>
                <li>
                  <span className="label-text">{t("calcPLR")}</span>
                  <span className="value-text">{calcProfitLossRatio()}</span>
                </li>
                <li>
                  <span className="label-text">{t("calcResMF")}</span>
                  <span className="value-text">{makerFee()}</span>
                </li>
                <li>
                  <span className="label-text">{t("calcResTF")}</span>
                  <span className="value-text">{takerFee()}</span>
                </li>
              </ul>
            )}
            {calcType === 1 && (
              <ul>
                <li>
                  <span className="label-text">{t("calcResSP")}</span>
                  <span className="value-text">{calcStrongPrice()}</span>
                </li>
              </ul>
            )}
            {calcType === 2 && (
              <ul>
                <li>
                  <span className="label-text">{t("calcResCP")}</span>
                  <span className="value-text">{_calcClosePrice()}</span>
                </li>
                <li>
                  <span className="label-text">{t("calcResPFR")}</span>
                  <span className="value-text">{calcClosePriceRatio()}</span>
                </li>
              </ul>
            )}
          </TopWarp>
          <TipsText>※ {t("calcTips")}</TipsText>
        </ResultArea>
      </ModalContent>
    </Modal>
  );
};

export default CalcModal;
