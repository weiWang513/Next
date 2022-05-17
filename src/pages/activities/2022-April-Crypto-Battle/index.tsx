import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import HomeHeader from "../../../components/HomeHeader";
import Logo from '../../../features/tradingCompetition/logo'
import Date from '../../../features/tradingCompetition/date'
import Step from '../../../features/tradingCompetition/step'
import RulerARisks from '../../../features/tradingCompetition/rulerARisks'
import Sign from '../../../features/tradingCompetition/Sign'
import { useRouter } from "next/router";
import { getInjectInfo } from "../../../utils/common";
import { i18n } from "next-i18next";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../store/hook";
import { selectUserHabit } from "../../../store/modules/appSlice";
import useInit from "../../../hooks/useInit";
const TradingCompetition = styled.div`
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  background: url('/images/tradingCompetition/BG.png') #0B0814;
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 0 240px;
  // background-size: 975px 458px;
  // background-position: -300px 140px;
  padding-top: 56px;
  padding-bottom: 104px;
  font-family: DINPro-Medium, DINPro;
  ${({ theme }) => theme.mediaQueries.md} {
    background-size: 2202px 1026px;
    padding-top: 160px;
    margin-top: -56px;
    padding-bottom: 104px;
    background-position: top center;
  }
`

const tradingCompetition = props => {
  const { init } = useInit();
  const router = useRouter();
  const userHabit = useAppSelector(selectUserHabit);
  const { asPath, locale } = useRouter();
  const [device, setDevice] = useState('pc')
  const { t } = useTranslation();
  useEffect(() => {
    location.search?.slice(1)?.split('&')?.map(e => {
      let _a = e?.split('=')
      console.log('first', _a?.[0])
      if (_a?.[0] === 'device') {
        setDevice(_a[1])
      }
    })
    init();
  }, [])

  return <>
    <Head>
      <title>{t('tradingCompetitionHeadTitle')}</title>
      <meta
        key="description"
        name="description"
        content={t(`tradingCompetitionHeadMeta`)}
      />
      {/* og */}
      <meta property="og:locale" content={userHabit.locale} />
      <meta property="og:url" content={`https://ccfox.com/${locale}${asPath}`} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={t("tradingCompetitionHeadTitle")} />
      <meta property="og:description" content={t("tradingCompetitionHeadMeta")} />
      <meta property="og:sitename" content="CCFOX" />
      <meta
        property="og:image"
        content="https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/logo/2022-April-Crypto-Battle.jpg"
      />

      {/* twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:title" content={t("tradingCompetitionHeadTitle")} />
      <meta property="twitter:site" content="CCFOX" />
      <meta property="twitter:description" content={t("tradingCompetitionHeadMeta")} />
      <meta
        name="twitter:image"
        content="https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/logo/2022-April-Crypto-Battle.jpg"
      />
      <meta name="twitter:label1" content={t("seoEstReadTime")} />
      <meta name="twitter:data1" content={t("seoEstTime")} />
      <script type="text/javascript" src="/charting_library/charting_library.min.js"></script>
    </Head>
    <TradingCompetition>
      {device === 'pc' && <HomeHeader />}
      <Logo />
      <Date />
      <Step />
      <RulerARisks />
      <Sign />
    </TradingCompetition>
  </> 
}

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});

export default tradingCompetition;