import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../store/hook";

const Tabs = styled(Flex)`
  // flex-direction: column;
  flex: 1;
  align-items: flex-start;
`

const TabsItem = styled.div<{bgColor?;top?;}>`
  display: flex;
  align-items: center;
  margin-right: 16px;
  flex-direction: column;
  // background: ${({ bgColor, top }) => bgColor ? bgColor : `rgba(19, 15, 29, ${top / 760})`};
  color: ${({ color }) => color};
  font-size: 14px;
  font-weight: 600;
  line-height: 37px;
  // width: 20px;
  overflow: visible;
  cursor: pointer;
  &:nth-child(4){
    margin-left: 33px;
  }
`
const Line = styled.div`
  width: 20px;
  border-bottom: 3px solid #6F5AFF;
`

const posiHeader = props => {
  const curOrder = useAppSelector(state => state.spot.curOrder)
  const { t } = useTranslation()
  
  const tabList = [{
      tab: t("OpenOrders"), // '当前委托'
      n: curOrder.length
    },{
      tab: t("HistoryOrder"), // '历史委托'
    },{
      tab: t("MatchRecord"), // '成交记录'
    }
  ]
  return (
    <Tabs>
      {
        tabList.map((e, i) => {
          return (
            <TabsItem key={i} color={props.tabIndex === i ? `#6F5AFF` : '#615976' } onClick={() => props.setTabIndex(i)}>
              <span>{e.tab}{e.n ? `[${e.n}]` : ''}</span>
              {props.tabIndex === i && <Line />}
            </TabsItem>
          )
        })
      }
    </Tabs>
  )
}

export default posiHeader