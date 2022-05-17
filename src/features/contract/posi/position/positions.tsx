import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Flex, Tooltip, useModal } from "@ccfoxweb/uikit";
import { ReactComponent as AjustMargin } from "/public/images/SVG/ajustMargin.svg";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import PositionRiskRate from "./positionRiskRate";
import PosiOptions from "./posiOptions";
import PNL from "./PNL";
import Margin from "./margin";
import {
  cancelConditionOrders,
  crossLiqudationPrice,
} from "../../../../utils/common";
import NoData from "../../../../components/NoData";
import { useRouter } from "next/router";
const Big = require("big.js");
import { floatAdd, floatSub, floatMul, floatDiv } from "../../../../utils/math";
import { formatByPriceTick, toFix6 } from "../../../../utils/filters";

const Positions = styled.div`
  height: 528px;
`;

const PositionList = styled.div`
  height: 495px;
  overflow: overlay;
`;

const Header = styled(Flex)`
  height: 32px;
  span {
    flex: 1;
    font-size: 12px;
    font-weight: 500;
    color: #3f3755;
    text-align: left;
    padding-left: 16px;
  }
  span.symbol {
    flex: 0 0 200px;
  }
  span.stopPNL {
    flex: 0 0 256px;
  }
  span.options {
    flex: 0 0 320px;
  }

  span.EnergyList {
    flex: 0 0 150px;
  }
`;

const HeaderItem = styled(Flex)`
  flex: ${({ f }) => f || "1"};
  font-size: 12px;
  font-weight: 500;
  color: #3f3755;
  text-align: left;
  padding-left: 16px;
`;

const HeaderItemInner = styled.div``;

const PositionItem = styled(Flex)`
  height: 40px;
  &:nth-child(even) {
    background: #08060f;
  }
`;
const Symbol = styled(Flex)`
  flex: 0 0 200px;
  span.symbol {
    padding-left: 16px;
    font-size: 16px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: #ffffff;
    margin-right: 8px;
  }
  span.side {
    display: inline-block;
    height: 20px;
    line-height: 20px;
    background: ${({ bgc }) => bgc};
    border-radius: 9px;
    padding: 0 6px;
    font-size: 10px;
    font-weight: 500;
    color: ${({ c }) => c};
  }
`;

const PositionN = styled(Flex)`
  flex: 1;
  text-align: left;
  padding-left: 16px;
  font-size: 12px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #ffffff;
`;

const UPNL = styled(PositionN)<{ c? }>`
  color: ${({ c }) => c};
`;

const SetPnl = styled.div`
  flex: 0 0 256px;
`;

const Options = styled.div`
  flex: 0 0 320px;
`;

const EnergyList = styled.div`
  display: flex;
  flex: 0 0 150px;
  padding-left: 16px;
  width: 100%;
  height: 13px;
  position: relative;
  span.item {
    display: inline-block;
    position: relative;
    width: 2px;
    height: 100%;
    background-color: #565656;
    float: left;
    margin-right: 2px;
    span {
      display: block;
      width: 100%;
      height: 100%;
    }
    &:nth-of-type(1) {
      span {
        background-color: #2fb05e;
      }
    }
    &:nth-of-type(2) {
      span {
        background-color: #5caf4e;
      }
    }
    &:nth-of-type(3) {
      span {
        background-color: #8aae3e;
      }
    }
    &:nth-of-type(4) {
      span {
        background-color: #b7ad2e;
      }
    }
    &:nth-of-type(5) {
      span {
        background-color: #e5ad1f;
      }
    }
    &:nth-of-type(6) {
      span {
        background-color: #f49e1b;
      }
    }
    &:nth-of-type(7) {
      span {
        background-color: #f28e1f;
      }
    }
    &:nth-of-type(8) {
      span {
        background-color: #ee7721;
      }
    }
    &:nth-of-type(9) {
      span {
        background-color: #e7462a;
      }
    }
    &:nth-of-type(10) {
      span {
        background-color: #e3161a;
      }
    }
  }
`;
const LoginBtn = styled.div`
  padding-top: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
  button + button {
    margin-left: 8px;
  }
`;

const positions = (props) => {
  const [posiList, setPosiList] = useState([]);
  const posListProps = useAppSelector((state) => state.assets.posListProps);
  const hideOther = useAppSelector((state) => state.contract.hideOther);
  const conditionOrders = useAppSelector(
    (state) => state.assets.conditionOrders
  );
  const accountList = useAppSelector((state) => state.assets.accountList);
  const energyList = useAppSelector((state) => state.assets.energyList);
  const contractId = useAppSelector((state) => state.contract.contractId);
  const contractList = useAppSelector((state) => state.contract.contractList);
  const countType = useAppSelector((state) => state.place.countType);
  const rankList = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10];
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } =
    useUpDownColor();

  const posisCurr = useRef([]);
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    console.log("posListProps", posListProps);
    cancelConditionOrders(posListProps, posisCurr.current, conditionOrders);
    posisCurr.current = posListProps;
  }, [posListProps]);

  useEffect(() => {
    let _list = hideOther
      ? posListProps.filter((el) => el.contractId === contractId)
      : posListProps;
    setPosiList(_list);
  }, [hideOther, contractId, posListProps]);

  const rank = () => {
    let _rank: number = 100;
    if (contractId !== 0 && energyList.length !== 0) {
      let item = energyList.find((el) => el.contractId === contractId);
      _rank = item ? 100 - item.rank : 100;
    }
    console.log("_rank", _rank);
    return _rank;
    // return 50;
  };

  const renderValue = (el) => {
    let item = contractList.find((ele) => ele.contractId === el.contractId);
    if (!countType) {
      return "";
    } else {
      return `(${toFix6(
        new Big(Math.abs(el.posiQty)).times(item.contractUnit).toString()
      )} ${item.commodityName})`;
    }
  };

  const calcStrongPrice = (el) => {
    let strongPrice: number | string = 0;

    // let el = this.props.item
    let contractItem = contractList.find(
      (ele) => ele.contractId === el.contractId
    );
    let marginAccount: {
      available?: number;
      marginBalance?: number;
      currencyId?: number;
    } = accountList
      ? accountList.find((ele) => ele.currencyId === el.currencyId)
      : {};

    if (!contractItem || !marginAccount?.available) {
      return 0;
    }

    // 计算强平价格   持仓记录为全仓，marginType=1时：强平价=开仓价- 持仓方向 *  { ( initMargin+extraMargin +可用资金 ) / ( abs(持仓数量)*合约单位 )- maintainMarginRate * 开仓价  }
    // 持仓记录为逐仓，marginType=2时：强平价=开仓价- 持仓方向 *  { ( initMargin+extraMargin ) / ( abs(持仓数量)*合约单位 )- maintainMarginRate * 开仓价  }
    let holdPosiSide = el.posiQty > 0 ? 1 : -1; // 持仓方向
    let side = contractItem.contractSide; // 合约方向
    let { marginType } = el; // 1全仓；2逐仓
    let res1 = floatAdd(el.initMargin, el.extraMargin); // initMargin+extraMargin

    // let available = floatSub(
    //   marginAccount.totalBalance,
    //   floatAdd(marginAccount.frozenForTrade, marginAccount.initMargin)
    // )
    let available = marginAccount?.available;

    let res11 = floatAdd(res1, available); // initMargin+extraMargin +可用资金
    let res2 = floatMul(
      Math.abs(Number(el.posiQty)),
      contractItem.contractUnit
    ); // abs(持仓数量)*合约单位
    let res22 = floatMul(
      floatMul(Math.abs(Number(el.posiQty)), contractItem.contractUnit),
      el.openPrice
    ); // abs(持仓数量)*合约单位*开仓价
    let res3 = floatMul(el.maintainMarginRate, el.openPrice); // maintainMarginRate * 开仓价
    let res4 = floatMul(holdPosiSide, el.openPrice); // 持仓数量的方向*开仓价
    let res5 = floatSub(1, floatMul(holdPosiSide, el.maintainMarginRate)); // 1-持仓数量的方向*maintainMarginRate

    if (side === 1) {
      if (marginType === 1) {
        strongPrice = floatSub(
          el.openPrice,
          floatMul(holdPosiSide, floatSub(floatDiv(res11, res2), res3))
        );
      } else {
        strongPrice = floatSub(
          el.openPrice,
          floatMul(holdPosiSide, floatSub(floatDiv(res1, res2), res3))
        );
      }
    } else {
      if (marginType === 1) {
        strongPrice = floatDiv(
          res22,
          floatAdd(floatMul(res2, res5), floatMul(res4, res11))
        );
      } else {
        strongPrice = floatDiv(
          res22,
          floatAdd(floatMul(res2, res5), floatMul(res4, res1))
        );
      }
    }

    return strongPrice;
  };

  const getStrongPrice = (item) => {
    let _strongPrice =
      item.marginType === 1
        ? crossLiqudationPrice(item, contractList, accountList, posListProps)
        : calcStrongPrice(item);
    return _strongPrice;
  };

  return (
    <Positions>
      <Header>
        <span className="symbol">{t("ContractPair")}</span>
        <HeaderItem>
          <HeaderItemInner>
            <Tooltip text={t("positionToolTips1")}>{t("EntryPriceP")}</Tooltip>
          </HeaderItemInner>
        </HeaderItem>
        <HeaderItem>
          <HeaderItemInner>
            <Tooltip
              text={t("positionToolTips2")}
              mb="5px"
              href={
                "https://ccfox.zendesk.com/hc/zh-cn/articles/360028073772-%E5%90%88%E7%90%86%E4%BB%B7%E6%A0%BC%E6%A0%87%E8%AE%B0"
              }
              hrefText={t("learnMore")}
            >
              {t("MarkedPrice")}
            </Tooltip>
          </HeaderItemInner>
        </HeaderItem>
        <HeaderItem>
          <HeaderItemInner>
            <Tooltip text={t("positionToolTips3")}>{t("LiqPriceC")}</Tooltip>
          </HeaderItemInner>
        </HeaderItem>
        <HeaderItem>
          <HeaderItemInner>
            <Tooltip text={t("positionToolTips4")}>{t("posiQty")}</Tooltip>
          </HeaderItemInner>
        </HeaderItem>
        <HeaderItem>
          <HeaderItemInner>
            <Tooltip text={t("positionToolTips5")}>{t("FrozenMargin")}</Tooltip>
          </HeaderItemInner>
        </HeaderItem>
        <HeaderItem>
          <HeaderItemInner>
            <Tooltip text={t("positionToolTips6")}>
              {t("marginPertectRate")}
            </Tooltip>
          </HeaderItemInner>
        </HeaderItem>
        <span>{t("UnrealizedP/L")}</span>
        <span>{t("unrealizedProfitLossRate")}</span>
        <HeaderItem f="0 0 150px;">
          <HeaderItemInner>
            <Tooltip text={t("positionToolTips7")}>
              {t("AutodeleverageQueue")}
            </Tooltip>
          </HeaderItemInner>
        </HeaderItem>
        <span className="stopPNL">{t("Pnl")}</span>
        <span className="options">{t("PosiOption")}</span>
      </Header>
      <PositionList>
        {posiList.length ? (
          <PositionList>
            {posiList.map((e, i) => {
              const strongPrice = getStrongPrice(e);
              return (
                <PositionItem key={i}>
                  <Symbol
                    c={e.side > 0 ? colorUp : colorDown}
                    bgc={e.side > 0 ? orderUpColorArea : orderDownColorArea}
                  >
                    <span className="symbol">{e.symbol}</span>
                    <span className="side">
                      {e.side > 0 ? t("OpenLong") : t("OpenShort")}
                    </span>
                  </Symbol>
                  <PositionN>
                    {formatByPriceTick(e.openPrice, e.contractId) || 0}
                  </PositionN>
                  <PositionN>
                    {formatByPriceTick(e.clearPrice, e.contractId) || 0}
                  </PositionN>
                  <PositionN>
                    {strongPrice > 0
                      ? formatByPriceTick(strongPrice, e.contractId)
                      : 0}
                  </PositionN>
                  <PositionN>
                    {e.absQuantity || 0}
                    {renderValue(e)}
                  </PositionN>
                  <Margin posi={e} random={i} />
                  {/* <PositionN>{toFix6(e.curMargin) || 0}{e.marginType !== 1 && <AjustMarginIcon onClick={ajustMargin} />}</PositionN> */}
                  <PositionN>
                    <PositionRiskRate item={e} />
                  </PositionN>
                  <UPNL c={e.unrealizedProfitLoss > 0 ? colorUp : colorDown}>
                    {e.unrealizedProfitLoss >= 0 ? "+" : ""}
                    {toFix6(e.unrealizedProfitLoss) || 0}
                  </UPNL>
                  <UPNL c={e.unrealizedProfitLoss > 0 ? colorUp : colorDown}>
                    {e.unrealizedProfitLoss >= 0 ? "+" : ""}
                    {toFix6(e.returnRate) || 0}%
                  </UPNL>
                  <EnergyList>
                    {rankList.map((el) => {
                      return (
                        <span key={el} className="item">
                          {el > rank() && <span></span>}
                        </span>
                      );
                    })}
                  </EnergyList>
                  <SetPnl>
                    <PNL item={e} strongPrice={strongPrice} random={i} />
                  </SetPnl>
                  <Options>
                    <PosiOptions item={e} random={i} />
                  </Options>
                </PositionItem>
              );
            })}
          </PositionList>
        ) : (
          <NoData />
        )}
      </PositionList>
    </Positions>
  );
};

export default positions;
