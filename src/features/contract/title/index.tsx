import React from "react";
import { useAppSelector } from "../../../store/hook";
import { useTranslation } from "next-i18next";
import Head from "next/head";
import { formatByPriceTick } from "../../../utils/filters";
import { useRouter } from "next/router";

const Title = () => {
  const futureQuot = useAppSelector((state) => state.contract.snapshot);
  const contractItem = useAppSelector((state) => state.contract.contractItem);
  const userHabit = useAppSelector((state) => state.app.userHabit);

  const { t } = useTranslation(["contractTitle"]);

  const { asPath, locale } = useRouter();

  return (
    <Head>
      <title>
        {`${formatByPriceTick(futureQuot?.lastPrice) || "--"} ${contractItem?.symbol || "--"} | ${t(
          `title-${contractItem?.symbol}`
        )}`}
      </title>
      <meta
        key="description"
        name="description"
        content={t(`description-${contractItem?.symbol}`)}
      />
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
      <script type="text/javascript" src="/charting_library/charting_library.min.js"></script>
    </Head>
  );
};

export default Title;
