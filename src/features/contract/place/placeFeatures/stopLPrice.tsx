import React, { useState, ChangeEvent } from 'react'
import styled from 'styled-components'
import { Flex, Input, Select, InputGroup } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateLossInput, updateLossStopType, updateProfitInput, updateProfitStopType } from '../../../../store/modules/placeSlice';
const Big = require('big.js')
const StopPPrice = styled(Flex)`
  margin-top: 8px;
  margin-bottom: 12px;
`
const AddonBefore = styled.div`
  font-size: 12px;
  font-weight: 500;
  color: #615976;
  line-height: 17px;
`
const RInput = styled(Input)`
  background: #1F1830;
  border-color: #1F1830;
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 21px;
`
const stopPPrice = props => {
  const lossInput = useAppSelector(state => state.place.lossInput)
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const lossStopType = useAppSelector(state => state.place.lossStopType)
  const setSL = useAppSelector(state => state.place.setSL)
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  // const handleChange = (v):void => {

    
  //   console.log('updateLossInput', v.target.value)
  //   dispatch(updateLossInput(v?.target?.value))
  // }

  const handleChange = (v) => {
    let n = v.target.value;
    if (!contractItem?.priceTick) {
      return false;
    }
    if (n === "") {
      dispatch(updateLossInput(n));
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
          updateLossInput(price.length > 8 ? price.slice(0, 9) : price)
        );
      } else {
        dispatch(updateLossInput(n));
      }
    } else {
      return false;
    }
  };

  const changePriceType = (v):void => {
    dispatch(updateLossStopType(v.value))
  }

  const renderPerfix = () => {
    return (
      <AddonBefore>{t('stopLossPrice')}:</AddonBefore>
    )
  }

  return (
    <>
      {
        setSL && <StopPPrice>
          <InputGroup
            startIcon={renderPerfix()}
            ta={'right'}
            isDark={true}
            scale={'sm'}
            mr='8px'
          >
            <Input type="text" value={lossInput} onChange={handleChange} />
          </InputGroup>
          <Select
              width='116px'
              scale='sm'
              isDark={true}
              value={lossStopType}
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