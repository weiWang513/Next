import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex, Button } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";

const Date = styled(Flex)`
  flex-direction: column;
`

const T = styled.div`
  font-size: 20px;
  font-weight: normal;
  color: #FFD153;
  line-height: 29px;
  ${({ theme }) => theme.mediaQueries.md} {
    font-size: 22px;
    line-height: 32px;
  }
`
const DateT = styled.div`
  background: url('/images/tradingCompetition/timeBG.png');
  background-size: 200px 2px;
  background-position: center center;
  background-repeat: no-repeat;
  font-size: 22px;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 26px;
  width: 202px;
  text-align:center;
  ${({ theme }) => theme.mediaQueries.md} {
    background-size: 202px 2px;
  }
`
const DateWarp = styled.div`
  background: url('/images/tradingCompetition/timeBG1.png');
  background-size: 360px 83px;
  width: 360px;
  height: 83px;
  ${({ theme }) => theme.mediaQueries.md} {
    background-size: 603px 126px;
    width: 603px;
    height: 126px;
  }
`
const DateWarpInner = styled(Flex)`
  width: 320px;
  height: 36px;
  margin: auto;
  margin-top: 18px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 543px;
    height: 56px;
    margin-top: 26px;
  }
`

const DateI = styled(Flex)<{b?}>`
  height: 36px;
  flex-direction: column;
  justify-content: space-around;
  ${({ theme }) => theme.mediaQueries.md} {
    border-left: ${({b}) => b ? '1px solid rgba(17, 13, 50, 1)' : ''};
    border-right: ${({b}) => b ? '1px solid rgba(17, 13, 50, 1)' : ''};
    height: 56px;
  }
  span.d{
    font-size: 16px;
    font-weight: bold;
    color: #FFFFFF;
    line-height: 15px;
    letter-spacing: -0.5px;
    ${({ theme }) => theme.mediaQueries.md} {
      font-size: 22px;
    }
  }
  span.t{
    font-size: 12px;
    font-weight: 500;
    color: #A9A8FF;
    margin-top: 4px;
    text-align: center;
    ${({ theme }) => theme.mediaQueries.md} {
      line-height: 22px;
      font-size: 16px;
    }
  }
`
const Dis = styled.div<{ d? }>`
  display: ${({ d }) => (d ? "none" : "block")};
  ${({ theme }) => theme.mediaQueries.md} {
    display: ${({ d }) => (d ? "block" : "none")};
    height: 100%;
  }
`;

const Img = styled.img`
  width: 375px;
  min-width: 375px;
`

const date = props => {
  const { t } = useTranslation();
  const DateA:{d?;t?;}[] = [{
    d: '04.20 - 04.30',
    t: t('tradingCompetition4')
  },{
    d: '04.20 - 04.30',
    t: t('tradingCompetition5')
  },{
    d: '04.24 - 04.30',
    t: t('tradingCompetition6')
  }] 
  return <Date>
    <T>{t('tradingCompetition3')}</T>
    <DateT>04.20 - 04.30</DateT>
    <DateWarp>
      <DateWarpInner>
        {
          DateA.map((e, i) => {
            return <DateI key={i} b={i===1}>
              <span className="d">{e.d}</span>
              <span className="t">{e.t}</span>
            </DateI>
          })
        }
      </DateWarpInner>
    </DateWarp>
    <Dis d={0} mt='24px'>
      <Img src="/images/tradingCompetition/B.png" alt="" />
    </Dis>
  </Date>
}

export default date