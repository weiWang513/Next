import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Select, message } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { queryHisOrder } from "../../../../services/api/spot";
import {
  formatSpotPriceByTick,
  toFix6,
  dateFormat2,
  getCurrencyPrecisionById
} from "../../../../utils/filters";
import NoData from "../../../../components/NoData";
import LoadMore from "../../../../components/LoadMore";
import Spin from "../../../../components/Spin";
import { ReactComponent as Copy } from "/public/images/SVG/copy.svg";
import copy from "copy-to-clipboard";
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
    &.symbol {
      flex: 1;
      // flex: 0 0 150px;
    }
    &.time {
      // flex: 1;
      flex: 0 0 160px;
    }
    &.operate {
      // flex: 1;
      flex: 0 0 180px;
      padding-right: 16px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }
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

  const spotList = useAppSelector((state) => state.spot.spotList);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();
  const { t } = useTranslation();

  const _timeList = () => [
    { value: 0, label: t("All") },
    { value: 1, label: t("OneDay") },
    { value: 2, label: t("AWeek") },
    { value: 3, label: t("AMonth") }
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
    let _allContractList = spotList;
    const list = _allContractList.map((item) => {
      return {
        label: item.symbol,
        value: item.contractId
      };
    });
    list.unshift({ value: null, label: t("All") });
    return list;
  };

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 10000);
  }, []);

  useEffect(() => {
    if (isLogin) {
      _queryHisOrder(1, true);
    } else {
      setOrderList([]);
    }
  }, [timeIndex, contractId, isLogin]);

  const timeFilter = (v) => {
    switch (v) {
      case 0:
        setOrderEndDate(null);
        setOrderStartDate(null);
        setTimeIndex(v);
        break;
      case 1:
        setOrderEndDate(null);
        setOrderStartDate(new Date().getTime() * 1000 - 24 * 60 * 60 * 1000 * 1000);
        setTimeIndex(v);
        break;
      case 2:
        setOrderEndDate(null);
        setOrderStartDate(new Date().getTime() * 1000 - 7 * 24 * 60 * 60 * 1000 * 1000);
        setTimeIndex(v);
        break;
      case 3:
        setOrderEndDate(null);
        setOrderStartDate(new Date().getTime() * 1000 - 30 * 24 * 60 * 60 * 1000 * 1000);
        setTimeIndex(v);
        break;
      default:
        break;
    }
  };

  // 查询历史委托
  const _queryHisOrder = (side = 1, isInit = false) => {
    if (!isLogin) return;
    let params = {
      pageSize: pageSize,
      side: side,
      contractId: null,
      startDate: null,
      endDate: null
    };
    if (contractId) {
      params.contractId = contractId;
    }
   
    if (side > 0) {
      //next
      params.endDate = orderEndDate || new Date().getTime() * 1000;
      params.startDate = orderStartDate || null;
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
    if (spotList.length === 0) {
      setTimeout(() => {
        _setOrderList(list, isInit);
      }, 300);
      return false;
    }
    let arr = [...list];
    if (arr.length === 0) return false;
    arr.forEach((item) => {
      // 判断状态  1.部成部撤 2.已撤单 3.完全成交 4.未成未撤 5.部成未撤
      item.state = 0;
      if (
        new Big(Number(item.quantity) || 0)
          .minus(Number(item.canceledQuantity) || 0)
          .eq(Number(item.filledQuantity) || 0) &&
        Number(item.canceledQuantity) > 0 &&
        Number(item.canceledQuantity) < Number(item.quantity)
      ) {
        item.state = 1;
      } else if (Number(item.canceledQuantity) === Number(item.quantity)) {
        item.state = 2;
      } else if (
        Number(item.filledQuantity) === Number(item.quantity) &&
        Number(item.canceledQuantity) === 0
      ) {
        item.state = 3;
      } else if (Number(item.filledQuantity) === 0 && Number(item.canceledQuantity) === 0) {
        item.state = 4;
      } else if (
        item.filledQuantity > 0 &&
        item.filledQuantity < item.quantity &&
        Number(item.canceledQuantity) === 0
      ) {
        item.state = 5;
      }
    });
    // console.log('queryHisOrder', arr, this.props.spotList)
    let _list = isInit ? arr : orderList.concat(arr);
    setOrderList(_list);
  };

  const handleContractIdChange = (option) => {
    setOrderEndDate(null);
    setContractId(option.value);
  };

  const curItem = (id) => {
    if (!id) return null;
    const spotItem = spotList.find((item) => item.contractId === id);
    return spotItem ? spotItem : {};
  };

  const getValue = (el) => {
    return toFix6(
      el.price * el.quantity,
      getCurrencyPrecisionById(curItem(el.contractId).currencyId)
    );
  };

  const getLeftQty = (el) => {
    return toFix6(
      el.quantity - el.filledQuantity - el.canceledQuantity,
      getCurrencyPrecisionById(curItem(el.contractId).commodityId)
    );
  };

  const handelCopy = (clOrderId) => {
    copy(clOrderId);
    message.success(t("CopySuccess"));
  };

  return (
    <Table>
      <FilterRow>
        <span>{t("SpotPair")}</span>
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
        <span className="symbol">{t("SpotPair")}</span>
        <span>{t("OrderType")}</span>
        <span>{t("Side")}</span>
        <span>{t("OrderPrice")}</span>
        <span>{t("OrderAmount")}</span>
        <span>{t("FilledAmount")}</span>
        <span>{t("RemainingAmount")}</span>
        <span>{t("OrderMoney")}</span>
        <span>{t("OrderStatus")}</span>
        <span className="time">{t("Time")}</span>
        <span className="operate">{t("OrderId")}</span>
      </div>
      <div className="table-body">
        <Spin loading={loading}>
          {orderList.length > 0 ? (
            <div className="table-body">
              {orderList.map((el, index) => (
                <section className="table-row" key={index}>
                  <span className="symbol">
                    <span className="symbol-text">{curItem(el.contractId).symbol}</span>
                  </span>
                  <span>{el.orderType === 1 ? t("limit") : t("market")}</span>
                  <span
                    style={{
                      color: el.side > 0 ? colorUp : colorDown
                    }}
                  >
                    {el.side > 0 ? t("Buy") : t("Sell")}
                  </span>
                  <span>
                    {el.orderType === 1
                      ? formatSpotPriceByTick(el.price, el.contractId)
                      : t("market")}
                  </span>
                  <span>
                    {toFix6(
                      el.quantity,
                      getCurrencyPrecisionById(curItem(el.contractId).commodityId)
                    )}{" "}
                    {curItem(el.contractId).commodityName}
                  </span>
                  <span>
                    {toFix6(
                      el.filledQuantity,
                      getCurrencyPrecisionById(curItem(el.contractId).commodityId)
                    )}{" "}
                    {curItem(el.contractId).commodityName}
                  </span>
                  <span>
                    {getLeftQty(el)} {curItem(el.contractId).commodityName}
                  </span>
                  <span>
                    {getValue(el)} {curItem(el.contractId).currencyName}
                  </span>
                  <span>{getStates(el.state)}</span>
                  <span className="time">{dateFormat2(el.timestamp / 1000)}</span>
                  <span className="operate">
                    <span style={{ marginRight: "8px" }}>{el.uuid}</span>
                    <Copy style={{ cursor: "pointer" }} onClick={() => handelCopy(el.uuid)} />
                  </span>
                </section>
              ))}
              <LoadMore isLast={isLast} loading={loading} nextPage={() => _queryHisOrder(1)} />
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
