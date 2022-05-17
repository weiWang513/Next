import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Head from "next/head";
import HomeHeader from "../../components/HomeHeader";
import LoginFooter from "../../components/LoginFooter";
import { selectUserHabit } from "../../store/modules/appSlice";
import { useAppSelector } from "../../store/hook";
import useInit from "../../hooks/useInit";
import { getInjectInfo } from "../../functions/info";
import { hostReplace } from "../../utils/utils";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

const PageContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  min-height: 700px;
  padding-bottom: 64px;
`;

const IframeContainer = styled.iframe`
  width: 100%;
  height: 100vh;
`;

const ContractMarket = () => {
  const [locale, setLocale] = useState("");
  const userHabit = useAppSelector(selectUserHabit);
  const { init } = useInit();

  const { t } = useTranslation();
  const { asPath } = useRouter();

  useEffect(() => {
    const locale = getInjectInfo("locale") || "en_US";
    setLocale(locale);
    init();
  }, []);

  useEffect(() => {
    locale !== "" && setLocale(userHabit?.locale);
  }, [userHabit]);

  return (
    <>
      <Head>
        <title>{t("ContractInfo")}</title>

        {/* og */}
        <meta property="og:locale" content={userHabit.locale} />
        <meta property="og:url" content={`https://ccfox.com/${locale}${asPath}`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("homePageTitleContent")} />
        <meta property="og:description" content={t("seoDescription")} />
        <meta property="og:sitename" content="CCFOX" />
        <meta
          property="og:image"
          content="https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/Banner/ccfox-logo.jpg"
        />

        {/* twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content={t("homePageTitleContent")} />
        <meta property="twitter:site" content="CCFOX" />
        <meta property="twitter:description" content={t("seoDescription")} />
        <meta
          name="twitter:image"
          content="https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/Banner/ccfox-logo.jpg"
        />
        <meta name="twitter:label1" content={t("seoEstReadTime")} />
        <meta name="twitter:data1" content={t("seoEstTime")} />
      </Head>
      <PageContainer>
        <HomeHeader bgColor={"rgba(19, 15, 29, 1)"} />
        {locale !== "" && (
          <IframeContainer
            src={`https://${hostReplace()}/contractMarket?locale=${locale || "en_US"}`}
          ></IframeContainer>
        )}

        <LoginFooter />
      </PageContainer>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});

export default ContractMarket;
