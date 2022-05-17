import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex} from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";

const Title = styled(Flex)`
  flex-direction: column;
  margin-top: 100px;
  text-align: center;
  img{
    display:block;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    text-align: left;
    align-items: flex-start;
    margin-top: 243px;
    img{
      display:none;
    }
  }
  .l{
    font-size: 32px;
    font-weight: 600;
    color: #FFFFFF;
    line-height: 36px;
    margin-top: 24px;
  }
  .m{
    font-size: 14px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 20px;
    margin-top: 12px;
  }
`

const Logo = styled.div`
  width: 72px;
  height: 72px;
  background: #FFFFFF;
  border-radius: 14px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`

const title = props => {
  const { t } = useTranslation();
  return <Title>
    <img src="/images/download/logo.png" width="72px" height="72px" alt="" />
    <h1 className="l">{t('DownloadPage')}</h1>
    <p className="m">{t('DownloadPage1')}</p>
  </Title>
}

export default title