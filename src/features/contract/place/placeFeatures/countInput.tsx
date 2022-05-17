import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Input, InputGroup } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateCommissionValueBuy, updateCount, updateCostBuy, updatePercent, updatePriceType, updateCommissionValueSell, updateCostSell, updateQtyBuy, updateQtySell } from "../../../../store/modules/placeSlice";
import { calcCommissionValueFn, calcQuantityFn, costFn } from "../../../../utils/common";
const Big = require('big.js')
const CountInput = styled(Flex)`
  width: 288px;
  height: 40px;
  background: #1F1830;
  border-radius: 4px;
  margin-top: 10px;
  // cursor: pointer;
`

const AddonBefore = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  line-height: 17px;
`
const AddonAfter = styled.div`
  min-width: 48px;
  text-align: center;
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 15px;
  padding-left: 12px;
  border-left: 1px solid #4A4062;
`
const RInput = styled(Input)`
  height: 40px;
  background: #1F1830;
  border-color: #1F1830;
  text-align: right;
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 21px;
`

const countInput = (props) => {
  const countType = useAppSelector(state => state.place.countType)
  const lever = useAppSelector(state => state.place.lever)
  const price = useAppSelector(state => state.place.price)
  const crossLever = useAppSelector(state => state.place.crossLever)
  const modeType = useAppSelector(state => state.place.modeType)
  const priceType = useAppSelector(state => state.place.priceType)
  const contractItem = useAppSelector(state => state.contract.contractItem)
  const snapshot = useAppSelector(state => state.contract.snapshot)
  const countR = useAppSelector(state => state.place.count)
  const percent = useAppSelector(state => state.place.percent)
  const [count, setCount] = useState<number | string>('')
  const posiMode = useAppSelector(state => state.place.posiMode)
  const side = useAppSelector(state => state.place.side)
  const qtyBuy = useAppSelector(state => state.place.qtyBuy)
  const qtySell = useAppSelector(state => state.place.qtySell)
  const { t } = useTranslation();
  const dispatch = useAppDispatch()
  const renderPerfix = () => {
    return (
      // <AddonBefore>{countType ? `${t('Amount')}:` : `${t('Quantity')}:`}</AddonBefore>
      <AddonBefore>{t('Qty')}:</AddonBefore>
    )
  }
  const renderAddonAfter = () => {
    return (
      <AddonAfter>{countType ? contractItem?.contractSide === 1 ? contractItem?.commodityName : contractItem?.currencyName : t('Cont')}</AddonAfter>
    )
  }
  const calcCommissionValue = (_qty, side) => {
    let _commissionValue = calcCommissionValueFn(
      Math.floor(_qty),
      priceType,
      contractItem,
      price,
      snapshot
    )
    const _cost = costFn(_commissionValue, modeType, lever, crossLever)
    console.log('_cost', _cost, _commissionValue)
    if (side > 0) {
      dispatch(updateCommissionValueBuy(_commissionValue))
      dispatch(updateCostBuy(_cost))
    } else {
      dispatch(updateCommissionValueSell(_commissionValue)) // setCommissionValueSell(_commissionValue)
      dispatch(updateCostSell(_cost))
    }
  }
  useEffect(() => {
    setCount(countR)
  }, [countR])
  useEffect(() => {
    dispatch(updateCount(''))
  }, [countType])

  useEffect(() => {
    calcCommissionValue(qtyBuy, 1)
    calcCommissionValue(qtySell, -1)
  }, [price, lever])
  const handleChange = (v) => {
    const n = v.target?.value
    dispatch(updatePercent(0))
    if (!contractItem || isNaN(Number(n))) {
      return false
    }
    if (countType === 0) {
      if (Number(contractItem.lotSize) % 1) {
        if (Number(new Big(Number(n)).mod(Number(contractItem.lotSize)).toString())) {
          return false
        }
      } else if (String(n).indexOf('.') > -1) {
        return false
      }
    } else if (String(n).indexOf('.') > -1 && String(n).split('.')[1].length > 6) {
      return false
    }
    if (String(n).length > 10) {
      return
    }
    setCount(n)
    dispatch(updateCount(n))
    // if (posiMode) {
      
    // } else {
      
    // }
    if (countType) {
      if (contractItem.priceTick && (snapshot?.lastPrice && priceType === 3 || price && priceType === 1)) {
        let _perAm; // = new Big(n || 0).times(snapshot?.lastPrice || 0)
        if (contractItem && contractItem.contractSide === 1) {
          _perAm = new Big(n || 0).times(snapshot?.lastPrice || 0).div(lever)
        } else {
          _perAm = new Big(n || 0).div(lever)
        }
        const _buyObj = calcQuantityFn(_perAm, false, 1, contractItem, snapshot, price, crossLever, modeType, lever, priceType, countType, false)
        const _sellObj = calcQuantityFn(_perAm, false, -1, contractItem, snapshot, price, crossLever, modeType, lever, priceType, countType, false)
        // console.log(_buyObj, _sellObj, '_sellObj')
        dispatch(updateQtyBuy(_buyObj?.quantity))    
        dispatch(updateQtySell(_sellObj?.quantity))
        calcCommissionValue(_buyObj?.quantity, 1)
        calcCommissionValue(_sellObj?.quantity, -1)
      }
    } else {
      dispatch(updateQtyBuy(n))    
      dispatch(updateQtySell(n))    
      calcCommissionValue(n, 1)
      calcCommissionValue(n, -1)
    }
    // dispatch(updatePrice(v.target.value))
  }

  const focus = () => {
    if (percent) {
      dispatch(updatePercent(0))
      dispatch(updateQtyBuy(0))    
      dispatch(updateQtySell(0))   
      dispatch(updateCount('')) 
    }
  }
  return (
    <CountInput>
      <InputGroup
        startIcon={renderPerfix()}
        endIcon={renderAddonAfter()}
        ta={'right'}
      >
        <RInput value={count} onChange={handleChange} onFocus={focus} />
      </InputGroup>
    </CountInput>
  )
}

export default countInput;