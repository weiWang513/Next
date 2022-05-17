import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import BookTabs from "./bookTabs";
import DeepIndex from "./deepIndex";

const Header = styled(Flex)`
  justify-content: space-between;
  padding: 0 10px 0 16px;
`;

const Tabs = styled(Flex)`
  flex: 1;
  align-items: flex-start;
`;

const TabsItem = styled(Flex)`
  flex-direction: column;
  color: ${({ tabIndex }) => (!!Number(tabIndex) ? "#615976" : `#6F5AFF`)};
  font-size: 14px;
  font-weight: 600;
  overflow: visible;
  cursor: pointer;
  text-align: left;
  align-items: ${({ alignItems }) => alignItems || "center"};
  span {
    line-height: 37px;
    height: 37px;
    display: inline-block;
  }
`;

const Line = styled.div`
  align-self: center;
  width: 20px;
  border-bottom: 3px solid #6f5aff;
`;

const Deepth = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
`;

interface OrderBookHeaderProps {
  tabIndex: number;
  changeTabs: (v: number) => void;
  disableOrderBook?: boolean;
  disableTick?: boolean;
}

const OrderBookHeader = ({
  tabIndex,
  changeTabs,
  disableOrderBook,
  disableTick
}: OrderBookHeaderProps) => {
  const { t } = useTranslation();

  if (disableOrderBook) {
    return (
      <Header>
        <Tabs>
          <TabsItem tabIndex={0} alignItems="flex-start">
            <span>{t("LatestTransaction")}</span>
          </TabsItem>
        </Tabs>
      </Header>
    );
  }

  if (disableTick) {
    return (
      <Header>
        <Tabs>
          <TabsItem tabIndex={0} alignItems="flex-start">
            <span>{t("DelegateList")}</span>
          </TabsItem>
        </Tabs>
        <Deepth>
          <>
            <BookTabs />
            <DeepIndex />
          </>
        </Deepth>
      </Header>
    );
  }

  return (
    <Header>
      <Tabs>
        <TabsItem tabIndex={tabIndex} onClick={() => changeTabs(0)}>
          <span>{t("DelegateList")}</span>
          {!tabIndex && <Line />}
        </TabsItem>
        <TabsItem tabIndex={Number(!tabIndex)} onClick={() => changeTabs(1)}>
          <span>{t("LatestTransaction")}</span>
          {!!tabIndex && <Line />}
        </TabsItem>
      </Tabs>
      <Deepth>
        {!tabIndex && (
          <>
            <BookTabs />
            <DeepIndex />
          </>
        )}
      </Deepth>
    </Header>
  );
};

export default OrderBookHeader;
