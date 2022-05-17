import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Input, Select, InputGroup } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updatePrice, updatePriceType, updateStopPrice, updateStopPriceType } from "../../../../store/modules/placeSlice";
const Big = require('big.js')
const PriceInput = styled(Flex)`
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
const AddonAfter = styled(Flex)`
  // width: 130px;
  text-align: center;
  justify-content: center;
  span.symbol{
    min-width: 35px;
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 15px;
    // margin-right: ${({r}) => r};
  }
  height: 16px;
  padding-left: 12px;
  border-left: 1px solid #4A4062;
`
const RInput = styled(Input)`
  height: 40px;
  background: #1F1830;
  border-color: #1F1830;
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 21px;
`

const MarketPrice = styled(Flex)`
  height: 40px;
  background: #1F1830;
  border-radius: 4px;
  span.label{
    font-size: 12px;
    font-weight: 500;
    color: #615976;
    line-height: 17px;
  }
  span.market-price{
    flex: 1;
    
  }
`


const priceInput = (props) => {
  const stopPrice = useAppSelector(state => state.place.stopPrice)
  const priceTypeTab = useAppSelector(state => state.place.priceTypeTab)
  const stopPriceType = useAppSelector(state => state.place.stopPriceType)
  const contractItem = useAppSelector(state => state.contract.contractItem)
  const { t } = useTranslation();
  const dispatch = useAppDispatch()

  const changePriceType = (v):void => {
    dispatch(updateStopPriceType(v.value))
  }
  const renderPerfix = () => {
    return (
      <AddonBefore>{t('TriggerPrice')}:</AddonBefore>
    )
  }
  const renderAddonAfter = () => {
    return (
      <AddonAfter>
        <span className='symbol'>{contractItem.contractSide === 2 ? contractItem?.commodityName : contractItem.currencyName}</span>
        <Select
          scale='sm'
          width={72}
          isDark={true}
          value={stopPriceType}
          sp={10}
          ep={6}
          options={[
            {
              label: t('StopLast'),
              value: 2,
            },
            {
              label: t('StopIndex'),
              value: 3,
            },
            {
              label: t('StopMark'),
              value: 4,
            },
          ]}
          onChange={changePriceType}
        />
      </AddonAfter>
    )
  }
  const handleChange = (v) => {
    let n = v.target.value
    if (!contractItem?.priceTick) {
      return
    }
    if (n === '') {
      dispatch(updateStopPrice(n))
    }
    let pt = contractItem.priceTick
    let reg = /^\d+\.?\d*$/
    let regNumber = /^\d+\.?\d+$/
    if (reg.test(n)) {
      if (pt && regNumber.test(n)) {
        let price = Number.isInteger(Number(new Big(n).div(pt)))
          ? n
          : new Big(Math.floor(new Big(n).div(pt))).times(pt).toString()
          dispatch(updateStopPrice(price.length > 8 ? price.slice(0, 9) : price))
      } else {
        dispatch(updateStopPrice(n))
      }
    } else {
      return false
    }
    // dispatch(updateStopPrice(v.target.value))
  }
  return (
    <>
      {
        priceTypeTab === 4 && <PriceInput>
          <InputGroup
            startIcon={renderPerfix()}
            endIcon={renderAddonAfter()}
            ta={'right'}
            ep={4}
          >
            <RInput value={stopPrice} onChange={handleChange} />
          </InputGroup>
        </PriceInput>
      }
    </>
    
  )
}

export default priceInput;