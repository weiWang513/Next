import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import Header from "./header";
import Content from "./content";
import Ticks from "./ticks";

const Container = styled(Flex)`
  flex: 0 0 320px;
  height: 693px;
  margin-left: 4px;
  flex-direction: column;
  background: #130f1d;
  width: 320px;
  min-height: 693px;
  display: none;
  @media screen and (max-width: 1680px) {
    display: block;
  }
`;
const OnlyOrderBook = styled(Flex)`
  flex: 0 0 320px;
  height: 693px;
  margin-left: 4px;
  flex-direction: column;
  background: #130f1d;
  width: 320px;
  min-height: 693px;
  @media screen and (max-width: 1680px) {
    display: none;
  }
`;
const OnlyTick = styled(Flex)`
  flex: 0 0 320px;
  height: 693px;
  margin-left: 4px;
  flex-direction: column;
  background: #130f1d;
  width: 320px;
  min-height: 693px;
  @media screen and (max-width: 1680px) {
    display: none;
  }
`;

const OrderBook = () => {
  const [tabIndex, setTabIndx] = useState(0);

  const changeTabs = (v: number) => {
    setTabIndx(v);
  };

  useEffect(() => {}, [tabIndex]);

  return (
    <>
      {/* 屏幕宽度大于1680px，OrderBook与Tick分开显示 */}
      <OnlyOrderBook>
        <Header tabIndex={tabIndex} changeTabs={changeTabs} disableTick={true} />
        <Content />
      </OnlyOrderBook>
      <OnlyTick>
        <Header tabIndex={tabIndex} changeTabs={changeTabs} disableOrderBook={true} />
        <Ticks />
      </OnlyTick>

      {/* 屏幕宽度小于等于1680px，OrderBook与Tick合并成Tab显示 */}
      <Container>
        <Header tabIndex={tabIndex} changeTabs={changeTabs} />
        {!tabIndex ? <Content /> : <Ticks />}
      </Container>
    </>
  );
};

export default OrderBook;
