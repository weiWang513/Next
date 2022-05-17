import React from "react";
import styled from "styled-components";
import { ReactComponent as RightArr } from "/public/images/SVG/right_a_n.svg";
import { Flex, Dropdown } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const LoginRegister = styled.div`
  padding: 0 16px 8px 24px;
  width: 100%;
  z-index: 10;
`

const L = styled(Flex)`
  justify-content: space-between;
  span {
    font-size: 24px;
    font-weight: 600;
    color: #220A60;
    line-height: 33px;
  }
`

const Tip = styled.div`
  font-size: 14px;
  font-family: DINPro-Bold, DINPro;
  font-weight: bold;
  color: #AAA4BB;
  line-height: 17px;
  margin-top: 10px;
`

const loginRegister = props => {
  const { t } = useTranslation();
  const { push } = useRouter();
  return <LoginRegister onClick={() => push('/login')}>
    <L>
      <span>{t('LoginRegister')}</span>
      <RightArr />
    </L>
    <Tip>{t('Welcome')}</Tip>
  </LoginRegister>
}

export default loginRegister