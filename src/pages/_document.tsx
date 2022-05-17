import Document, { DocumentContext, Html, Main, NextScript, Head } from "next/document";
import Script from "next/script";

import { ServerStyleSheet } from "styled-components";
export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) => sheet.collectStyles(<App {...props} />)
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        )
      };
    } finally {
      sheet.seal();
    }
  }
  render() {
    return (
      <Html lang="en" dir="ltr">
        <Head>
          <script type="text/javascript" src="/gt.js"></script>
          <link rel="icon" href="/favicon.ico" />

          {/* Global Site Tag (gtag.js) - Google Analytics */}
          {/* <script src={`https://www.googletagmanager.com/gtag/js?id=UA-164631642-1`} />
          <script
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'UA-164631642-1')`
            }}
          /> */}
          {/* <Script
            src={`https://www.googletagmanager.com/gtag/js?id=UA-164631642-1`}
          />
          <Script
            id="gtag-init"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
            
              gtag('config', 'UA-164631642-1')`,
            }}
          /> */}

          {/* umeng */}
          <script
            dangerouslySetInnerHTML={{
              __html: `(function () {
                var el = document.createElement("script");
                el.type = "text/javascript";
                el.charset = "utf-8";
                el.async = true;
                var ref = document.getElementsByTagName("script")[0];
                ref.parentNode.insertBefore(el, ref);
                el.src = "https://v1.cnzz.com/z_stat.php?id=1280735059&web_id=1280735059";
              })()`
            }}
          />
          {/* <script
            dangerouslySetInnerHTML={{
              __html: `window._czc = _czc || []`,
            }}
          /> */}
          {/* <Script
            id="umeng-init"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function () {
                var el = document.createElement("script");
                el.type = "text/javascript";
                el.charset = "utf-8";
                el.async = true;
                var ref = document.getElementsByTagName("script")[0];
                ref.parentNode.insertBefore(el, ref);
                el.src = "https://v1.cnzz.com/z_stat.php?id=1280735059&web_id=1280735059";
              })()`,
            }}
          />
          <Script
            id="umeng-trackEvent"
            strategy="beforeInteractive"
            dangerouslySetInnerHTML={{
              __html: `window._czc = _czc || []`,
            }}
          /> */}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: `{
                "@context": "https://schema.org",
                "@graph": [
                    {
                      "@type": "Organization",
                      "@id": "https://www.ccfox.com",    
                      "name": "Innovative Cryptocurrency Exchange | Bitcoin & ETH Exchange | CCFOX",
                      "url": "https://www.ccfox.com", 
                      "legalName": "CCFOX Holdings Ltd.",
                      "foundingDate": "2019",
                      "sameAs": [
                        "https://www.facebook.com/CCFOX-105509372090647",
                        "https://twitter.com/CCFOX2020",
                        "https://www.linkedin.com/company/ccfox",
                        "https://www.instagram.com/ccfoxkorea/",
                        "https://play.google.com/store/apps/details?id=com.ccfoxapp.carbon"
                        ],
                        "logo": {
                        "@type": "ImageObject",
                        "@id": "https://www.ccfox.com", 
                        "url": "https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/logo/logo2.jpg",
                        "caption": "Innovative Cryptocurrency Exchange | Bitcoin & ETH Exchange | CCFOX"
                      },
                      "image": {
                        "@id": "https://www.ccfox.com"
                      }
                    },
                    {
                      "@type": "WebSite",
                      "@id": "https://www.ccfox.com/",
                      "url": "https://www.ccfox.com/",
                      "name": "Innovative Cryptocurrency Exchange | Bitcoin & ETH Exchange | CCFOX",
                      "publisher": {
                        "@id": "https://www.ccfox.com/"
                      }
                    },
                    {
                      "@type": "ImageObject",
                      "@id": "https://www.ccfox.com",  
                      "url": "https://ccfox-pro.oss-ap-southeast-1.aliyuncs.com/logo/logo2.jpg"
                    },
                    {
                      "@type": "WebPage",
                      "@id": "https://www.ccfox.com",   
                      "url": "https://www.ccfox.com",       
                      "inLanguage": "zh-CN",
                      "name": "Innovative Cryptocurrency Exchange | Bitcoin & ETH Exchange | CCFOX",
                      "description": "CCFOX cryptocurrency exchange - We operate the most innovative way to trade bitcoin and altcoins, provide the best crypto trading experience and ensure crypto asset safety.",
                      "isPartOf": {
                        "@id": "https://www.ccfox.com"      
                      },
                      "primaryImageOfPage": {
                        "@id": "https://www.ccfox.com/"     
                      }
                    },
                    {
                      "@type": "Table",
                      "about": "Cryptocurrency Prices Today"
                    }
                 ]
              }`
            }}
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
