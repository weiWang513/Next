import React, { useEffect } from "react";
import styled from "styled-components";
import {Flex} from "@ccfoxweb/uikit";
import Image from "next/image";
import { useTranslation } from "next-i18next";

import Icon0 from '../../../public/images/download/icon0.png'
import Icon1 from '../../../public/images/download/icon1.png'
import Icon2 from '../../../public/images/download/icon2.png'

const TextTips = styled(Flex)`
  flex-direction: column;
  margin-top: -60px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: block;    
    margin-top: 50px;
  }
`

const Line = styled(Flex)`
  flex-direction: column;
  margin-top: 56px;
  ${({ theme }) => theme.mediaQueries.md} {
    flex-direction: row;
    margin-bottom: 28px;
    margin-top: 0;
    align-items: flex-start;
  }
`

const D = styled(Flex)`
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 24px;
  ${({ theme }) => theme.mediaQueries.md} {
    align-items: flex-start;
    padding: 0px;

  }
  h2.l{
    font-size: 20px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 28px;
    margin-top: 16px;
    text-align: center;
    ${({ theme }) => theme.mediaQueries.md} {
      margin-top: 0;
      text-align: left;
    }
  }
  p.m{
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
    text-align: center;
    line-height: 20px;
    ${({ theme }) => theme.mediaQueries.md} {
      text-align: left;
    }
  }
`

const Icon = styled.div`
  img{
    width: 48px;
    height: 48px;
  }
  margin-right: 16px;
`

const textTips = props => {
  const { t } = useTranslation();
  const list = [{
    l: t('DownloadPage2'),
    m: t('DownloadPage3'),
    icon: Icon0
  },{
    l: t('DownloadPage4'),
    m: t('DownloadPage5'),
    icon: Icon1
  },{
    l: t('DownloadPage6'),
    m: t('DownloadPage7'),
    icon: Icon2
  }]
  return <TextTips>
    {
      list.map((e, i) => {
        return <Line key={i}>
          <Icon><Image src={e.icon} alt="" width="48px" height="48px" /></Icon>
          <D>
            <h2 className="l">{e.l}</h2>
            <p className="m">{e.m}</p>
          </D>
        </Line>
      })
    }
  </TextTips>
}

export default textTips