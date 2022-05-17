import React, { useState, useEffect } from "react";
import styled from "styled-components";

import HomeHeader from "../components/HomeHeader";
import HomeFooter from "../components/HomeFooter";
import Banner from "../features/home/banner";
import ContractChart from "../features/home/contractChart";
import Notice from "../features/home/notice";
import Advantage from "../features/home/advantage";
import Download from "../features/home/download";
import Investment from "../features/home/investment";
import StartTravel from "../features/home/startTravel";
import ModalAlert from "../components/ModalAlert";
import CommonHead from "../components/Head/CommonHead";

import { serverSideTranslations } from "next-i18next/serverSideTranslations";
// import { queryCommonData } from "../services/api/contract";

import useInit from "../hooks/useInit";
import useSocketIO from "../hooks/useSocketIO";
import Udesk from "../features/home/udesk";

const HomeWarp = styled.div`
  background: #ffffff;
  overflow: hidden;
  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const Homepage = () => {
  const { init, setCommonData } = useInit();
  const { initSocket, disconnect } = useSocketIO("future");

  useEffect(() => {
    init();
    setCommonData();
    initSocket();

    return () => {
      disconnect();
    };
  }, []);

  return (
    <>
      <CommonHead />
      <HomeWarp>
        <HomeHeader />
        <Banner />
        <ContractChart />
        <Notice />
        <Advantage />
        <Download />
        <Investment />
        <StartTravel />
        <HomeFooter />

        <ModalAlert />
        <Udesk />
      </HomeWarp>
    </>
  );
};

// export const getStaticProps = async () => {
//   // let fetchContractList = await queryCommonData();
//   // let contractList = fetchContractList.data.data.contracts;
//   let props = {
//     props: {
//       // ...(await serverSideTranslations(locale, ["common", "home", "code"])),
//       // contractList,
//       // locale,
//     },
//   };
//   return props;
// };

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});

export default Homepage;
