import React, { useRef } from "react";
import styled from "styled-components";
import { Flex, Dropdown } from "@ccfoxweb/uikit";
import { useAppSelector, useAppDispatch } from "../../store/hook";
import { ReactComponent as Select } from "/public/images/SVG/select.svg";
import { ReactComponent as Locale } from "/public/images/SVG/locale.svg";
import { ReactComponent as Currency } from "/public/images/SVG/currency.svg";
import { ReactComponent as ArrowBottom } from "/public/images/SVG/arrow-bottom.svg";
import { setInjectInfo } from "../../functions/info";
import { useTranslation } from "next-i18next";
import { setLocale, setCurrency } from "../../store/modules/appSlice";
import { updateUserHabit, updateUserLanguage } from "../../services/api/user";
import { useRouter } from "next/router";

const LangWarp = styled.div`
  // width: 153px;
  height: 56px;
  padding: 0 16px;
  // margin-left: 16px;
  display: flex;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  &:hover {
    // background: #1f1830;
    span {
      font-size: 16px;
      font-weight: 500;
      color: #6f5aff;
    }
  }
  span {
    font-size: 16px;
    font-weight: 500;
    color: #ffffff;
  }
  i {
    width: 16px;
    height: 16px;
    margin-left: 8px;
  }

  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: inline-flex;
  }
`;

const DropPadding = styled.div`
  padding-top: 4px;
`;
const DropdownMain = styled.div`
  width: 305px;
  background: #1f1830;
  // position: absolute;
  // right: 0;
  // top: 0;
  border-radius: 8px;
  box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;
const DropdownMainHeader = styled(Flex)`
  height: 52px;
  border-bottom: 1px solid #2e2643;
`;
const DropdownMainHeaderItem = styled(Flex)`
  flex: 0 0 152px;
  align-items: center;
  padding-left: 24px;
  span {
    margin-top: -1px;
    font-size: 14px;
    font-weight: 500;
    color: #665f7a;
  }
`;
const ListArea = styled(Flex)`
  align-items: flex-start;
`;

const LanguageList = styled(Flex)`
  flex: 0 0 152px;
  flex-direction: column;
  justify-content: flex-start;
`;

const ExchangeList = styled(Flex)`
  flex: 0 0 152px;
  flex-direction: column;
  justify-content: flex-start;
  border-left: 1px solid #2e2643;
`;

const ListItem = styled(Flex)`
  width: 100%;
  height: 40px;
  padding: 0 24px;
  justify-content: space-between;
  cursor: pointer;
  span {
    font-size: 14px;
    font-weight: 900;
    color: #ffffff;
    line-height: 20px;
  }
  .selected {
    color: #14af81;
  }
  &:hover {
    background: #130f1d;
    span {
      color: #20A3B5;
    }
  }
`;

const ExcahngeSymbol = styled.div`
  margin-right: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #665f7a;
  line-height: 18px;
  display: inline-block;
`;

const IndexedIcon = styled.span`
  color: #14af81;
`;
const targetHoverStyle = `
  // background: #1F1830;
  // span{
  //   color: #20A3B5;
  // }

  span {
    font-size: 16px;
    font-weight: 500;
    color: #20A3B5;
  }
  path {
    fill: #20A3B5;
  }
`;

const LanguageExchangeSelect = () => {
  interface Language {
    key: string;
    value: string;
  }
  interface exchange {
    key: string;
    value: number;
    symbol: string;
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
  let { pathname, asPath, replace } = useRouter();
  const { t } = useTranslation();

  const dropRef = useRef(null);

  // const exchangeList = useAppSelector(state => state.contract.contractList)
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const dispatch = useAppDispatch();

  const getLanguage = (): string => {
    return languageA.find((el) => el?.value === userHabit?.locale)?.key || "English";
  };
  const getExchangeS = (): string => {
    return exchangeList.find((el) => el?.key === userHabit?.currency)?.key || "USD";
  };
  const dropdownTarget = (): any => {
    return (
      <LangWarp>
        <span>
          {getLanguage()}/{getExchangeS()}
        </span>
        <i>
          <ArrowBottom />
        </i>
      </LangWarp>
    );
  };
  const changeLanguage = (v: Language): void => {
    dispatch(setLocale(v.value));
    setInjectInfo("locale", v.value);
    // i18n.changeLanguage(v.value);
    isLogin && updateUserLanguage({ locale: v.value || "en_US" });

    replace(pathname, asPath, { locale: v.value });
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

  return (
    <>
      <Dropdown
        position="bottom-right"
        target={dropdownTarget()}
        targetHoverStyle={targetHoverStyle}
        ref={dropRef}
      >
        <DropPadding>
          <DropdownMain>
            <DropdownMainHeader>
              <DropdownMainHeaderItem>
                <Locale />
                <span>{t("ChangeLocale")}</span>
              </DropdownMainHeaderItem>
              <DropdownMainHeaderItem>
                <Currency />
                <span>{t("ChangeCurrency")}</span>
              </DropdownMainHeaderItem>
            </DropdownMainHeader>
            <ListArea>
              <LanguageList>
                {languageA.map((language) => {
                  return (
                    <ListItem
                      key={language.value}
                      onClick={() => {
                        changeLanguage(language);
                        dropRef.current.close();
                      }}
                    >
                      <span>{language.key}</span>
                      {userHabit?.locale === language.value && <Select />}
                    </ListItem>
                  );
                })}
              </LanguageList>
              <ExchangeList>
                {exchangeList.map((excahnge) => {
                  return (
                    <ListItem
                      key={excahnge.value}
                      onClick={() => {
                        changeExchangeId(excahnge);
                        dropRef.current.close();
                      }}
                    >
                      <span>
                        <ExcahngeSymbol>{excahnge.symbol}</ExcahngeSymbol>
                        <span>{excahnge.key}</span>
                      </span>
                      {userHabit?.currency === excahnge.key && <Select />}
                    </ListItem>
                  );
                })}
              </ExchangeList>
            </ListArea>
          </DropdownMain>
        </DropPadding>
      </Dropdown>
    </>
  );
};

export default LanguageExchangeSelect;
