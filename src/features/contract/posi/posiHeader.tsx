import React, { useEffect } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { useAppSelector, useAppDispatch } from "../../../store/hook";
import { resetData } from "../../../store/modules/assetsSlice";

const Tabs = styled(Flex)`
  // flex-direction: column;
  flex: 1;
  align-items: flex-start;
`;

const TabsItem = styled.div<{ bgColor?; top? }>`
  display: flex;
  align-items: center;
  margin-right: 16px;
  flex-direction: column;
  // background: ${({ bgColor, top }) => (bgColor ? bgColor : `rgba(19, 15, 29, ${top / 760})`)};
  color: ${({ color }) => color};
  font-size: 14px;
  font-weight: 600;
  line-height: 37px;
  // width: 20px;
  overflow: visible;
  cursor: pointer;
  &:nth-child(4) {
    margin-left: 33px;
  }
`;
const Line = styled.div`
  width: 20px;
  border-bottom: 3px solid #6f5aff;
`;

const posiHeader = (props) => {
  const posListProps = useAppSelector((state) => state.assets.posListProps);
  const curDelegateInfo = useAppSelector((state) => state.assets.curDelegateInfo);
  const conditionOrders = useAppSelector((state) => state.assets.conditionOrders);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const tabList = [
    {
      tab: t("HoldingPosition"), // '当前持仓'
      n: posListProps?.length
    },
    {
      tab: t("OpenOrders"), // '当前委托'
      n: curDelegateInfo?.list?.length
    },
    {
      tab: t("ConditionalOrders"), // '条件委托'
      n: conditionOrders?.length
    },
    {
      tab: t("MarketTrades") // '最新成交'
    },
    {
      tab: t("CommonHisOrder") // '普通历史委托'
    },
    {
      tab: t("ConHisOrder") // '  条件历史委托'
    },
    {
      tab: t("BoomRecord1") // '强平历史'
    },
    {
      tab: t("BoomRecord2") // '强减历史'
    },
    {
      tab: t("CashflowRecord") // '流水记录'
    }
  ];

  useEffect(() => {
    !isLogin && dispatch(resetData());
  }, [isLogin]);

  return (
    <Tabs>
      {tabList.map((e, i) => {
        return (
          <TabsItem
            key={i}
            color={props.tabIndex === i ? `#6F5AFF` : "#615976"}
            onClick={() => props.setTabIndex(i)}
          >
            <span>
              {e.tab}
              {e.n ? `[${e.n}]` : ""}
            </span>
            {props.tabIndex === i && <Line />}
          </TabsItem>
        );
      })}
    </Tabs>
  );
};

export default posiHeader;
