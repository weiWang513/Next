import React, { useState, useEffect, useRef } from 'react'
import styled from 'styled-components'
import { Flex, Button, Input, Modal, ModalProps, InputGroup, Tooltip, Toggle, useModal, CheckboxGroup, message } from '@ccfoxweb/uikit'
import { useTranslation } from "next-i18next";

import { ReactComponent as Info } from "/public/images/SVG/fm-info.svg";
import { ReactComponent as Close } from "/public/images/SVG/fm-close.svg";
import ChangeSize from '../../hooks/useClientSize';

const ContentR = styled.div`
  width: 100%;
  background: #F5F3FB;
  border-radius: 16px;
  padding: 0 12px;
  padding-bottom: 16px;
  margin-top: 16px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 0;
    height: 494px;
    padding: 0 24px;
    background: #F5F3FB;
    display: flex;
    flex-direction: column;    
  }
`

const ContentRT = styled(Flex)`
  flex: 0 0 56px;
  justify-content: space-between;
  span{
    font-size: 14px;
    font-weight: 500;
    color: #130F1D;
    line-height: 20px;
  }
`

const ContentRB = styled.div`
  ${({ theme }) => theme.mediaQueries.md} {
    flex: 1;
    overflow: overlay;
    padding-bottom: 24px;
  }
`

const InfoLine = styled(Flex)<{c?;}>`
  height: 17px;
  justify-content: space-between;
  margin-bottom: 12px;
  span.label{
    font-size: 12px;
    font-weight: 400;
    color: #7C7788;
    line-height: 17px;
    display: flex;
    flex: 1;
    align-items: center;
  }
  span.value{
    font-size: 12px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: ${({c}) => c || 'rgba(34, 10, 96, 1)'};
    line-height: 15px;
    text-align: right;
  }
`

const Line = styled.div`
  height: 1px;
  background: #E9E7F0;
  margin-top: 16px;
  margin-bottom: 16px;
`

const TipsTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #130F1D;
  line-height: 20px;
  margin-bottom: 8px;
  margin-top: 24px;
`

const Tips = styled.div`
  font-size: 12px;
  color: #7C7788;
  line-height: 20px;
`

const overView = props => {
  const { t } = useTranslation()
  let size = ChangeSize();

  const tips = [{
    t: t('fm10')
  },{
    t: t('fm11')
  },{
    t: t('fm13')
  },{
    t: t('fm14')
  },]

  return <ContentR>
    <ContentRT>
      <span>{t('fm5')}</span>
      {size.width > 1280 && <Close onClick={props.onDismiss} />}
    </ContentRT>
    <ContentRB>
      {
        props.infoArr?.map((e, i)=>{
          return e.type === 'line' ? <Line key={i} />  : <InfoLine key={i} c={i===0 ? '#14AF81' : ''}>
            <span className="label">
              {e.label}
            </span>
            <span className="value">{e.value}</span>
          </InfoLine>
        })
      }
      <TipsTitle>
        {t('fm9')}
      </TipsTitle>
      {
        tips?.map((e, i) => {
          return <Tips key={i}>{e.t}</Tips>
        })
      }
    </ContentRB>
  </ContentR>
}

export default overView