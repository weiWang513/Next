import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, InputGroup, Slider, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { getInjectInfo, setInjectInfo } from '../../../../functions/info';
const Big = require('big.js')

const ModeContent = styled.div`
  padding-top: 0;
  padding-bottom: 24px;
`

const Tips = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 24px;
  margin-top: 16px;
  span{
    color: rgba(97, 89, 118, 1);
  }
`


const posiReverseModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const { t } = useTranslation()

  const confirm = ():void => {
    setInjectInfo('known', 1)
    onDismiss()
    props.openPosiReverseModal()
  }
  return (
    <Modal title={t('posiReverseT')} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      <ModeContent>
        <Tips>
          [{t('posiReverse')} - {t('SingleSide')}]: <span>{t('posiReverseS')}</span>
        </Tips>
        <Tips>
          [{t('posiReverse')} - {t('DoubleSide')}]: <span>{t('posiReverseD')}</span>
        </Tips>
        <Button width='100%' variant={'primary'} onClick={confirm} mt='74px' isDark={true}>{t('Known')}</Button>
      </ModeContent>
    </Modal>
  )
}

export default posiReverseModal;