import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Select } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { queryFcOrders } from "../../../../services/api/contract";
import { dateFormat2, toFix6 } from "../../../../utils/filters";
import NoData from "../../../../components/NoData";
import LoadMore from "../../../../components/LoadMore";
import Spin from "../../../../components/Spin";

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

const FcOrders = () => {
  const [contractId, setContractId] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const [pageNum, setPageNum] = useState(1);
  const [list, setList] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [timeIndex, setTimeIndex] = useState(0);

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

  const _symbol = (contractId) => {
    let symbol = "--";
    let item = allContractList.find((el) => el?.contractId === contractId);
    if (item) {
      symbol = item?.symbol;
    }
    return symbol;
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
    queryList(1, true);
  }, [timeIndex, contractId]);

  useEffect(() => {
    if (isLogin) {
      queryList(1, true);
    } else {
      setList([]);
    }
  }, [isLogin]);

  const timeFilter = (v) => {
    switch (v) {
      case 0:
        setStartTime(null);
        setTimeIndex(v);
        break;
      case 1:
        setStartTime(new Date().getTime() - 24 * 60 * 60 * 1000);
        setTimeIndex(v);
        break;
      case 2:
        setStartTime(
          new Date().getTime() - 7 * 24 * 60 * 60 * 1000
        );
        setTimeIndex(v);
        break;
      case 3:
        setStartTime(
          new Date().getTime() - 30 * 24 * 60 * 60 * 1000
        );
        setTimeIndex(v);
        break;
      default:
        break;
    }
  };

  // 查询成交明细
  const queryList = (page = 1, isInit = false) => {
    if (!isLogin) return;
    page === 1 && setPageNum(1);
    let params = {
      pageSize: pageSize,
      pageNum: page ? page : pageNum,
      contractId: null,
      startTime: null,
      endTime: null,
    };
    if (contractId) {
      params.contractId = contractId;
    }
    if (startTime) {
      params.startTime = startTime;
    }
    setLoading(true);
    queryFcOrders(params).then((res) => {
      setLoading(false);
      if (res.data.code === 0) {
        let _list = isInit
          ? res.data.data.list
          : list.concat(res.data.data.list);
        setList(_list || []);
        setTotal(res.data.data.total);
        setPageNum(res.data.data.pageNum);
      }
    });
  };

  const handleContractIdChange = (option) => {
    setContractId(option.value);
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
        <span>
          {t("OrderAmount")}({t("Cont")})
        </span>
        <span>
          {t("FilledAmount")}({t("Cont")})
        </span>
        <span>{t("FilledTurnover")}</span>
        <span>{t("Status")}</span>
        <span>{t("PositionMode")}</span>
        <span>{t("Time")}</span>
      </div>
      <div className="table-body">
        <Spin loading={loading}>
          {list.length > 0 ? (
            <div className="table-body">
              {list.map((el, index) => (
                <section className="table-row" key={index}>
                  <span className="symbol">
                    <span className="symbol-text">{_symbol(el.contractId)}</span>
                    <span
                      className="side-text"
                      style={{
                        color: el.side > 0 ? colorUp : colorDown,
                        background:
                          el.side > 0 ? orderUpColorArea : orderDownColorArea,
                      }}
                    >
                      {el.side > 0 ? t("BuyCloseShort") : t("SellCloseLong")}
                    </span>
                  </span>
                  <span>{el.closeQty}</span>
                  <span>{el.filledQuantity}</span>
                  <span>{toFix6(el.filledCurrency)}</span>
                  <span>{t(`orderStatus${el.orderStatus}`)}</span>
                  <span>
                    {el.marginType === 1 ? t("FullPosition") : t("isolated")}
                  </span>
                  <span>{dateFormat2(Math.floor(el.timestamp / 1000))}</span>
                </section>
              ))}
              <LoadMore
                isLast={list.length === total}
                loading={loading}
                nextPage={() => queryList(pageNum + 1)}
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

export default FcOrders;
