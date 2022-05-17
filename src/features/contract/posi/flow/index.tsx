import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Select } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../../store/hook";
import useUpDownColor from "../../../../hooks/useUpDownColor";
import { queryAccountAssetFlow, queryAssetFlowType } from '../../../../services/api/contract'
import { toFix6, dateFormat2 } from '../../../../utils/filters'
import NoData from '../../../../components/NoData'
import LoadMore from '../../../../components/LoadMore'
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
      background: #08060F;
    }
  }
  .table-head > span, .table-row > span {
    flex: 1;
    font-size: 12px;
    font-weight: 500;
    color: #3F3755;
    text-align: left;
    padding-left: 16px;
  }
  .table-row > span {
    color: #FFFFFF;
    & > .symbol-text {
      font-size: 16px;
      font-family: DINPro-Bold;
      font-weight: bold;
      color: #FFFFFF;
    }
  }
`
const FilterRow = styled.section`
  height: 40px;
  display: flex;
  align-items: center;
  & > span {
    color: #FFFFFF;
    font-size: 12px;
    margin: 0 8px 0 16px;
  }
`

const Flow = () => {
  const [currencyId, setCurrencyId] = useState(null)
  const [type, setType] = useState(null)
  
  const [matchStartDate, setMatchStartDate] = useState(null)
  const [timeIndex, setTimeIndex] = useState(0)
  const [typeList, setTypeList] = useState([])
  const [accountAssetFlowList, setAccountAssetFlowList] = useState([])

  const [isLast, setIsLast] = useState(false)
  const [loading, setLoading] = useState(true)

  const pageSize = 10

  const currencyList = useAppSelector(state => state.contract.currencyList)
  const isLogin = useAppSelector(state => state.app.isLogin)
  const { colorUp, colorDown } = useUpDownColor()
  const { t } = useTranslation()

  const _timeList = () => [
    { value: 0, label: t("All") },
    { value: 1, label: t("OneDay") },
    { value: 2, label: t("AWeek") },
    { value: 3, label: t("AMonth") },
  ]

  const _typeList = () => {
    return {
      1001: t('DepositIn'),
      1002: t('Withdrawl'),
      1003: t('DepositFiatOtc'),
      1004: t('WithdrawFiatOtc'),
      1005: t('ExchangePointCard'),
      1006: t('WithdrawFee'),
      1007: t('DepositFiatFee'),
      1008: t('WithdrawFiatFee'),
      1009: t('WithdrawFailureReturn'),
      1010: t('WithdrawFiatReturn'),
      2001: t('SpotTrade'),
      2002: t('SpotFee'),
      2004: t('SpotFeeReturn'),
      2005: t('SpotFeeDiscount'),
      3001: t('ContractFee'),
      3002: t('ContractFeeReturn'),
      3003: t('ContractFeeDiscount'),
      3004: t('ContractClosePnl'),
      3005: t('ContractSettlePnl'),
      3006: t('ContractDeliveryFee'),
      3007: t('FundingSettlementPnl'),
      3008: t('Type3008'),
      30081: t('Type30081'),
      30082: t('Type30082'),
      4001: t('OptionFee'),
      4002: t('OptionClosePnl'),
      4003: t('OptionExerciseFee'),
      4004: t('OptionExercisePnl'),
      4005: t('OptionFeeReturn'),
      4006: t('OptionFeeDiscount'),
      7001: t('VentureFund'),
      8001: t('TransferOfFunds'),
      9001: t('InviteGift'),
      9002: t('SpotRebate'),
      9003: t('ContractRebate'),
      9004: t('OptionRebate'),
    }
  }

  const _allTypelist = () => {
    let allTypelist = typeList.map(el => {
      return {
        label: _typeList()[el.flowType],
        value: el.flowType,
      }
    })
    return [{ label: t("All"), value: null }, ...allTypelist]
  }

  const _symbol = currencyId => {
    let symbol = '--'
    let item = currencyList.find(el => el?.currencyId === currencyId)
    if (item) {
      symbol = item?.symbol
    }
    return symbol
  }

  const _currencyList = () => {
    let _currencyList = currencyList
    const list = _currencyList.map(item => {
      return {
        label: item.symbol,
        value: item.currencyId
      }
    })
    list.unshift({ value: null, label: t("All") })
    return list
  }

  const timeFilter = (v) => {
    switch (v) {
      case 0:
        setMatchStartDate(null)
        setTimeIndex(v)
        break
      case 1:
        setMatchStartDate(new Date().getTime() * 1000 - 24 * 60 * 60 * 1000 * 1000)
        setTimeIndex(v)
        break
      case 2:
        setMatchStartDate(new Date().getTime() * 1000 - 7 * 24 * 60 * 60 * 1000 * 1000)
        setTimeIndex(v)
        break
      case 3:
        setMatchStartDate(new Date().getTime() * 1000 - 30 * 24 * 60 * 60 * 1000 * 1000)
        setTimeIndex(v)
        break
      default:
        break
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 10000)
  }, []);

  useEffect(() => {
    _queryAccountAssetFlow(1, true)
  }, [timeIndex, currencyId, type])

  useEffect(() => {
    if (isLogin) {
      _queryAssetFlowType()
      _queryAccountAssetFlow(1, true)
    } else {
      setAccountAssetFlowList([])
    }
  }, [isLogin])

  const _queryAssetFlowType = () => {
    queryAssetFlowType().then(res => {
      if (res.data.code === 0) {
        setTypeList(res.data.data)
      }
    })
  }

  const _queryAccountAssetFlow = (side = 1, isInit = false) => {
    if (!isLogin) return
    setLoading(true)
    queryAccountAssetFlow({
      pageSize: pageSize,
      currencyId: currencyId,
      type: type,
      startTime: matchStartDate,
      id:
        accountAssetFlowList.length && !isInit
          ? side > 0
            ? accountAssetFlowList[accountAssetFlowList.length - 1].flowId
            : accountAssetFlowList[0].flowId
          : '',
      side: side,
    }).then(res => {
      setLoading(false)
      if (res.data.code === 0) {
        if (res.data.data.length) {
          if (res.data.data.length < pageSize && side > 0) {
            setIsLast(true)
          } else {
            setIsLast(false)
          }
          let list = isInit ? res.data.data : accountAssetFlowList.concat(res.data.data)
          setAccountAssetFlowList(list)
        } else {
          setIsLast(true)
          if (isInit) {
            setAccountAssetFlowList([])
          }
        }
      }
    })
  }

  const handleCurrencyIdChange = option => {
    setCurrencyId(option.value)
  }

  const handleTypeChange = option => {
    setType(option.value)
  }

  return (
    <Table>
      <FilterRow>
        <span>{t("Currency")}</span>
        <Select
          width={160}
          maxHeight={300}
          scale={'sm'}
          isDark={true}
          options={_currencyList()}
          value={currencyId}
          onChange={handleCurrencyIdChange}
        />
        <span>{t("Type")}</span>
        <Select
          width={180}
          maxHeight={300}
          scale={'sm'}
          isDark={true}
          options={_allTypelist()}
          value={type}
          onChange={handleTypeChange}
        />
        <span>{t("Time")}</span>
        <Select
          width={160}
          scale={'sm'}
          isDark={true}
          options={_timeList()}
          value={timeIndex}
          onChange={option => timeFilter(option.value)}
        />
      </FilterRow>
      <div className="table-head">
        <span>{t("Currency")}</span>
        <span>{t("Type")}</span>
        <span>{t("Amount")}</span>
        <span>{t("Balance")}</span>
        <span>{t("Time")}</span>
      </div>
      <div className="table-body">
        <Spin loading={loading}>
          {accountAssetFlowList.length > 0 ? (
            <div className="table-body">
              {accountAssetFlowList.map((el, index) => (
                <section className="table-row" key={index}>
                  <span className="symbol-text">{_symbol(el.currencyId)}</span>
                  <span>{_typeList()[el.flowType]}</span>
                  <span style={{ 'color': el.num > 0 ? colorUp : colorDown }}>
                    {el.num > 0 ? '+' : ''}{toFix6(el.num, el.currencyId === 7 ? 2 : 6)}
                  </span>
                  <span>{toFix6(el.total, el.currencyId === 7 ? 2 : 6)}</span>
                  <span>{dateFormat2(el.occureTime / 1000)}</span>
                </section>
              ))}
              <LoadMore isLast={isLast} loading={loading} nextPage={() => _queryAccountAssetFlow(1)} />
            </div>
          ) : (
          <NoData />
          )}
        </Spin>
      </div>
    </Table>
  )
}

export default Flow