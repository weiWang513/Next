import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Select } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { conditionHistoryQuery } from "../../../../services/api/contract";
import {
  formatByPriceTick,
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
    &.symbol {
      flex: 0 0 250px;
    }
  }
  .table-row > span {
    color: #ffffff;
    & > .symbol-text {
      font-size: 16px;
      font-family: DINPro-Bold;
      font-weight: bold;
      color: #FFFFFF;
    }
    & > .side-text {
      margin-left: 8px;
      padding: 0 6px;
      border-radius: 9px;
      line-height: 16px;
      font-size: 10px;
      font-weight: 500;
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
  const [orderStartDate, setOrderStartDate] = useState(null);
  const [timeIndex, setTimeIndex] = useState(0);
  const [pageNum, setPageNum] = useState(1);
  const [total, setTotal] = useState(0);
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);

  const pageSize = 10;

  const allContractList = useAppSelector(
    (state) => state.contract.allContractList
  );
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const contractList = useAppSelector((state) => state.contract.contractList);
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } =
    useUpDownColor();
  const { t } = useTranslation();

  const _timeList = () => [
    { value: 0, label: t("All") },
    { value: 1, label: t("OneDay") },
    { value: 2, label: t("AWeek") },
    { value: 3, label: t("AMonth") },
  ];

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
        setOrderStartDate(null);
        setTimeIndex(v);
        break;
      case 1:
        setOrderStartDate(
          new Date().getTime() - 24 * 60 * 60 * 1000
        );
        setTimeIndex(v);
        break;
      case 2:
        setOrderStartDate(
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        );
        setTimeIndex(v);
        break;
      case 3:
        setOrderStartDate(
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000
        );
        setTimeIndex(v);
        break;
      default:
        break;
    }
  };

  // 查询成交明细
  const _queryHisOrder = (page = 1, isInit = false) => {
    if (!isLogin) return
    let params = {
      pageNum: page ? page : pageNum,
      pageSize: pageSize,
      contractId: null,
      startTime: null,
    };
    if (contractId) {
      params.contractId = contractId;
    }
    if (orderStartDate) {
      
      params.startTime = (orderStartDate / 1000).toFixed(0);
    }
    setLoading(true);
    conditionHistoryQuery(params).then((res) => {
      setLoading(false);
      if (res.data.code === 0) {
        let _list = isInit
          ? res.data.data.list
          : orderList.concat(res.data.data.list);
        setOrderList(_list || []);
        setTotal(res.data.data.total);
        setPageNum(res.data.data.pageNum);
      }
    });
  };

  const handleContractIdChange = (option) => {
    setContractId(option.value);
  };

  const getSymbol = (v) => {
    return contractList.length
      ? contractList.find((el) => el.contractId === v).symbol
      : "";
  };

  const getPnLType = (v) => {
    switch (v.conditionOrderType) {
      case 0:
        return t("CommonCond");
      case 1:
        return t("StopProfitT");
      case 2:
        return t("StopLossT");

      default:
        break;
    }
  };

  const getTriggerType = item => {
    switch (item.triggerType) {
      case 2:
        return t("Lastest");
      case 3:
        return t("Index");
      case 4:
        return t("Marks");
      default:
        break;
    }
  }

  const getTriggerStatus = (v) => {
    switch (v.status) {
      case 1:
        return t("NotTriggered");
      case 2:
        return t("TriggerSucceed");
      case 3:
        return t("OrderFailed");
      case 4:
        return t("Canceled");

      default:
        return t("NotTriggered");
    }
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
        <span>{t("OrderAmount")}({t("Cont")})</span>
        <span>{t("TriggeringType")}</span>
        <span>{t("TriggerPrice")}</span>
        <span>{t("PositionMode")}</span>
        <span>{t("TriggerStatus")}</span>
        <span>{t("orderCashTime")}</span>
      </div>
      <div className="table-body">
        <Spin loading={loading}>
          {orderList.length > 0 ? (
            <div className="table-body">
              {orderList.map((el, index) => (
                <section className="table-row" key={index}>
                  <span className="symbol">
                    <span className="symbol-text">
                      {getSymbol(el.contractId)}
                    </span>
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
                    <span className="pnl-text">{getPnLType(el)}</span>
                  </span>
                  <span>
                    {el.orderType === 1
                      ? formatByPriceTick(el.orderPrice, el.contractId)
                      : t("Market")}
                  </span>
                  <span>{el.quantity === 999999 ? t("AllClose") : el.quantity}</span>
                  <span>{getTriggerType(el)}</span>
                  <span>{formatByPriceTick(el.triggerPrice, el.contractId)}</span>
                  <span>
                    {el.positionEffect === 1
                      ? `${el.marginType === 1 ? t("FullPosition") : t("isolated")}${
                          el.marginRate ? ` / ${Math.round(1 / el.marginRate)}x` : ""
                        }`
                      : "--"}
                  </span>
                  <span>
                    {getTriggerStatus(el)}
                  </span>
                  <span>{dateFormat2(el.updateTime)}</span>
                </section>
              ))}
              <LoadMore
                isLast={orderList.length === total}
                loading={loading}
                nextPage={() => _queryHisOrder(pageNum + 1)}
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
