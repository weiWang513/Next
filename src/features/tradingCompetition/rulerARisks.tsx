import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex, Button } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/hook";

const RulersARisks = styled(Flex)`
  width: 375px;
  background: #130F1D;
  flex-direction: column;
  justify-content: flex-start;
  margin: auto;
  padding: 18px 24px;
  padding-top: 40px; 
  margin-top: -18px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 960px;
    border-radius: 16px;
    padding: 40px 120px;
  }
`
const T = styled.div`
  height: 27px;
  margin: 0 auto;
  position: relative;
  padding: 0 60px;
  ${({ theme }) => theme.mediaQueries.md} {
    height: 48px;
    // margin-bottom: 20px;
  }
  span{
    display: inline-block;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #643AFF;;
    line-height: 33px;
    margin: auto;
    margin-top: -5px;
    ${({ theme }) => theme.mediaQueries.md} {
      margin-top: -10px;
      line-height: 36px;
      font-size: 34px;
    }
  }
  span.l{
    background: url('/images/tradingCompetition/R.png') no-repeat;
    background-size: contain;
    width: 107px;
    height: 20px;
    transform: rotateY(180deg);
    position: absolute;
    left: 0;
    top: 16px;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 190px;
      height: 36px;
    }
  }
  span.r{
    background: url('/images/tradingCompetition/R.png') no-repeat;
    background-size: contain;
    width: 107px;
    height: 20px;
    position: absolute;
    right: 0;
    top: 16px;
    ${({ theme }) => theme.mediaQueries.md} {
      width: 190px;
      height: 36px;
    }
  }
`

const Li = styled(Flex)`
  margin-top: 16px;
  span.dot{
    flex: 0 0 6px;
    height: 6px;
    background: #39208D;
    border-radius: 50%;
    margin-right: 12px;
  }
  span.t{
    font-size: 14px;
    font-weight: 500;
    color: #BFBFBF;
    line-height: 21px;
  }
`

const CopyRight = styled.div`
  font-size: 14px;
  color: #665F7A;
  line-height: 17px;
  margin: auto;
  margin-top: 32px;
`
const rulersARisks = props => {
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const RulersLink = () => {
    let _link = ''
    switch (userHabit?.locale) {
      case 'zh_CN':
        _link = 'https://1316109.s4.udesk.cn/hc/articles/30586'
        break;
      case 'zh_TW':
        _link = 'https://ccfox.zendesk.com/hc/zh-hk/articles/5761424446617'
        break;
      case 'en_US':
        _link = 'https://ccfox.zendesk.com/hc/en-us/articles/5761424446617'
        break;
      case 'ko_KR':
        _link = 'https://ccfox.zendesk.com/hc/ko-kr/articles/5761424446617'
        break;
    
      default:
        _link = 'https://ccfox.zendesk.com/hc/en-us/articles/5761424446617'
        break;
    }
    let myWindow = window.open(_link);
    myWindow.opener = null;
  }
  const { t } = useTranslation();
  const rulers: {t?;}[] = [
    {t: t('tradingCompetition22')},
    {t: t('tradingCompetition23')},
    {t: t('tradingCompetition24')},
    {t: t('tradingCompetition25')},
    {t: t('tradingCompetition26')},
    {t: t('tradingCompetition27')}
  ] ;
  const risks: {t?;}[] = [
    {t: t('tradingCompetition28')},
    {t: t('tradingCompetition29')},
  ] 
  return <RulersARisks>
    <T>
      <span className="l"></span>
      <span className="r"></span>
      <span>{t('tradingCompetition30')}</span>
    </T>
    {rulers.map((e, i) => {
      return <Li key={i}>
        <span className="dot"></span>
        <span className="t">{e.t}</span>
      </Li>
    })}
    <Button variant={"primary"} mt={"8px"} width={"327px"} m='16px auto 56px auto' onClick={RulersLink}>
        {t('tradingCompetition31')}
    </Button>
    <T>
      <span className="l"></span>
      <span className="r"></span>
      <span>{t('tradingCompetition32')}</span>
    </T>
    {risks.map((e, i) => {
      return <Li key={i}>
        <span className="dot"></span>
        <span className="t">{e.t}</span>
      </Li>
    })}
    <CopyRight>© 2019 - 2022 ccfox.com All rights reserved.</CopyRight>
  </RulersARisks>
}

export default rulersARisks