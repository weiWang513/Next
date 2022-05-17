import React, { useEffect } from "react";
import styled from "styled-components";
import HomeHeader from "../components/HomeHeader";
import LoginFooter from "../components/LoginFooter";
import useInit from "../hooks/useInit";

import { useTranslation } from "next-i18next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

const PageContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  min-height: 700px;
  padding-bottom: 64px;
  background-color: #4700cd;
  background-image: url("/images/home/login-bg.png");
  background-size: cover;
`;
const PageCenter = styled.div`
  margin: 0 auto;
  padding-top: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Code = styled.div`
  font-size: 50px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  font-family: DINPro-Bold;
`;

const Tips = styled.div`
  font-size: 30px;
  font-weight: 600;
  color: #ffffff;
  text-align: center;
  width: 100%;
`;

const Custom500 = () => {
  const { t } = useTranslation();
  const { init } = useInit();

  useEffect(() => {
    init();
  }, []);

  return (
    <PageContainer>
      <HomeHeader />
      <PageCenter>
        <Code>500</Code>
        <Tips>Sorry!Internal Server Error.</Tips>
      </PageCenter>
      <LoginFooter />
    </PageContainer>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});

export default Custom500;
