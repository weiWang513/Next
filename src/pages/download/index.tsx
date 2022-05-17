import React, { useEffect } from "react";
import styled from "styled-components";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import HomeHeader from "../../components/HomeHeader";
import Footer from "../../features/download/footer";
import Title from "../../features/download/title";
import TextTip from "../../features/download/textTip";
import FuncArea from "../../features/download/funcArea";
import Swiper from "../../features/download/swiper";
import Buttons from "../../features/download/Buttons";
import { Flex } from "@ccfoxweb/uikit";
import useInit from "../../hooks/useInit";
import CommonHead from "../../components/Head/CommonHead";

const DownloadContainer = styled.div`
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: url("/images/home/home_top_bg.png") #4700cd;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  padding-bottom: 88px;
`;

const Content = styled(Flex)`
  max-width: 1040px;
  height: 100%;

  margin: auto;
  align-items: flex-start;
  justify-content: space-between;
`;
const ContentL = styled(Flex)`
  flex-direction: column;
  align-items: flex-start;
`;

const ContentR = styled.div<{ d? }>`
  display: ${({ d }) => (d ? "none" : "flex")};
  width: ${({ d }) => (d ? "" : "100%")};
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.mediaQueries.md} {
    display: ${({ d }) => (d ? "block" : "none")};
  }
`;

const DownloadPage = () => {
  const { init } = useInit();

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <CommonHead />
      <DownloadContainer>
        <HomeHeader />
        <Content>
          <ContentL>
            <Title />
            <ContentR d={0}>
              <Swiper />
            </ContentR>
            <TextTip />
            <FuncArea />
          </ContentL>
          <ContentR d={1}>
            <Swiper />
          </ContentR>
        </Content>

        {/* <Title>Trade Cryptos Anywhere, Anytime</Title> */}
        <Footer />
        <Buttons />
      </DownloadContainer>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});

export default DownloadPage;
