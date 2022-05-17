import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Box } from "@ccfoxweb/uikit";
import HomeHeader from "../../../components/HomeHeader";
import HomeFooter from "../../../components/HomeFooter";
import FAQ from "../../../features/fm/faq";
import TopWrap from "../../../features/fm/topWrap";
import ListWrap from "../../../features/fm/list";
import useInit from "../../../hooks/useInit";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../store/hook";
import { useRouter } from "next/router";

const RegularPageContainer = styled.div`
  width: 100%;
  overflow: hidden;
  background: #f5f3fb;
`;

const TopBgWrap = styled.div`
  background: linear-gradient(
    116deg,
    rgba(184, 230, 255, 0.45) 0%,
    rgba(209, 231, 255, 0.63) 47%,
    rgba(223, 200, 255, 0.72) 100%
  );
  height: 733px;
  width: 100%;
  opacity: 0.4;
  filter: blur(50px);
  z-index: 0;
  position: relative;
`;

const Content = styled.div`
  width: 100%;
  min-width: 375px;
  margin-top: -650px;
  // z-index: 2;
  position: relative;
  padding: 0px 5px;
  box-sizing: border-box;

  ${({ theme }) => theme.mediaQueries.md} {
    width: 1200px;
    margin: 0 auto;
    margin-top: -600px;
    padding: 0;
  }
`;

const RegularPage = () => {
  const { init } = useInit();

  const [reloadR, setReloadR] = useState(0);

  const { t } = useTranslation();

  const userHabit = useAppSelector((state) => state.app.userHabit);

  const { asPath, locale } = useRouter();

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <Head>
        <title>{t("fmTitle")}</title>
        <meta key="description" name="description" content={t("fmDescription")} />

        {/* og */}
        <meta property="og:locale" content={userHabit.locale} />
        <meta property="og:url" content={`https://ccfox.com/${locale}${asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("fmTitle")} />
        <meta property="og:description" content={t("fmDescription")} />
        <meta property="og:sitename" content="CCFOX" />
        <meta
          property="og:image"
          content="https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/Banner/ccfox-logo.jpg"
        />

        {/* twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={t("fmTitle")} />
        <meta property="twitter:site" content="CCFOX" />
        <meta property="twitter:description" content={t("fmDescription")} />
        <meta
          name="twitter:image"
          content="https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/Banner/ccfox-logo.jpg"
        />
        <meta name="twitter:label1" content={t("seoEstReadTime")} />
        <meta name="twitter:data1" content={t("seoEstTime")} />
      </Head>
      <RegularPageContainer>
        <HomeHeader bgColor={"#130F1D"} />
        <TopBgWrap />
        <Content>
          <TopWrap reloadR={reloadR} />
          <ListWrap setReloadR={(v) => setReloadR(v)} />
          <FAQ agent={"web"} />
        </Content>
        <Box height={"100px"} />
        <HomeFooter />
      </RegularPageContainer>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});
export default RegularPage;
