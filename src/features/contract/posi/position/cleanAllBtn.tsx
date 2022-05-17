import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, CheckboxGroup, Slider, message, useModal } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import CleanAll from './cleanAll'
import { useAppSelector } from '../../../../store/hook';

const CancelAll = styled.div<{cur}>`
  min-width: 100px;
  text-align: center;
  cursor: ${({ cur }) => cur};
  height: 24px;
  padding: 0 16px;
  background: #1F1830;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 24px;
  margin-right: 16px;
  opacity: 0.7;
  &:hover {
    opacity: 1;
  }
`
const cleanAllBtn = props => {
  const { t } = useTranslation();
  const posListProps = useAppSelector((state) => state.assets.posListProps);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const curDelegateInfo = useAppSelector(
    (state) => state.assets.curDelegateInfo
  );
  const conditionOrders = useAppSelector(
    (state) => state.assets.conditionOrders
  );
  const [openCleanAllModal] = useModal(<CleanAll />, true, true, `CleanAll`)
  const cleanAll = () => {

    if (posListProps.length || curDelegateInfo.OpenOrders?.length || conditionOrders.length || isLogin) {
      openCleanAllModal()
    }
  }
  return (
    <CancelAll onClick={() => cleanAll()} cur={posListProps.length || curDelegateInfo.OpenOrders?.length || conditionOrders.length || isLogin ? 'pointer' : 'not-allowed'}>{t('cleanAll')}</CancelAll>
  )
}

export default cleanAllBtn