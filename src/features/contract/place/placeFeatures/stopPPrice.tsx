import React, { useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { Flex, Input, Select, InputGroup } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateProfitInput, updateProfitStopType } from '../../../../store/modules/placeSlice';
const Big = require('big.js')
const StopPPrice = styled(Flex)`

`
const AddonBefore = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  line-height: 17px;
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
const stopPPrice = props => {
  const profitInput = useAppSelector(state => state.place.profitInput)
  const profitStopType = useAppSelector(state => state.place.profitStopType)
  const setSP = useAppSelector(state => state.place.setSP)
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const changePriceType = (v):void => {
    dispatch(updateProfitStopType(v.value))
  }

  const handleChange = (v) => {
    let n = v.target.value;
    if (!contractItem?.priceTick) {
      return false;
    }
    if (n === "") {
      dispatch(updateProfitInput(n));
    }
    let pt = contractItem.priceTick;
    let reg = /^\d+\.?\d*$/;
    let regNumber = /^\d+\.?\d+$/;
    if (reg.test(n)) {
      if (pt && regNumber.test(n)) {
        let price = Number.isInteger(Number(new Big(n).div(pt)))
          ? n
          : new Big(Math.floor(new Big(n).div(pt))).times(pt).toString();
        dispatch(
          updateProfitInput(price.length > 8 ? price.slice(0, 9) : price)
        );
      } else {
        dispatch(updateProfitInput(n));
      }
    } else {
      return false;
    }
  };

  const renderPerfix = () => {
    return (
      <AddonBefore>{t('stopProfitPrice')}:</AddonBefore>
    )
  }
  return (
    <>
      {
        setSP && <StopPPrice>
          <InputGroup
            startIcon={renderPerfix()}
            ta={'right'}
            isDark={true}
            scale={'sm'}
            mr='8px'
          >
            <Input type="text" value={profitInput} onChange={handleChange} />
          </InputGroup>
          <Select
            width='116px'
            scale='sm'
            isDark={true}
            value={profitStopType}
            options={[
              {
                label: t('StopLast'),
                value: 2,
              },
              // {
              //   label: '指数价',
              //   value: 3,
              // },
              {
                label: t('StopMark'),
                value: 4,
              },
            ]}
            onChange={changePriceType}
          />
        </StopPPrice>
      }
    </>
  )
}

export default stopPPrice;