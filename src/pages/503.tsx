import { useEffect, useState } from "react";

import styled from "styled-components";

import { getInjectInfo, setInjectInfo } from "../functions/info";
import Custome503Header from "../features/custom503/Custom503Header/Custom503Header";
import Custome503Main from "../features/custom503/Custom503Main/Custom503Main";
import Custome503Footer from "../features/custom503/Custom503Footer/Custom503Footer";
import Udesk from "../features/home/udesk";
import { NextPage } from "next";
import { DEFAULT_LOCALE } from "../contants";
import { useAppDispatch } from "../store/hook";
import { setLocale } from "../store/modules/appSlice";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: rgb(71, 0, 205);
  background-repeat: no-repeat, no-repeat, repeat;
  background-position: top center, bottom center;
  background-image: url(/images/503/bg1@2x.png), url(/images/503/bg2@2x.png),
    url(/images/home/home_top_bg.png);
  background-size: contain, contain, 203px 203px;
`;

const Custom503: NextPage = () => {
  // DOC: https://github.com/vercel/next.js/discussions/17443#discussioncomment-637879
  const [mounted, setMounted] = useState(false);
  const { locale } = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    // 初始化语言

    setInjectInfo("locale", locale);
    dispatch(setLocale(locale));
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (mounted) {
    return (
      <>
        <Container>
          <Custome503Header />
          <Custome503Main />
          <Custome503Footer />
          <Udesk />
        </Container>
      </>
    );
  } else {
    return <></>;
  }
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});

export default Custom503;
