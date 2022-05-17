import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Button, message, Modal, ModalProps } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { useAppDispatch, useAppSelector } from "../../../../store/hook";
import { updateModeType } from '../../../../store/modules/placeSlice';
import { adjustMarginRate } from '../../../../services/api/contract';
import { uuid } from '../../../../utils/utils';
import { _shouldRestful } from '../../../../utils/tools';
import { savePlaceParams } from '../../../../utils/common';

const ModeContent = styled.div`
  padding: 24px;
  padding-top: 0;
`

const Switch = styled(Flex)`
  width: 288px;
  height: 32px;
  background: #1F1830;
  border-radius: 4px;
  margin-bottom: 24px;
  span.switch-item{
    flex: 1;
    height: 32px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #615976;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
  }
  span.switch-index-item{
    background: #3F3755;
    color: #FFFFFF;
  }
`

const ConfirmContentTips = styled.div`
  padding: 20px 0;
  span{
    font-size: 12px;
    color: #615976;
  }
  span.t{
    font-size: 12px;
    color: #615976;
  }
  span.sub-t{
    font-size: 12px;
    font-weight: 600;
    color: #fff;
  }
`

const placeModeModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const posiMode = useAppSelector(state => state.place.posiMode)
  const { t } = useTranslation()
  const [modeTypeS, setModeType] = useState(1)
  const [adjustMarginRateUuid, setAjustMarginRateUuid] = useState(uuid())
  const dispatch = useAppDispatch()
  useEffect(() => {
    console.log('props.marginType', props.marginType)
    setModeType(props.marginType)
  }, [props.marginType])
  const changeModeType = (v:number):void => {
    setModeType(v)
  }
  
  const confirm = ():void => {
    if (props.isPosi) {
      changeMarginRate(props.posi, modeTypeS, () => onDismiss())
    } else {
      dispatch(updateModeType(modeTypeS))
      savePlaceParams('modeType', modeTypeS)
      onDismiss()
    }
  }

  const changeMarginRate = (item, marginType, f) => {
    const params = {
      contractId: item.contractId,
      // initMarginRate: marginType === 1 ? '0' : marginRate,
      initMarginRate: item.initMarginRate,
      marginType: marginType,
      posiSide: item.posiSide,
    }

    adjustMarginRate({
      params: params,
      headers: { unique: adjustMarginRateUuid },
    })
      .then(res => {
        setAjustMarginRateUuid(uuid())
        if (res.data.code === 0) {
          message.success(t('ModifiedSuccessful'))
          // message.success(I18n.t('ChangedSuccess'))
          _shouldRestful()
          f()
        }
      })
      .catch(err => {
        setAjustMarginRateUuid(uuid())
        f()
      })
  }

  return (
    <Modal title={t('MarginMode')} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      <ModeContent>
        <Switch>
          <span className={`switch-item ${modeTypeS === 1 ? 'switch-index-item' : ''}`} onClick={() => changeModeType(1)}>{t('FullPosition')}</span>
          <span className={`switch-item ${modeTypeS === 2 ? 'switch-index-item' : ''}`} onClick={() => changeModeType(2)}>{t('isolated')}</span>
        </Switch>
        <Button width='100%' variant={'primary'} onClick={confirm}>{t('ConfirmB')}</Button>
      </ModeContent>
      {
        modeTypeS === 1 ? (
          <ConfirmContentTips>
            <span className="sub-t">[{t('FullPositionM')}]：</span>
            <span className='t'>{t('FullPositionMTip')}</span>
          </ConfirmContentTips>
        ) : (
          <ConfirmContentTips>
            <span className="sub-t">[{t('isolatedM')}]：</span>
            <span className='t'>{t('isolatedMTip')}</span>
          </ConfirmContentTips>
        )
      }
    </Modal>
  )
}

export default placeModeModal;