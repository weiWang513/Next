import React, { FC } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";

const Header = styled(Flex)`
  width: 266px;
  height: 40px;
  padding: 0 16px;
`;

const TabItem = styled(Flex)`
  flex-direction: column;
  cursor: pointer;
  align-items: center;
  margin-right: 16px;
  span {
    font-size: 12px;
    font-weight: 600;
    color: #615976;
    overflow: visible;
    white-space: nowrap;
    line-height: 40px;
  }
  span.indexed {
    font-weight: bold;
    color: #6f5aff;
  }
  span.line {
    width: 20px;
    height: 3px;
    background: #6f5aff;
    border-radius: 2px;
  }
`;

interface HeaderProps {
  tabIndex: number;
  setTabIndex: (i: number) => void;
}

type TabItemProps = {
  label: string;
  value: number;
};

const header: FC<HeaderProps> = ({ tabIndex, setTabIndex }) => {
  const { t } = useTranslation();
  const tabs: TabItemProps[] = [
    {
      label: t("Favorites"), // '自选',
      value: 0
    },
    {
      label: "USDT",
      value: 1
    }
  ];
  const changeTabs = (v: number): void => {
    setTabIndex(v);
  };
  return (
    <Header>
      {tabs.map((e: TabItemProps) => {
        return (
          <TabItem onClick={() => changeTabs(e.value)} key={e.value}>
            <span className={tabIndex === e.value ? "indexed" : ""}>{e.label}</span>
            {tabIndex === e.value && <span className="line"></span>}
          </TabItem>
        );
      })}
    </Header>
  );
};

export default header;
