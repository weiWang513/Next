import React, { useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { ReactComponent as ArrowD } from "/public/images/SVG/arrow-d-g.svg";
import { ReactComponent as SelectT } from "/public/images/SVG/select.svg";
import { ReactComponent as Ic } from "/public/images/SVG/coin.svg";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { setCurrency } from "../../../store/modules/appSlice";
import { setInjectInfo } from "../../../functions/info";
import { useTranslation } from "next-i18next";
import { updateUserHabit } from "../../../services/api/user";

const FaitCurrency = styled.div``

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
  height: ${({op}) => op ? '306px' : 0}
`

const SelectItem = styled(Flex)<{c?}>`
  height: 44px;
  background: #F5F3FB;
  padding: 0 20px 0 24px;
  font-size: 14px;
  justify-content: space-between;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: ${({c}) => c || '#807898'};
  line-height: 44px;
`
const CurrencyW = styled(Flex)`
  span.symbol{
    margin-right: 24px;
  }
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

const faitCurrency = props => {
  const { t } = useTranslation();
  const [f, setF] = useState(false)

  const userHabit = useAppSelector((state) => state.app.userHabit);

  interface exchange {
    key: string;
    value: number;
    symbol: string;
  }

  const exchangeList: exchange[] = [
    {
      key: "USD",
      value: 1,
      symbol: "$"
    },
    {
      key: "EUR",
      value: 2,
      symbol: "€"
    },
    {
      key: "JPY",
      value: 3,
      symbol: "¥"
    },
    {
      key: "GBP",
      value: 4,
      symbol: "£"
    },
    {
      key: "CNY",
      value: 6,
      symbol: "¥"
    },
    {
      key: "KRW",
      value: 7,
      symbol: "₩"
    },
    {
      key: "INR",
      value: 8,
      symbol: "₹"
    }
  ];

  const dispatch = useAppDispatch();

  const isLogin = useAppSelector((state) => state.app.isLogin);

  const getExchangeS = (): string => {
    return exchangeList.find((el) => el?.key === userHabit?.currency)?.key || "USD";
  };

  const changeExchangeId = (v: exchange): void => {
    dispatch(setCurrency(v.key));
    setInjectInfo("currency", v.key);
    let qs = {
      habits: [{ habitCode: 1003, habitValue: v.key }]
    }
    isLogin && updateUserHabit(qs).then(res => {
    })
  };

  return <FaitCurrency>
    <T  onClick={() => setF(!f)}>
      <Ic />
      
      <span>{t('ChangeCurrency')}</span>
      <SelectLanguage>
        <span className="indexed">{getExchangeS()}</span>
        <ArrowDT op={f ? 1 : 0} />
      </SelectLanguage>
    </T>
    <Select op={f ? 1 : 0}>
      {
        exchangeList.map((e, i) => {
          return <SelectItem 
            key={i} 
            c={e?.key === userHabit?.currency ? '#6126FC' : ''}
            onClick={() => {
              changeExchangeId(e);
            }}
          >
            <CurrencyW>
              <span className="symbol">{e.symbol}</span>{e.key}
            </CurrencyW>
            {e?.key === userHabit?.currency && <SelectT />}
          </SelectItem>
        })
      }
    </Select>
  </FaitCurrency>
}

export default faitCurrency