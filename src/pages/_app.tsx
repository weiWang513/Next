import React, { Fragment, useEffect, useState } from "react";
import "../styles/base.scss";
import { AppProps } from "next/app";
import { Provider } from "react-redux";
import { appWithTranslation } from "next-i18next";
import store from "../store/store";
import {
  ModalProvider,
  ThemeContextProvider,
  ResetCSS,
  ToastsProvider,
  ToastListener
} from "@ccfoxweb/uikit";
import { useRouter } from "next/router";
import { i18n } from "next-i18next";
import { getInjectInfo } from "../functions/info";

// Import Swiper styles
import "swiper/swiper.min.css";

// import "../i18n";

import AppHead from "../components/Head/AppHead";
import Script from "next/script";

function App({ Component, pageProps }: AppProps) {
  const [localeReady, setLocaleReady] = useState(false);
  const { isReady, locale, defaultLocale, pathname, asPath, replace } = useRouter();

  const getNavigatorLocale = () => {
    try {
      // @ts-ignore
      let tempLocale = navigator?.language || navigator?.userLanguage;
      tempLocale = tempLocale.toLowerCase();
      let navigatorLocale = "";
      if (tempLocale === "zh-cn" || tempLocale === "zh") {
        navigatorLocale = "zh_CN";
      } else if (tempLocale === "zh-tw" || tempLocale === "zh-hk") {
        navigatorLocale = "zh_TW";
      } else if (tempLocale === "ko") {
        navigatorLocale = "ko_KR";
      } else {
        navigatorLocale = "en_US";
      }

      return navigatorLocale;
    } catch (error) {
      return null;
    }
  };

  useEffect(() => {
    // lang
    const storageLocale = getInjectInfo("locale");

    // url > local > browser > default
    // 弃用 getNavigatorLocale() ,app无法传入en_US，会默认根据浏览器语言走
    // let _locale =
    //   locale === defaultLocale ? storageLocale || getNavigatorLocale() || "en_US" : locale;
    let _locale = locale === defaultLocale ? storageLocale || "en_US" : locale;

    if (i18n?.languages?.length === 1 && storageLocale !== locale) {
      replace(pathname, asPath, { locale: _locale });
      // return;
    }
    setLocaleReady(true);
  }, []);

  return (
    <Fragment>
      <Provider store={store}>
        <ToastsProvider>
          <ThemeContextProvider>
            <ModalProvider>
              <AppHead />

              <Script
                strategy="lazyOnload"
                src={`https://www.googletagmanager.com/gtag/js?id=${"UA-164631642-1"}`}
              />
              <Script id="ga-analytics">
                {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', '${"UA-164631642-1"}');
                `}
              </Script>

              <ResetCSS />
              <ToastListener />
              {localeReady && <Component {...pageProps} />}
            </ModalProvider>
          </ThemeContextProvider>
        </ToastsProvider>
      </Provider>
    </Fragment>
  );
}

export default appWithTranslation(App);
// export default App;
