import React, { useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { ReactComponent as ArrowD } from "/public/images/SVG/arrow-d-g.svg";
import { ReactComponent as Trade } from "/public/images/SVG/trade.svg";

const ContractTrade = styled.div``

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
`

const Select = styled.div<{op?;h?;}>`
  transition: transform 0.15s, opacity 0.15s, height 0.15s;
  transform: ${({op}) => `scaleY(${op})`};
  transform-origin: top;
  opacity: ${({op}) => op || 0};
  height: ${({op, h}) => op ? h : 0}
`

const SelectItem = styled.div`
  height: 44px;
  background: #F5F3FB;
  padding-left: 56px;
  font-size: 14px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #807898;
  line-height: 44px;
`
const ArrowDT = styled(ArrowD)<{op?}>`
  transition: all 0.15s;
  transform: ${({op}) => `rotate(${op ? '180deg' : 0 })`};
`

const contractTrade = props => {
  const [f, setF] = useState(false)

  return <ContractTrade>
    <T  onClick={() => setF(!f)}>
      {/* <Trade /> */}
      {props.renderIcon()}
      <span>{props.title}</span>
      <ArrowDT op={f ? 1 : 0} />
    </T>
    <Select op={f ? 1 : 0} h={`${props.options.length * 44}px`}>
      {
        props.options.map((e, i) => {
          return <SelectItem onClick={() => e.handel()} key={i}>{e.title}</SelectItem>
        })
      }
    </Select>
  </ContractTrade>
}

export default contractTrade