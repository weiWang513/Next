import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { ReactComponent as NodataDark } from "/public/images/SVG/nodataDark.svg";

const Warp = styled.div`
  width: 100%;
  padding-top: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  & > span {
    margin-top: 24px;
    font-size: 12px;
    font-weight: 500;
    color: #3F3755;
    line-height: 18px;
  }
`

const NoData = () => {
  const { t } = useTranslation()
  return (
    <Warp>
      <NodataDark />
      <span>{t("NoData")}</span>
    </Warp>
  )
}

export default NoData