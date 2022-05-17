import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { Flex, Tooltip, useModal } from "@ccfoxweb/uikit";
import { ReactComponent as AjustMargin } from "/public/images/SVG/ajustMargin.svg";
import { useTranslation } from "next-i18next";
import { toFix6 } from "../../../../utils/filters";
import AjustMarginModal from './ajustMarginModal'
import { useAppSelector } from "../../../../store/hook";
const Big = require('big.js')

const AjustMarginIcon = styled(AjustMargin)`
  cursor: pointer;
`
const PositionN = styled(Flex)`
  flex: 1;
  text-align: left;
  // padding-left: 16px;
  font-size: 12px;
  font-family: DINPro-Medium, DINPro;
  font-weight: 500;
  color: #FFFFFF;
`
const margin = props => {
  const [openAjustMarginModal] = useModal(<AjustMarginModal isPosi={true} posi={props.posi} />, true, true, `AjustMarginModal${props.random}`)
  const contractList = useAppSelector(state => state.contract.allContractList)
  const ajustMargin = () => {
    openAjustMarginModal()
  }
  const contractItem = useRef<{
    contractSide?;
    commodityName?;
    currencyName?;
  }>({})

  useEffect(() => {
    contractItem.current = contractList.find(e=>e.contractId === props.posi.contractId)
  }, [])

  const calcMargin = () => {
    return new Big(props.posi?.initMargin || 0).plus(props.posi?.extraMargin || 0).toString() 
  }
  const _d = contractItem.current?.contractSide === 1 ? 2 : 6
  return (
    <PositionN>{toFix6(calcMargin(), _d) || 0}{props.posi.marginType !== 1 && <AjustMarginIcon onClick={ajustMargin} />}</PositionN>
  )
}

export default margin