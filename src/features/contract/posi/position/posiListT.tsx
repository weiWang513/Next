import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Flex, Tooltip, useModal } from "@ccfoxweb/uikit";
import { ReactComponent as AjustMargin } from "/public/images/SVG/ajustMargin.svg";
import { useTranslation } from "next-i18next";
import { Table } from 'rsuite';

import { useAppSelector } from "../../../../store/hook";
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
const { Column, HeaderCell, Cell } = Table;

import {
  floatAdd,
  floatSub,
  floatMul,
  floatDiv,
  getFloat,
  subStringNum,
  arraySum,
  depthSum,
  toRateFilter,
  toPrecision2,
  timestampToTime,
  saveSix,
  createChannelString,
  addProperty,
  trimStr,
  updateBar,
  toNonExponential,
} from "../../../../utils/math";
import { formatByPriceTick, toFix6 } from "../../../../utils/filters";
import { getInjectInfo } from "../../../../functions/info";
import {
  AutodeleverageQueueLink,
  LiqPriceCLink,
  MarkedPriceLink,
} from "../../../../utils/utils";

const TooltipC = styled.span`
  display: inline-block;
`;
const Symbol = styled(Flex)`
  flex: 0 0 200px;
  span.symbol {
    font-size: 16px;
    font-family: DINPro-Bold, DINPro;
    font-weight: bold;
    color: #ffffff;
    margin-right: 8px;
    cursor: pointer;
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
  // padding-left: 16px;
  font-size: 12px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #ffffff;
`;

const UPNL = styled(PositionN)<{ c? }>`
  color: ${({ c }) => c};
`;

const EnergyList = styled.div`
  display: flex;
  flex: 0 0 150px;
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

const TooltipS = styled.span`
  white-space: nowrap;
`;

const posiListT = (props) => {
  const [posiList, setPosiList] = useState([]);
  const posListProps = useAppSelector((state) => state.assets.posListProps);
  const userHabit = useAppSelector((state) => state.app.userHabit);
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
  const { t } = useTranslation();
  let { locale, locales, pathname, asPath, push, replace } = useRouter();

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

  const rank = (posi) => {
    let _rank: number = 100;
    if (posi?.contractId !== 0 && energyList.length !== 0) {
      let item = energyList.find((el) => el.contractId === posi?.contractId);
      _rank = item ? item.rank : 100;
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

  const changeContract = (v) => {
    push(`/contract/${v?.symbol.replace("/", "_")}`);
  };

  const getPriTickL = (posi) => {
    let contractItem = contractList?.find(
      (ele) => ele.contractId === posi?.contractId
    );
    let priceTick = contractItem?.priceTick
    let _l = String(priceTick).split('.')[1]?.length
    return _l || 2
  }

  return (
    <>
      {posiList.length ? (
        <Table
          height={528}
          data={posiList}
          onRowClick={(data) => {
            console.log(data);
          }}
        >
          <Column width={200} fixed="left">
            <HeaderCell>{t("ContractPair")}</HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <Symbol
                    c={rowData.side > 0 ? colorUp : colorDown}
                    bgc={
                      rowData.side > 0 ? orderUpColorArea : orderDownColorArea
                    }
                  >
                    <span
                      className="symbol"
                      onClick={() => changeContract(rowData)}
                    >
                      {rowData.symbol}
                    </span>
                    <span className="side">
                      {rowData.side > 0
                        ? t("OpenLongPosition")
                        : t("OpenShortPosition")}
                    </span>
                  </Symbol>
                );
              }}
            </Cell>
          </Column>
          <Column align="left" flexGrow={1} minWidth={93}>
            <HeaderCell>
              <TooltipC>
                <Tooltip placement={"bottom"} text={t("positionToolTips1")}>
                  <TooltipS>{t("EntryPriceP")}</TooltipS>
                </Tooltip>
              </TooltipC>
            </HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <PositionN>
                    {formatByPriceTick(rowData.openPrice, rowData.contractId) ||
                      0}
                  </PositionN>
                );
              }}
            </Cell>
          </Column>

          <Column flexGrow={1} minWidth={93}>
            <HeaderCell>
              <TooltipC>
                <Tooltip
                  placement={"bottom"}
                  text={t("positionToolTips2")}
                  mb="5px"
                  href={MarkedPriceLink(userHabit?.locale)}
                  hrefText={t("learnMore")}
                >
                  <TooltipS>{t("MarkedPrice")}</TooltipS>
                </Tooltip>
              </TooltipC>
            </HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <PositionN>
                    {formatByPriceTick(
                      rowData.clearPrice,
                      rowData.contractId
                    ) || 0}
                  </PositionN>
                );
              }}
            </Cell>
          </Column>

          <Column flexGrow={1} minWidth={93}>
            <HeaderCell>
              <TooltipC>
                <Tooltip
                  placement={"bottom"}
                  text={t("positionToolTips3")}
                  mb="5px"
                  href={LiqPriceCLink(userHabit?.locale)}
                  hrefText={t("learnMore")}
                >
                  <TooltipS>{t("LiqPriceC")}</TooltipS>
                </Tooltip>
              </TooltipC>
            </HeaderCell>
            <Cell>
              {
                rowData => {
                  const strongPrice = getStrongPrice(rowData);
                  return (
                    <PositionN>
                      {strongPrice > 0
                      ? toFix6(formatByPriceTick(strongPrice, rowData.contractId), getPriTickL(rowData))
                      : 0}
                  </PositionN>
                );
              }}
            </Cell>
          </Column>

          <Column width={160}>
            <HeaderCell>{t("posiQty")}</HeaderCell>
            {/* <HeaderCell>
              <TooltipC>
                <Tooltip placement={"bottom"} text={t("positionToolTips4")}>
                  <TooltipS>{t("posiQty")}</TooltipS>
                </Tooltip>
              </TooltipC>
            </HeaderCell> */}
            <Cell>
              {(rowData) => {
                return (
                  <PositionN>
                    {rowData.absQuantity || 0}
                    {renderValue(rowData)}
                  </PositionN>
                );
              }}
            </Cell>
          </Column>
          <Column width={160}>
            <HeaderCell>{t("UnrealizedP/L")}</HeaderCell>
            <Cell>
              {(rowData) => {
                let contractItem = contractList.find(
                  (ele) => ele.contractId === rowData.contractId
                );
                let _d = contractItem?.contractSide === 1 ? 2 : 6;
                return (
                  <>
                    <UPNL
                      c={rowData.unrealizedProfitLoss > 0 ? colorUp : colorDown}
                    >
                      {rowData.unrealizedProfitLoss >= 0 ? "+" : ""}
                      {toFix6(rowData.unrealizedProfitLoss, _d) || 0} [
                      {rowData.unrealizedProfitLoss >= 0 ? "+" : ""}
                      {toFix6(rowData.returnRate) || 0}%]
                    </UPNL>
                  </>
                );
              }}
            </Cell>
          </Column>
          <Column flexGrow={1} minWidth={93}>
            <HeaderCell>
              <TooltipC>
                <Tooltip placement={"bottom"} text={t("positionToolTips5")}>
                  <TooltipS>{t("FrozenMargin")}</TooltipS>
                </Tooltip>
              </TooltipC>
            </HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <Margin
                    posi={rowData}
                    random={rowData.contractId * rowData.side}
                  />
                );
              }}
            </Cell>
          </Column>

          <Column flexGrow={1} minWidth={93}>
            <HeaderCell>
              <TooltipC>
                <Tooltip placement={"bottom"} text={t("positionToolTips6")}>
                  <TooltipS>{t("marginPertectRate")}</TooltipS>
                </Tooltip>
              </TooltipC>
            </HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <PositionN>
                    <PositionRiskRate item={rowData} />
                  </PositionN>
                );
              }}
            </Cell>
          </Column>

          {/* <Column width={300}>
            <HeaderCell>{t("UnrealizedP/L")}</HeaderCell>
            <Cell dataKey="email" />
          </Column>
          <Column width={300}>
            <HeaderCell>{t("unrealizedProfitLossRate")}</HeaderCell>
            <Cell dataKey="email" />
          </Column> */}
          <Column flexGrow={1} minWidth={93}>
            <HeaderCell>
              <TooltipC>
                <Tooltip
                  placement={"bottom"}
                  text={t("positionToolTips7")}
                  mb="5px"
                  href={AutodeleverageQueueLink(userHabit?.locale)}
                  hrefText={t("learnMore")}
                >
                  <TooltipS>{t("AutodeleverageQueue")}</TooltipS>
                </Tooltip>
              </TooltipC>
            </HeaderCell>
            <Cell>
              {(rowData) => {
                return (
                  <EnergyList>
                    {rankList.map((el) => {
                      return (
                        <span key={el} className="item">
                          {el > rank(rowData) && <span></span>}
                        </span>
                      );
                    })}
                  </EnergyList>
                );
              }}
            </Cell>
          </Column>
          <Column width={200} fixed="right">
            <HeaderCell>{t("Pnl")}</HeaderCell>
            <Cell>
              {(rowData) => {
                const strongPrice = getStrongPrice(rowData);
                return (
                  <PNL
                    item={rowData}
                    strongPrice={strongPrice}
                    random={rowData.contractId * rowData.side}
                  />
                );
              }}
            </Cell>
          </Column>
          <Column width={384} fixed="right">
            <HeaderCell>{t("PosiOption")}</HeaderCell>

            <Cell>
              {(rowData) => {
                return (
                  <PosiOptions
                    item={rowData}
                    random={rowData.contractId * rowData.side}
                  />
                );
              }}
            </Cell>
          </Column>
        </Table>
      ) : (
        // <Table
        //   height={400}
        //   data={[1,11,1,1]}
        //   onRowClick={data => {
        //     console.log(data);
        //   }}
        // >
        //   <Column width={70} align="center" fixed>
        //     <HeaderCell>Id</HeaderCell>
        //     <Cell dataKey="id" />
        //   </Column>

        //   <Column width={200} fixed>
        //     <HeaderCell>First Name</HeaderCell>
        //     <Cell dataKey="firstName" />
        //   </Column>

        //   <Column width={200}>
        //     <HeaderCell>Last Name</HeaderCell>
        //     <Cell dataKey="lastName" />
        //   </Column>

        //   <Column width={200}>
        //     <HeaderCell>City</HeaderCell>
        //     <Cell dataKey="city" />
        //   </Column>

        //   <Column width={200}>
        //     <HeaderCell>Street</HeaderCell>
        //     <Cell dataKey="street" />
        //   </Column>

        //   <Column width={300}>
        //     <HeaderCell>Company Name</HeaderCell>
        //     <Cell dataKey="companyName" />
        //   </Column>

        //   <Column width={300}>
        //     <HeaderCell>Email</HeaderCell>
        //     <Cell dataKey="email" />
        //   </Column>
        //   <Column width={120} fixed="right">
        //     <HeaderCell>Action</HeaderCell>

        //     <Cell>
        //       {rowData => {
        //         function handleAction() {
        //           alert(`id:${rowData.id}`);
        //         }
        //         return (
        //           <span>
        //             <a onClick={handleAction}> Edit </a> | <a onClick={handleAction}> Remove </a>
        //           </span>
        //         );
        //       }}
        //     </Cell>
        //   </Column>
        // </Table>
        <NoData />
      )}
    </>
  );
};

export default posiListT;
