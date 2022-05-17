import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, CheckboxGroup, Slider, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";
import { adjustMarginRate, cleanAll } from '../../../../services/api/contract';
import { uuid } from '../../../../utils/utils';
import { _shouldRestful } from '../../../../utils/tools';
import { getInjectInfo, setInjectInfo } from '../../../../functions/info';
const Big = require('big.js')

const ModeContent = styled.div`
  padding-top: 0;
  padding-bottom: 24px;
`

const BtnW = styled(Flex)`
  justify-content: space-between;
  margin: 24px 0;
`

const CleanAllM = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #615976;
  line-height: 24px;
`

const Warn = styled.div`
  width: 288px;
  background: rgba(236, 81, 109, 0.1);
  border-radius: 8px;
  margin-top: 16px;
  padding: 16px;
  span.m{
    display:inline-block;
    font-size: 12px;
    font-weight: 500;
    color: #EC516D;
    line-height: 17px;
    margin-top: 4px;
  }
`
const CleanAllWarnT = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #EC516D;
`

const cleanAllModal: React.FC<ModalProps> = ({ title, onDismiss, selectAreaCode, ...props }) => {
  const { t } = useTranslation()
  const [checked, setChecked] = useState(false)
  const [loading, setLoading] = useState(false)
  const cancel = f => {
    f()
  }

  useEffect(() => {
    let _f = getInjectInfo('cleanAllFlag')
    if (_f) {
      setChecked(Boolean(_f))
    }
  }, [])

  const confirm = () => {
    setLoading(true)
    const params = {
      params: {},
      headers: {unique: uuid()}
    }
    if (checked) {
      setInjectInfo('cleanAllFlag', checked)
    }
    cleanAll(params).then(res=>{
      setLoading(false)
      console.log('res', res)
      message.success(t('submitSucc'))
      onDismiss()
      // if (res.data?.code === 0) {
      // }
    }).catch(()=>{
      setLoading(false)
      message.success(t('submitSucc'))
      onDismiss()
    })
  }
  return (
    <Modal title={t('cleanAllT')} width={"336px"} onDismiss={onDismiss} {...props} isDark={true}>
      <ModeContent>
        <CleanAllM>
          {t('cleanAllM')}
        </CleanAllM>
        <Warn>
          <CheckboxGroup
            text={<CleanAllWarnT>{t('cleanAllWarn')}</CleanAllWarnT>}
            checked={checked}
            onChange={() => setChecked(!checked)}
            scale="md"
            bg='rgba(236, 81, 109, 1)'
            isDark
          />
          <span className="m">{t('cleanAllWarnM')}</span>
        </Warn>
        <BtnW>
          <Button width='47%' variant={'secondary'} onClick={() => cancel(onDismiss)} isDark={true}>{t('Cancel')}</Button>
          <Button width='47%' variant={'primary'} disabled={!checked} isLoading={loading} isDark={true} onClick={confirm}>{t('ConfirmB')}</Button>
        </BtnW>
      </ModeContent>
    </Modal>
  )
}

export default cleanAllModal;