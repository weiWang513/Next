import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, InputGroup, Slider, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";

const ModeContent = styled.div`
  width: 100%;
  padding-bottom: 24px;
  span{
    font-size: 14px;
    font-weight: 500;
    color: #807898;
    line-height: 24px;
  }
`

const renewModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const { t } = useTranslation()
  return (
    <Modal title={t('fm')} width={"336px"} onDismiss={onDismiss} {...props} hideCloseButton titleCenter>
      <ModeContent>
        <span>{t('fm1')}</span>
        <Button variant={'primary'} scale={'md'} width='100%' mt={20} onClick={onDismiss}>
          {t('fm2')}
        </Button>
      </ModeContent>
    </Modal>
  )
}

export default renewModal;