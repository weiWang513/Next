import { FC, useRef } from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../store/hook";
import { DEFAULT_LANG, LANG_DICT } from "../../../contants";
import { Flex, Dropdown } from "@ccfoxweb/uikit";
import LanguageSelector from "./LanguageSelector";
import { ReactComponent as ArrowBottom } from "/public/images/SVG/arrow-bottom.svg";

const Container = styled(Flex)`
  height: 56px;
  font-size: 16px;
  font-weight: 500;
  color: #ffffff;
  line-height: 22px;
  cursor: pointer;
`;

const DropdownBtn = styled.span`
  margin-left: 8px;
`;

const CurrentLanguage: FC = () => {
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const currentLang = LANG_DICT.find((el) => el?.value === userHabit?.locale)?.id || DEFAULT_LANG;

  return (
    <Container>
      {currentLang}
      <DropdownBtn>
        <ArrowBottom />
      </DropdownBtn>
    </Container>
  );
};

const Language: FC = () => {
  const dropRef = useRef(null);

  return (
    <Dropdown position="bottom-right" target={<CurrentLanguage />} ref={dropRef}>
      <LanguageSelector />
    </Dropdown>
  );
};

export default Language;
