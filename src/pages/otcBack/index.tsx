import React, { useEffect } from "react";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useRouter } from "next/router";
import { getInjectInfo } from "../../functions/info";

const OtcBackPage = () => {
  const { replace, asPath } = useRouter();

  useEffect(() => {
    //@ts-ignore
    if (window?.ReactNativeWebView) {
      //@ts-ignore
      window.ReactNativeWebView.postMessage("back");
    } else {
      const storageLocale = getInjectInfo("locale");
      replace("/", '/', { locale: storageLocale || "en_US" });
    }
  }, []);

  return null;
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});

export default OtcBackPage;
