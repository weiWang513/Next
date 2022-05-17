import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Select, message } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { queryHisMatch } from "../../../../services/api/spot";
import {
  formatSpotPriceByTick,
  toFix6,
  dateFormat2,
  getCurrencyPrecisionById,
  formatSpotCurrency2FiatValue
} from "../../../../utils/filters";
import NoData from "../../../../components/NoData";
import LoadMore from "../../../../components/LoadMore";
import Spin from "../../../../components/Spin";
import { ReactComponent as Copy } from "/public/images/SVG/copy.svg";
import copy from "copy-to-clipboard";

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
      flex: 1;
      // flex: 0 0 160px;
    }
    &.operate {
      flex: 1;
      // flex: 0 0 180px;
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

const Match = () => {
  const [contractId, setContractId] = useState(null);
  const [matchEndDate, setMatchEndDate] = useState(null);
  const [matchStartDate, setMatchStartDate] = useState(null);
  const [timeIndex, setTimeIndex] = useState(0);
  const [matchList, setMatchList] = useState([]);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(true);

  const pageSize = 10;
  const spotList = useAppSelector((state) => state.spot.allSpotList);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();
  const { t } = useTranslation();

  const _timeList = () => [
    { value: 0, label: t("All") },
    { value: 1, label: t("OneDay") },
    { value: 2, label: t("AWeek") },
    { value: 3, label: t("AMonth") }
  ];

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
      queryMatchList(1, true);
    } else {
      setMatchList([]);
    }
  }, [timeIndex, contractId, isLogin]);

  const timeFilter = (v) => {
    switch (v) {
      case 0:
        setMatchEndDate(null);
        setMatchStartDate(null);
        setTimeIndex(v);
        break;
      case 1:
        setMatchEndDate(null);
        setMatchStartDate(new Date().getTime() * 1000 - 24 * 60 * 60 * 1000 * 1000);
        setTimeIndex(v);
        break;
      case 2:
        setMatchEndDate(null);
        setMatchStartDate(new Date().getTime() * 1000 - 7 * 24 * 60 * 60 * 1000 * 1000);
        setTimeIndex(v);
        break;
      case 3:
        setMatchEndDate(null);
        setMatchStartDate(new Date().getTime() * 1000 - 30 * 24 * 60 * 60 * 1000 * 1000);
        setTimeIndex(v);
        break;
      default:
        break;
    }
  };

  // 查询成交明细
  const queryMatchList = (side = 1, isInit = false) => {
    if (!isLogin) return;
    let params = {
      pageSize: pageSize,
      side: side,
      contractId: null,
      endTime: null,
      startTime: null
    };
    if (contractId) {
      params.contractId = contractId;
    }
    if (side > 0) {
      params.endTime = matchEndDate || new Date().getTime() * 1000;
      params.startTime = matchStartDate;
    }
    setLoading(true);
    queryHisMatch(params).then((res) => {
      // console.log("queryHisMatch", params, res.data);
      setLoading(false);
      if (res.data.code === 0) {
        if (res.data.data.length) {
          setMatchEndDate(res.data.data[res.data.data.length - 1].matchTime);
          if (res.data.data.length < pageSize && side > 0) {
            setIsLast(true);
          } else {
            setIsLast(false);
          }
          let list = isInit ? res.data.data : matchList.concat(res.data.data);
          setMatchList(list);
        } else {
          setIsLast(true);
          if (isInit) {
            setMatchList([]);
          }
        }
      }
    });
  };

  const handleContractIdChange = (option) => {
    setMatchEndDate(null);
    setContractId(option.value);
  };

  const curItem = (id) => {
    if (!id) return null;
    const spotItem = spotList.find((item) => item.contractId === id);
    return spotItem ? spotItem : {};
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
        {/* <span>订单类型</span> */}
        <span>{t("Side")}</span>
        <span>{t("FilledPrice")}</span>
        <span>{t("FilledAmount")}</span>
        <span>{t("FilledTurnover")}</span>
        <span>{t("Fee")}</span>
        <span className="time">{t("Time")}</span>
        <span className="operate">{t("OrderId")}</span>
      </div>
      <div className="table-body">
        <Spin loading={loading}>
          {matchList.length > 0 ? (
            <div className="table-body">
              {matchList.map((el, index) => (
                <section className="table-row" key={index}>
                  <span className="symbol">
                    <span className="symbol-text">{curItem(el.contractId).symbol}</span>
                  </span>
                  {/* <span>{el.orderType === 1 ? '限价' : '市价'}</span> */}
                  <span
                    style={{
                      color: el.side > 0 ? colorUp : colorDown
                    }}
                  >
                    {el.side > 0 ? t("Buy") : t("Sell")}
                  </span>
                  <span>{formatSpotPriceByTick(el.matchPrice, el.contractId)}</span>
                  <span>
                    {toFix6(
                      el.matchQty,
                      getCurrencyPrecisionById(curItem(el.contractId).commodityId)
                    )}{" "}
                    {curItem(el.contractId).commodityName}
                  </span>
                  <span>
                    {toFix6(
                      el.matchAmt,
                      getCurrencyPrecisionById(curItem(el.contractId).currencyId)
                    )}{" "}
                    {curItem(el.contractId).currencyName}
                  </span>
                  <span>
                    {el.side > 0
                      ? formatSpotCurrency2FiatValue(el.bidFee)
                      : formatSpotCurrency2FiatValue(el.askFee)}{" "}
                    {/* 撮合不支持其它币种的手续费，仅支持USDT */}
                    USDT
                  </span>
                  <span className="time">{dateFormat2(el.matchTime / 1000)}</span>
                  <span className="operate">
                    {/* <span style={{marginRight: '8px'}}>{el.execId}</span> */}
                    <span style={{ marginRight: "8px" }}>
                      {el.side > 0 ? el.bidOrderId : el.askOrderId}
                    </span>
                    {/* <Copy style={{ cursor: "pointer" }} onClick={() => handelCopy(el.execId)} /> */}
                    <Copy
                      style={{ cursor: "pointer" }}
                      onClick={() => handelCopy(el.side > 0 ? el.bidOrderId : el.askOrderId)}
                    />
                  </span>
                </section>
              ))}
              <LoadMore isLast={isLast} loading={loading} nextPage={() => queryMatchList(1)} />
            </div>
          ) : (
            <NoData />
          )}
        </Spin>
      </div>
    </Table>
  );
};

export default Match;
