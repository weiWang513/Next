import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Select } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { queryHisOrder } from "../../../../services/api/contract";
import {
  formatByPriceTick,
  toFix6,
  dateFormat2,
} from "../../../../utils/filters";
import NoData from "../../../../components/NoData";
import LoadMore from "../../../../components/LoadMore";
import Spin from "../../../../components/Spin";
const Big = require("big.js");

const Table = styled.div`
  height: 528px;
  .table-head {
    height: 32px;
    display: flex;
    align-items: center;
  }
  .table-body {
    height: 440px;
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
  }
  .table-row > span {
    color: #ffffff;
    & > .symbol-text {
      font-size: 16px;
      font-family: DINPro-Bold;
      font-weight: bold;
      color: #ffffff;
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
const FilterRow = styled.section`
  height: 40px;
  display: flex;
  align-items: center;
  & > span {
    color: #ffffff;
    font-size: 12px;
    margin: 0 8px 0 16px;
  }
`;

const HisOrder = () => {
  const [contractId, setContractId] = useState(null);
  const [orderEndDate, setOrderEndDate] = useState(null);
  const [orderStartDate, setOrderStartDate] = useState(null);
  const [timeIndex, setTimeIndex] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  const allContractList = useAppSelector(
    (state) => state.contract.allContractList
  );
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } =
    useUpDownColor();
  const { t } = useTranslation();

  const _timeList = () => [
    { value: 0, label: t("All") },
    { value: 1, label: t("OneDay") },
    { value: 2, label: t("AWeek") },
    { value: 3, label: t("AMonth") },
  ];

  const getStates = (state) => {
    switch (state) {
      case 1:
        return t("PartialFilledPartialCancelled");
      case 2:
        return t("Cancelled");
      case 3:
        return t("Filled");
      case 4:
        return t("NewOrder");
      case 5:
        return t("PartDeal");
      default:
        return "";
    }
  };

  const _contractList = () => {
    let _allContractList = allContractList;
    const list = _allContractList.map((item) => {
      return {
        label: item.symbol,
        value: item.contractId,
      };
    });
    list.unshift({ value: null, label: t("All") });
    return list;
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 10000)
  }, []);

  useEffect(() => {
    _queryHisOrder(1, true);
  }, [timeIndex, contractId]);

  useEffect(() => {
    if (isLogin) {
      _queryHisOrder(1, true);
    } else {
      setOrderList([]);
    }
  }, [isLogin]);

  const timeFilter = (v) => {
    switch (v) {
      case 0:
        setOrderEndDate(null);
        setOrderStartDate(null);
        setTimeIndex(v);
        break;
      case 1:
        setOrderEndDate(null);
        setOrderStartDate(
          new Date().getTime() * 1000 - 24 * 60 * 60 * 1000 * 1000
        );
        setTimeIndex(v);
        break;
      case 2:
        setOrderEndDate(null);
        setOrderStartDate(
          new Date().getTime() * 1000 - 7 * 24 * 60 * 60 * 1000 * 1000
        );
        setTimeIndex(v);
        break;
      case 3:
        setOrderEndDate(null);
        setOrderStartDate(
          new Date().getTime() * 1000 - 30 * 24 * 60 * 60 * 1000 * 1000
        );
        setTimeIndex(v);
        break;
      default:
        break;
    }
  };

  // 查询成交明细
  const _queryHisOrder = (side = 1, isInit = false) => {
    if (!isLogin) return
    let params = {
      pageSize: pageSize,
      side: side,
      contractId: null,
      startDate: null,
      endDate: null,
    };
    if (contractId) {
      params.contractId = contractId;
    }
    if (isInit) {
      //第一次加载或者刚选择完时间加载
      params.startDate = orderStartDate || null;
      params.endDate = orderEndDate || null;
    } else {
      if (side > 0) {
        //next
        params.endDate = orderEndDate || null;
        params.startDate = orderStartDate || null;
      } else {
        //prev
        params.startDate = orderList[0]?.timestamp;
        params.endDate = orderEndDate || null;
      }
    }
    setLoading(true);
    queryHisOrder(params).then((res) => {
      // console.log('queryHisMatch', params, res.data)
      setLoading(false);
      if (res.data.code === 0) {
        if (res.data.data.length) {
          setOrderEndDate(res.data.data[res.data.data.length - 1].timestamp);
          if (res.data.data.length < pageSize && side > 0) {
            setIsLast(true);
          } else {
            setIsLast(false);
          }
          _setOrderList(res.data.data, isInit);
        } else {
          setIsLast(true);
          if (isInit) {
            setOrderList([]);
          }
        }
      }
    });
  };

  const _setOrderList = (list, isInit) => {
    if (allContractList.length === 0) {
      setTimeout(() => {
        _setOrderList(list, isInit);
      }, 300);
      return false;
    }
    let arr = [...list];
    if (arr.length === 0) return false;
    arr.forEach((item) => {
      const contractItem = allContractList.find(
        (el) => el?.contractId === item.contractId
      );
      item.symbol = contractItem ? contractItem?.symbol : "--";
      // 判断状态  1.部成部撤 2.已撤单 3.完全成交 4.未成未撤 5.部成未撤
      item.state = 0;
      if (
        Number(item.quantity) - Number(item.canceledQuantity) ===
          Number(item.filledQuantity) &&
        item.canceledQuantity > 0 &&
        item.canceledQuantity < item.quantity
      ) {
        item.state = 1;
      } else if (Number(item.canceledQuantity) === Number(item.quantity)) {
        item.state = 2;
      } else if (
        Number(item.filledQuantity) === Number(item.quantity) &&
        Number(item.canceledQuantity) === 0
      ) {
        item.state = 3;
      } else if (
        Number(item.filledQuantity) === 0 &&
        Number(item.canceledQuantity) === 0
      ) {
        item.state = 4;
      } else if (
        item.filledQuantity > 0 &&
        item.filledQuantity < item.quantity &&
        Number(item.canceledQuantity) === 0
      ) {
        item.state = 5;
      }
      const cFilledCurrency = new Big(Number(item.filledCurrency)); // 成交金额
      const cFilledQuantity = new Big(Number(item.filledQuantity)); // 成交数量
      const contractUnit = contractItem
        ? new Big(contractItem?.contractUnit)
        : new Big(0.01);
      if (contractItem?.contractSide === 1) {
        if (Number(item.filledQuantity) === 0) {
          item.dealPrice = 0;
        } else {
          item.dealPrice = cFilledCurrency
            .div(cFilledQuantity.times(contractUnit))
            .toString();
        }
      } else {
        item.dealPrice =
          Number(item.filledCurrency) !== 0
            ? cFilledQuantity
                .times(contractUnit)
                .div(cFilledCurrency)
                .toString()
            : 0;
      }
      item.quantity = toFix6(item.quantity); // 委托数量
      item.filledQuantity = toFix6(item.filledQuantity); // 成交数量
      item.price = formatByPriceTick(item.price, contractItem?.contractId);
      item.dealPrice = formatByPriceTick(
        item.dealPrice,
        contractItem?.contractId
      );
      item.time = dateFormat2(item.timestamp / 1000);
    });
    // console.log('queryHisOrder', arr, this.props.allContractList)
    let _list = isInit ? arr : orderList.concat(arr);
    setOrderList(_list);
  };

  const handleContractIdChange = (option) => {
    setOrderEndDate(null)
    setContractId(option.value);
  };

  const getSideEffect = (item) => {
    if (item.side > 0) {
      return item.positionEffect === 1 ? t("BuyOpenLong") : t("BuyCloseShort");
    } else {
      return item.positionEffect === 1
        ? t("SellOpenShort")
        : t("SellCloseLong");
    }
  };

  return (
    <Table>
      <FilterRow>
        <span>{t("Contract")}</span>
        <Select
          width={160}
          maxHeight={300}
          scale={"sm"}
          isDark={true}
          options={_contractList()}
          value={contractId}
          onChange={handleContractIdChange}
        />
        <span>{t("Time")}</span>
        <Select
          width={160}
          scale={"sm"}
          isDark={true}
          options={_timeList()}
          value={timeIndex}
          onChange={(option) => timeFilter(option.value)}
        />
      </FilterRow>
      <div className="table-head">
        <span className="symbol">{t("ContractPair")}</span>
        <span>{t("OrderPrice")}</span>
        <span>
          {t("OrderAmount")}({t("Cont")})
        </span>
        <span>{t("FilledPrice")}</span>
        <span>
          {t("FilledAmount")}({t("Cont")})
        </span>
        <span>{t("PositionMode")}</span>
        <span>{t("OrderStatus")}</span>
        <span>{t("orderCashTime")}</span>
      </div>
      <div className="table-body">
        <Spin loading={loading}>
          {orderList.length > 0 ? (
            <div className="table-body">
              {orderList.map((el, index) => (
                <section className="table-row" key={index}>
                  <span className="symbol">
                    <span className="symbol-text">{el.symbol}</span>
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
                  </span>
                  <span>{el.orderType === 3 ? t("Market") : el.price}</span>
                  <span>{el.quantity}</span>
                  <span>{el.dealPrice}</span>
                  <span>{el.filledQuantity}</span>
                  <span>
                    {el.positionEffect === 1
                      ? `${
                          el.marginType === 1 ? t("FullPosition") : t("isolated")
                        }${
                          el.marginRate
                            ? ` / ${Math.round(1 / el.marginRate)}x`
                            : ""
                        }`
                      : "--"}
                  </span>
                  <span>{getStates(el.state)}</span>
                  <span>{el.time}</span>
                </section>
              ))}
              <LoadMore
                isLast={isLast}
                loading={loading}
                nextPage={() => _queryHisOrder(1)}
              />
            </div>
          ) : (
            <NoData />
          )}
        </Spin>
      </div>
    </Table>
  );
};

export default HisOrder;
