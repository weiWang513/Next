import React from "react";
import Head from "next/head";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/hook";
import { useRouter } from "next/router";

const AppHead = () => {
  const { t } = useTranslation();
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const { asPath, locale } = useRouter();

  return (
    <Head>
      <meta charSet="utf-8" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta
        name="viewport"
        content="width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
      />

      <link rel="canonical" href={`https://ccfox.com/${locale}${asPath}`} />
      <meta name="robot" content="all" />

    </Head>
  );
};

export default AppHead;
