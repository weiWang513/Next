import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useModal } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import { ReactComponent as Calc } from "/public/images/SVG/calc.svg";
import CalcModal from "./calcModal";

const CalcW = styled.div`
  margin: 0 8px;
  cursor: pointer;
  &:hover{
    path {
      fill: #6f5aff;
    }
  }
`

const CalcI = () => {
  const [openModal] = useModal(<CalcModal />, true, true, 'CalcModal')
  return (
    <CalcW>
      <Calc onClick={() => openModal()}></Calc>
    </CalcW>
  )
}

export default CalcI