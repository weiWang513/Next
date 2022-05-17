import React, { useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { ReactComponent as ArrowD } from "/public/images/SVG/arrow-d-g.svg";
import { ReactComponent as SelectT } from "/public/images/SVG/select.svg";
import { ReactComponent as Ic } from "/public/images/SVG/Language_s.svg";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { useRouter } from "next/router";
import { setLocale } from "../../../store/modules/appSlice";
import { setInjectInfo } from "../../../functions/info";
import { updateUserLanguage } from "../../../services/api/user";
import { useTranslation } from "next-i18next";

const ContractTrade = styled.div``

const T = styled(Flex)`
  padding: 0 16px;
  height: 56px;
  span{
    flex: 1;
    padding-left: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #220A60;
    line-height: 22px;
  }

  span.indexed{
    font-size: 14px;
    font-weight: 500;
    color: #AAA4BB;
    line-height: 20px;
  }
`

const Select = styled.div<{op?}>`
  transition: transform 0.15s, opacity 0.15s, height 0.15s;
  transform: ${({op}) => `scaleY(${op})`};
  transform-origin: top;
  opacity: ${({op}) => op || 0};
  height: ${({op}) => op ? '176px' : 0}
`

const SelectItem = styled(Flex)<{c?}>`
  height: 44px;
  background: #F5F3FB;
  padding: 0 20px 0 56px;
  font-size: 14px;
  justify-content: space-between;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: ${({c}) => c || '#807898'};
  line-height: 44px;
`

const ArrowDT = styled(ArrowD)<{op?}>`
  transition: all 0.15s;
  transform: ${({op}) => `rotate(${op ? '180deg' : 0 })`};
`

const SelectLanguage = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const contractTrade = props => {
  const { t } = useTranslation();

  let { pathname, asPath, replace } = useRouter();

  const dispatch = useAppDispatch();

  const [f, setF] = useState(false)

  const userHabit = useAppSelector((state) => state.app.userHabit);
  const isLogin = useAppSelector((state) => state.app.isLogin);


  interface Language {
    key: string;
    value: string;
  }
  const languageA: Language[] = [
    {
      key: "English",
      value: "en_US"
    },
    {
      key: "한국어",
      value: "ko_KR"
    },
    {
      key: "繁體中文",
      value: "zh_TW"
    },
    {
      key: "简体中文",
      value: "zh_CN"
    }
  ];

  const getLanguage = (): string => {
    return languageA.find((el) => el?.value === userHabit?.locale)?.key || "English";
  };

  const changeLanguage = (v: Language): void => {
    dispatch(setLocale(v.value));
    setInjectInfo("locale", v.value);
    // i18n.changeLanguage(v.value);
    isLogin && updateUserLanguage({ locale: v.value || "en_US" });

    replace(pathname, asPath, { locale: v.value });
  };

  return <ContractTrade>
    <T  onClick={() => setF(!f)}>
      <Ic />
      
      <span>{t('ChangeLocale')}</span>
      <SelectLanguage>
        <span className="indexed">{getLanguage()}</span>
        <ArrowDT op={f ? 1 : 0} />
      </SelectLanguage>
    </T>
    <Select op={f ? 1 : 0}>
      {
        languageA.map((e, i) => {
          return <SelectItem 
            key={i} 
            c={e?.value === userHabit?.locale ? '#6126FC' : ''}
            onClick={() => {
              changeLanguage(e);
            }}
          >
            {e.key} {e?.value === userHabit?.locale && <SelectT />}
          </SelectItem>
        })
      }
    </Select>
  </ContractTrade>
}

export default contractTrade