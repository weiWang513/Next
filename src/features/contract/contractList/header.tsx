import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";

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

const header = (props) => {
  const { t } = useTranslation();
  const tabs: { label?: string; value?: number }[] = [
    {
      label: t("Favorites"), // '自选',
      value: 0,
    },
    {
      label: t("UBased"), // 'U本位永续',
      value: 0,
    },
    {
      label: t("CurrencyBased"), // '币本位永续',
      value: 0,
    },
  ];
  // const [tabIndex, setTabIndex] = useState(0)
  const changeTabs = (v: number): void => {
    props.setTabIndex(v);
  };
  return (
    <Header>
      {tabs.map((e, i) => {
        return (
          <TabItem onClick={() => changeTabs(i)} key={i}>
            <span className={props.tabIndex === i ? "indexed" : ""}>
              {e.label}
            </span>
            {props.tabIndex === i && <span className="line"></span>}
          </TabItem>
        );
      })}
    </Header>
  );
};

export default header;
