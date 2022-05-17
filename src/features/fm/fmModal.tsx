import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, InputGroup, Tooltip, Toggle, useModal, CheckboxGroup, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
const Big = require('big.js')

import { dateFormat2, slice6 } from '../../utils/filters';
import { subscribe } from '../../services/api/fm';
import { uuid } from '../../utils/utils';

import FmForm from './fmForm'
import Overview from './Overview'

const ModeContent = styled(Flex)`
  width: 648px;
  height: 494px;
  background: #f5f3fb;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  border-radius: 16px;
  position: relative
`

const fmModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const { t } = useTranslation()
  const [indexedProduct, setIndexedProduct] = useState(props.el)
  

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
    value: dateFormat2(Date.now(), "YYYY-MM-DD")
  },{
    label: t('fm7'),
    value: dateFormat2(Date.now(), "YYYY-MM-DD")
  },{
    label: t('fm8'),
    value: dateFormat2(Date.now()+props.el?.period*24*60*60*1000, "YYYY-MM-DD")
  }])
  

  const selectPro = v => {
    setIndexedProduct(v)
    setInfoArr([{
      label: t('list3'),
      value: `${new Big(v.annualReturns).times(100).toFixed(2)}%`
    },{
      label: t('list4'),
      value: `${v.period} ${t('list6')}`
    },{
      label: t('fm22'),
      value: `${v.userPurchaseUpperLimit} ${v.currencySymbol}`
    },{
      type: 'line'
    },{
      label: t('fm6'),
      value: dateFormat2(Date.now(), "YYYY-MM-DD")
    },{
      label: t('fm7'),
      value: dateFormat2(Date.now(), "YYYY-MM-DD")
    },{
      label: t('fm8'),
      value: dateFormat2(Date.now()+v?.period*24*60*60*1000, "YYYY-MM-DD")
    }])
  }

  return (
    <Modal width={"648px"} onDismiss={onDismiss} {...props} isDark={false} hideHeader>
      <ModeContent>
        <FmForm item={props.item} selectPro={selectPro} indexedProduct={indexedProduct} onDismiss={onDismiss} setReloadR={props.setReloadR} />
        <Overview infoArr={infoArr} />
      </ModeContent>
    </Modal>
  );
};

export default fmModal;
