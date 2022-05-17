import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import FAQ from "../../../features/fm/faq";

const RegularWarp = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #f6f6f6;
`;
const RegularTop = styled.div`
  width: 100%;
  height: 137px;
  background:url(/images/fm/fm-top.png), linear-gradient(to bottom, rgba(106, 69, 255, 0.2), rgba(246, 246, 246, 1));
  background-repeat:no-repeat;
  background-position:right 27%;
  overflow: hidden;
  .fm-back {
    margin: 8px;
    width: 48px;
    height: 48px;
    z-index: 2;
  }
  .fm-top {
    width: 143px;
    height: 192px;
    margin: 90px 20px 0 0;
  }
`;
const RegularTitle = styled.div`
  margin-top:48px;
  margin-left:20px;
  p {
    font-size: 32px;
    color: #0b0814;
    line-height: 39px;
    margin-bottom: 8px;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    color: #857ea1;
    line-height: 20px;
  }
`;
const RegularIntrdust = styled.div`
  width: 90%;
  background: #ffffff;
  border-radius: 12px;
  margin: 0 auto;
  padding: 16px;
  h3 {
    font-size: 16px;
    font-weight: 600;
    color: #0b0814;
    line-height: 22px;
    margin-bottom: 10px;
  }
  span {
    font-size: 14px;
    font-weight: 400;
    color: #7c7788;
    line-height: 24px;
  }
`;

const Regular = () => {
  const { t } = useTranslation();

  return (
    <RegularWarp>
      <RegularTop>
        <div>
          <RegularTitle>
            <p>{t("FmTitle")}</p>
            <span>{t("FmDesc")}</span>
          </RegularTitle>
        </div>
      </RegularTop>
      <RegularIntrdust>
        <h3>{t("FmInstr")}</h3>
        <span>{t("FmInstrDatils")}</span>
      </RegularIntrdust>
      <FAQ />
    </RegularWarp>
  );
};
export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});
export default Regular;
