import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, InputGroup, Slider, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateLever, updateModeType } from '../../../../store/modules/placeSlice';
import { ReactComponent as Minus } from "/public/images/SVG/minus.svg";
import { ReactComponent as Plus } from "/public/images/SVG/plus.svg";
import { ReactComponent as LeverTips } from "/public/images/SVG/leverTip.svg";
import { ReactComponent as LeverWarn } from "/public/images/SVG/leverWarn.svg";
import { adjustMarginRate } from '../../../../services/api/contract';
import { uuid } from '../../../../utils/utils';
import { savePlaceParams } from '../../../../utils/common';
import { _shouldRestful } from '../../../../utils/tools';


const ModeContent = styled.div`
  padding-top: 0;
  padding-bottom: 24px;
`

const PlusIcon = styled(Plus)`
  cursor: pointer;
`

const BtnW = styled(Flex)`
  justify-content: space-between;
  margin-top: 24px;
`

const Pt = styled.div`
  font-size: 16px;
  font-family: DINPro-Bold, DINPro;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 21px;
`
const Pst = styled.div`
  font-size: 12px;
  font-family: DINPro-Bold, DINPro;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 15px;
  margin-top: 10px;
`

const riskModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const { t } = useTranslation()
  return (
    <Modal title={t('riskTitle')} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      <ModeContent>
        <Pt>{t('RiskDescriptionA')}</Pt>
        <Pst>{t('RiskDescriptionB')}</Pst>
        <Pst>{t('RiskDescriptionC')}</Pst>
        <BtnW>
          <Button width='47%' variant={'secondary'} onClick={onDismiss} isDark={true}>{t('Cancel')}</Button>
          <Button width='47%' variant={'primary'} onClick={props.confirm}>{t('Save')}</Button>
        </BtnW>
      </ModeContent>
    </Modal>
  )
}

export default riskModal;