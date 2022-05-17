import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex, Button } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";

const Logo = styled(Flex)`
  flex-direction: column;
`

const D = styled.img`
  width: 320px;
  height: 88px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 380px;
    height: 105px;
  }
`

const T = styled.div<{mt?;}>`
  font-size: 20px;
  font-weight: normal;
  color: #FFFFFF;
  line-height: 29px;
  margin-top: ${({ mt }) => mt || 0};
  ${({ theme }) => theme.mediaQueries.md} {
  font-size: 22px;
  line-height: 32px;
  }
`

const LogoImg = styled.img`
  width: 377px;
  height: 210px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 577px;
    height: 321px;
  }
`

const Dis = styled.div<{ d? }>`
  display: ${({ d }) => (d ? "none" : "block")};
  ${({ theme }) => theme.mediaQueries.md} {
    display: ${({ d }) => (d ? "block" : "none")};
    height: 100%;
  }
`;

const logo = props => {
  const { t } = useTranslation();
  return <Logo>
    <Dis d={0}>
      <img src="/images/tradingCompetition/T.png" width="375px" height='91px' alt="" />
    </Dis>
    <T mt='-15px'>{t('tradingCompetition')}</T>
    <D src="/images/tradingCompetition/D.png" alt="" />
      <T>{t('tradingCompetition1')}</T>
    <LogoImg src="/images/tradingCompetition/logo.png" alt="" />
  </Logo>
}

export default logo