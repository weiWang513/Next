import { FC, useRef } from "react";
import styled from "styled-components";
import { ReactComponent as Select } from "/public/images/SVG/select.svg";
import { useAppSelector, useAppDispatch } from "../../../store/hook";
import { LANG_DICT } from "../../../contants";
import { setLocale } from "../../../store/modules/appSlice";
import { setInjectInfo } from "../../../functions/info";
import { useRouter } from "next/router";

const LanguageWrap = styled.ul`
  width: 152px;
  color: #ffffff;
  background: #1f1830;
  border-radius: 8px;
  overflow: hidden;
`;

const LanguageEle = styled.li`
  display: flex;
  align-items: center;
  height: 40px;
  width: 152px;
  padding: 0 24px;
  cursor: pointer;
  &:hover {
    color: #6f5aff;
    background: #000000;
  }
  div.text {
    flex: 1;
  }
`;

const LanguageItem: FC<Language> = (langItem) => {
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const dispatch = useAppDispatch();
  let { pathname, asPath, replace } = useRouter();

  const changeLanguage = (v: Language): void => {
    // dropRef.current.close();
    dispatch(setLocale(v.value));
    setInjectInfo("locale", v.value);
    replace(pathname, asPath, { locale: v.value });
  };

  return (
    <LanguageEle onClick={() => changeLanguage(langItem)}>
      <div className="text">{langItem.id}</div>
      {userHabit?.locale === langItem.value && <Select />}
    </LanguageEle>
  );
};

const LanguageSelector: FC = () => {
  return (
    <LanguageWrap>
      {LANG_DICT.map((langItem: Language) => {
        return <LanguageItem key={langItem.value} {...langItem} />;
      })}
    </LanguageWrap>
  );
};

export default LanguageSelector;
