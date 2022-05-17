import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppDispatch } from "../../../store/hook";
import BookTabs from "./bookTabs";
import DeepIndex from "./deepIndex";
const Header = styled(Flex)`
  justify-content: space-between;
  flex: 0 0 40px;
  padding-right: 10px;
`;

const Tabs = styled(Flex)`
  // flex-direction: column;
  flex: 1;
  align-items: flex-start;
`;

const TabsItem = styled(Flex)`
  flex-direction: column;
  // background: ${({ bgColor, top }) =>
    bgColor ? bgColor : `rgba(19, 15, 29, ${top / 760})`};
  color: ${({ tabIndex }) => (!!Number(tabIndex) ? "#615976" : `#6F5AFF`)};
  font-size: 14px;
  font-weight: 600;
  // width: 20px;
  overflow: visible;
  cursor: pointer;
  span {
    line-height: 37px;
    height: 37px;
    display: inline-block;
  }
`;

const Line = styled.div`
  width: 20px;
  border-bottom: 3px solid #6f5aff;
`;

const Deepth = styled(Flex)`
  flex: 1;
  justify-content: flex-end;
`;

const DeepthN = styled(Flex)`
  width: 24px;
  height: 24px;
  background: red;
`;

const Target = styled(Flex)`
  margin-left: 12px;
  // margin-right: 8px;
  min-width: 45px;
  height: 24px;
  span {
    font-size: 12px;
    font-weight: 500;
    color: #ffffff;
    line-height: 15px;
  }
`;
const DeepthPanel = styled(Flex)`
  flex-direction: column;
  align-items: center;
  width: 64px;
  height: 248px;
  background: #130f1d;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.3);
  border-radius: 4px;
  border: 1px solid #3f3755;
`;
const DeepthItem = styled(Flex)`
  flex-direction: row-reverse;
  font-size: 12px;
  font-weight: 500;
  color: ${({ c }) => c || "rgba(97, 89, 118, 1)"};
  line-height: 24px;
  padding: 0 10px;
  cursor: pointer;
  text-align: right;
  &:hover {
    background: rgba(8, 6, 15, 1);
    color: #fff;
  }
`;

const OrderBookHeader = (props) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const changeTabs = (v: Number): void => {
    props.changeTabs(v);
  };

  return (
    <Header>
      <Tabs>
        <TabsItem tabIndex={props.tabIndex} onClick={() => changeTabs(0)}>
          <span>{t("DelegateList")}</span>
          {!props.tabIndex && <Line />}
        </TabsItem>
        <TabsItem
          tabIndex={Number(!props.tabIndex)}
          onClick={() => changeTabs(1)}
        >
          <span>{t("LatestTransaction")}</span>
          {!!props.tabIndex && <Line />}
        </TabsItem>
      </Tabs>
      <Deepth>
        {!props.tabIndex && (
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
