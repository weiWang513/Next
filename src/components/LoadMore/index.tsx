import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";

const Warp = styled.div`
  width: 100%;
  height: 24px;
  margin-top: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  & > div {
    height: 24px;
    padding: 0 16px;
    background: #1F1830;
    border-radius: 12px;
    font-weight: 500;
    color: #FFFFFF;
    text-align: center;
    font-size: 12px;
    line-height: 24px;
    &.btn {
      cursor: pointer;
    }
  }
  & > span {
    font-size: 14px;
    font-weight: 600;
    color: #615976;
    line-height: 20px;
  }
`

const LoadMore = ({
  isLast,
  loading,
  nextPage
}) => {
  const { t } = useTranslation()
  return (
    <Warp>
      {loading
        ? <div>{t("Loading")}</div>
        : <>
          {!isLast ? <div className="btn" onClick={nextPage}>{t("ClickLoad")}</div> : <span>{t("LoadFinish")}</span>}
        </>
      }
      
    </Warp>
  )
}

export default LoadMore