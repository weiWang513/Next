import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, InputGroup, Tooltip, Toggle, useModal, CheckboxGroup, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import BModal from '../../components/BModal'
import Overview from './Overview'
const Big = require('big.js')
import FmForm from './fmForm'
import { dateFormat2, dateFormatYMD } from '../../utils/filters';
import ChangeSize from '../../hooks/useClientSize';
const ModeContent = styled(Flex)`
  width: 648px;
  height: 494px;
  background: #f5f3fb;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  position: relative
`

const fmBModal = props => {
  const { t } = useTranslation()
  const [indexedProduct, setIndexedProduct] = useState()
  const [infoArr, setInfoArr] = useState([{
    label: t('list3'),
    value: `${new Big(props.el.annualReturns).times(100).toFixed(2)}%`
  },{
    label: t('list4'),
    value: `${props.el.period} ${t('list6')}`
  },{
    label: t('fm22'),
    value: `${props.el.userPurchaseUpperLimit} ${props.el.currencySymbol}`
  },{
    type: 'line'
  },{
    label: t('fm6'),
    value: dateFormatYMD(Date.now(),  "YYYY-MM-DD")
  },{
    label: t('fm7'),
    value: dateFormatYMD(Date.now(),  "YYYY-MM-DD")
  },{
    label: t('fm8'),
    value: dateFormatYMD(Date.now()+props.el?.period*24*60*60*1000,  "YYYY-MM-DD")
  }])
  
  let size = ChangeSize();

  useEffect(() => {
    setIndexedProduct(props.el)
  }, [])
  

  const selectPro = v => {
    setIndexedProduct(v)
    setInfoArr([{
      label: t('list3'),
      value: `${new Big(v.annualReturns).times(100).toFixed(2)}%`
    },{
      label: t('list4'),
      value: `${v.period} 天`
    },{
      label: t('fm22'),
      value: `${v.userPurchaseUpperLimit} ${v.currencySymbol}`
    },{
      type: 'line'
    },{
      label: t('fm6'),
      value: dateFormatYMD(Date.now(), "YYYY-MM-DD")
    },{
      label: t('fm7'),
      value: dateFormatYMD(Date.now(), "YYYY-MM-DD")
    },{
      label: t('fm8'),
      value: dateFormatYMD(Date.now()+v?.period*24*60*60*1000, "YYYY-MM-DD")
    }])
  }

  const onDismiss = () => {
    props.close()
  }

  const renderContent = () => {
    return props.show && <>
        {
          size.width < 1280 
            ? <FmForm item={props.item} selectPro={selectPro} indexedProduct={indexedProduct} onDismiss={onDismiss} infoArr={infoArr} setReloadR={props.setReloadR} /> 
            : <>
              <ModeContent>
                <FmForm item={props.item} selectPro={selectPro} indexedProduct={indexedProduct} onDismiss={onDismiss} infoArr={infoArr} setReloadR={props.setReloadR} /> 
                <Overview infoArr={infoArr} onDismiss={onDismiss} />
              </ModeContent>
            </>
        }
      </>
  }

  return <BModal show={props.show} close={onDismiss} renderContent={renderContent} />
}

export default fmBModal