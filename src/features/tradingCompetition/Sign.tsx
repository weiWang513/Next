import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex, Button } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/hook";

const Sign = styled.div`
  position: fixed;
  left: 0;
  bottom: 0;
  right: 0;
  height: 104px;
  z-index: 3;
`

const Btn = styled.div`
  width: 327px;
  height: 56px;
  background: #d5af5b;
  box-shadow: 0px 2px 12px 0px rgba(254, 199, 74, 0.39);
  border-radius: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1B0E3A;
  line-height: 56px;
  margin: 14px auto;
  text-align: center;
  cursor: pointer;
  &:hover{
    background: rgba(254, 199, 74, 1);
  }
`

const sign = props => {
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const { t } = useTranslation();
  
  const signF = () => {
    let _link = ''
    switch (userHabit?.locale) {
      case 'zh_CN':
        _link = 'https://another.wufoo.com/forms/siia6ul1yr07f1/'
        break;
      case 'zh_TW':
        _link = 'https://another.wufoo.com/forms/zyjn2gz0d6twoz/'
        break;
      case 'en_US':
        _link = 'https://another.wufoo.com/forms/k18b3sff0ddncvs/'
        break;
      case 'ko_KR':
        _link = 'https://another.wufoo.com/forms/z8ky3wm14q4k2m/'
        break;
    
      default:
        _link = 'https://another.wufoo.com/forms/k18b3sff0ddncvs/'
        break;
    }
    let myWindow = window.open(_link);
    myWindow.opener = null;
  }
  
  return <Sign>
    <Btn onClick={signF}>{t('tradingCompetition38')}</Btn>
  </Sign>
}

export default sign