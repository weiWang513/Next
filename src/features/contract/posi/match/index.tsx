import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Select } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { queryHisMatch } from "../../../../services/api/contract";
import { formatByPriceTick, toFix6, dateFormat2 } from "../../../../utils/filters";
import { getDecimal } from "../../../../utils/common";
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
    &.symbol {
      flex: 0 0 180px;
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
  const allContractList = useAppSelector((state) => state.contract.allContractList);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { colorUp, colorDown, orderUpColorArea, orderDownColorArea } = useUpDownColor();
  const { t } = useTranslation();

  const _timeList = () => [
    { value: 0, label: t("All") },
    { value: 1, label: t("OneDay") },
    { value: 2, label: t("AWeek") },
    { value: 3, label: t("AMonth") }
  ];

  const _matchTypeList = () => [t("Normal"), t("ForcedLiq"), t("BanktuptClose"), t("AutoClose")];

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
    queryMatchList(1, true);
  }, [timeIndex, contractId]);

  useEffect(() => {
    if (isLogin) {
      queryMatchList(1, true);
    } else {
      setMatchList([]);
    }
  }, [isLogin]);

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
    } else {
      params.endTime = new Date().getTime() * 1000;
      params.startTime = matchList[0].matchTime;
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

  const getSideEffect = (item) => {
    if (item.side > 0) {
      return item.bidPositionEffect === 1 ? t("BuyOpenLong") : t("BuyCloseShort");
    } else {
      return item.askPositionEffect === 1 ? t("SellOpenShort") : t("SellCloseLong");
    }
  };

  const getPnlColor = (item) => {
    if ((item.side > 0 && item.bidPnl > 0) || (item.side < 0 && item.askPnl > 0)) {
      return colorUp;
    } else if ((item.side > 0 && item.bidPnl < 0) || (item.side < 0 && item.askPnl < 0)) {
      return colorDown;
    } else {
      return "#fff";
    }
  };

  const getPosiMode = (item) => {
    if (item.side > 0) {
      return item.bidPositionEffect === 1
        ? `${item.bidMarginType === 1 ? t("FullPosition") : t("isolated")}${
            item.bidInitRate ? ` / ${Math.round(1 / item.bidInitRate)}x` : ""
          }`
        : "--";
    } else {
      return item.askPositionEffect === 1
        ? `${item.askMarginType === 1 ? t("FullPosition") : t("isolated")}${
            item.askInitRate ? ` / ${Math.round(1 / item.askInitRate)}x` : ""
          }`
        : "--";
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
        <span>{t("FilledPrice")}</span>
        {/* <span>{t("FilledTurnover")}</span> */}
        <span>
          {t("FilledAmount")}({t("Cont")})
        </span>
        <span>{t("MatchType")}</span>
        <span>{t("PositionMode")}</span>
        {/* <span>{t("FrozenMargin")}</span> */}
        <span>{t("ClosedPosiPL")}</span>
        <span>{t("Fee")}</span>
        <span>{t("MatchTime")}</span>
      </div>
      <div className="table-body">
        <Spin loading={loading}>
          {matchList.length > 0 ? (
            <div className="table-body">
              {matchList.map((el, index) => (
                <section className="table-row" key={index}>
                  <span className="symbol">
                    <span className="symbol-text">{_symbol(el.contractId)}</span>
                    <span
                      className="side-text"
                      style={{
                        color: el.side > 0 ? colorUp : colorDown,
                        background: el.side > 0 ? orderUpColorArea : orderDownColorArea
                      }}
                    >
                      {getSideEffect(el)}
                    </span>
                  </span>
                  <span>{formatByPriceTick(el.matchPrice, el.contractId)}</span>
                  <span>{el.matchQty}</span>
                  <span>
                    {el.side > 0
                      ? _matchTypeList()[el.bidMatchType]
                      : _matchTypeList()[el.askMatchType]}
                  </span>
                  <span>{getPosiMode(el)}</span>
                  <span
                    style={{
                      color: getPnlColor(el)
                    }}
                  >
                    {el.side > 0
                      ? el.bidPositionEffect !== 1
                        ? `${el.bidPnl > 0 ? "+" : ""}${toFix6(
                            el.bidPnl,
                            getDecimal(null, el.contractId)
                          )}`
                        : "--"
                      : el.askPositionEffect !== 1
                      ? `${el.askPnl > 0 ? "+" : ""}${toFix6(
                          el.askPnl,
                          getDecimal(null, el.contractId)
                        )}`
                      : "--"}
                  </span>
                  <span>
                    {el.side > 0
                      ? toFix6(el.bidFee, getDecimal(null, el.contractId))
                      : toFix6(el.askFee, getDecimal(null, el.contractId))}
                  </span>
                  <span>{dateFormat2(el.matchTime / 1000)}</span>
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
