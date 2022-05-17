import React from "react";
import dynamic from "next/dynamic";

import styled from "styled-components";

import { Flex } from "@ccfoxweb/uikit";
import SpotInfoIn from "./spotInfo/index";
import Place from "./place/index";
import OrderBook from "./OrderBook/index";
import Posi from "./posi/index";
import Favorite from "./favorites/index";
import HomeHeader from "../../components/HomeHeader";
import Footer from "./footer";

import { useAppSelector } from "../../store/hook";

const Chart = dynamic(() => import("../../features/spot/chart"), {
  ssr: false
});

const Layout = styled(Flex)`
  min-width: 1440px;
  height: 100vh;
  flex-direction: column;
  overflow: overlay;
  background: #08060f;
  > ::-webkit-scrollbar {
    display: none !important;
  }
  + ::-webkit-scrollbar {
    display: none !important;
  }
`;
const HeaderWarp = styled(Flex)<{ chartFull: boolean }>`
  flex-direction: column;
  width: 100%;
  flex: ${({ height }) => `0 0 ${height}`};
  z-index: ${({ chartFull }) => (chartFull ? 1 : 2)};
  background: #08060f;
`;
const Header = styled.div`
  width: 100%;
  flex: 0 0 56px;
  margin-bottom: 4px;
  background: #130f1d;
  z-index: 1;
`;
const ContractListH = styled.div`
  width: 100%;
  flex: 0 0 40px;
  margin-bottom: 1px;
  background: #130f1d;
`;
const SpotInfo = styled.div`
  width: 100%;
  flex: 0 0 56px;
  margin-bottom: 4px;
`;
const MainContentWarp = styled(Flex)`
  flex-direction: column;
  width: 100%;
  flex: 1;
  overflow: scroll;
  margin-bottom: 4px;
  z-index: 1;
`;
const MainContent = styled(Flex)`
  width: 100%;
  flex: 0 0 693px;
  margin-bottom: 4px;
`;
const OrderWarp = styled.div`
  width: 100%;
  min-height: 568px;
  flex: 1;
`;
const ChartContainer = styled.div`
  flex: 1;
  height: 693px;
  background: #130f1d;
`;
const OrderTipWarp = styled.div`
  flex: 0 0 320px;
  height: 693px;
  margin-left: 4px;
`;
const PlaceWarp = styled.div`
  flex: 0 0 320px;
  height: 693px;
  margin-left: 4px;
`;

const AppLayout = () => {
  const showFavor = useAppSelector((state) => state.app.showFavor);
  const chartFull = useAppSelector((state) => state.spot?.chartFull);

  return (
    <Layout>
      <HeaderWarp h={showFavor ? "157px" : "117px"} chartFull={chartFull}>
        <Header>
          <HomeHeader />
        </Header>
        {showFavor && (
          <ContractListH>
            <Favorite />
          </ContractListH>
        )}
        <SpotInfo>
          <SpotInfoIn />
        </SpotInfo>
      </HeaderWarp>
      <MainContentWarp>
        <MainContent>
          <ChartContainer>
            <Chart />
          </ChartContainer>
          <OrderBook />
          <PlaceWarp>
            <Place></Place>
          </PlaceWarp>
        </MainContent>
        <OrderWarp>
          <Posi></Posi>
        </OrderWarp>
        <Footer />
      </MainContentWarp>
    </Layout>
  );
};

export default AppLayout;
