import React from "react";
import styled from "styled-components";
import { Flex} from "@ccfoxweb/uikit";
import ContractInfoIn from "../../features/contract/contractInfo/index";
import Place from "./place/index";
import OrderBook from "./OrderBook/index";
import Posi from "./posi/index";
// import useSocketIO from "../../hooks/useSocketIO";
import { useAppSelector } from "../../store/hook";
import Favorite from "./favorites/index";
// import Chart from "../../features/contract/chart";
import HomeHeader from "../../components/HomeHeader";
import Footer from "./footer";

import dynamic from "next/dynamic";

const Chart = dynamic(() => import("../../features/contract/chart"), {
  ssr: false,
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
const ContractInfo = styled.div`
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
  // const isLogin = useAppSelector((state) => state.app.isLogin);
  const showFavor = useAppSelector((state) => state.app.showFavor);
  const chartFull = useAppSelector((state) => state.contract.chartFull);

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
        <ContractInfo>
          <ContractInfoIn />
        </ContractInfo>
      </HeaderWarp>
      <MainContentWarp>
        <MainContent>
          <ChartContainer>
            <Chart />
          </ChartContainer>
          <OrderTipWarp>
            <OrderBook></OrderBook>
          </OrderTipWarp>
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
