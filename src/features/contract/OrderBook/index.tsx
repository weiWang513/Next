import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import Header from "./header";
import Content from "./content";
import Ticks from "./ticks";
const OrderBookContent = styled(Flex)`
  flex-direction: column;
  background: #130f1d;
  width: 320px;
  min-height: 693px;
`;

const OrderBook = () => {
  const [tabIndex, setTabIndx] = useState(0);

  const [booksTabs, setBooksTabs] = useState(0);
  const changeTabs = (v) => {
    setTabIndx(v);
  };
  useEffect(() => {}, [tabIndex]);

  return (
    <OrderBookContent>
      <Header
        tabIndex={tabIndex}
        changeTabs={changeTabs}
        booksTabs={booksTabs}
        setBooksTabs={(v) => setBooksTabs(v)}
      ></Header>
      {!tabIndex ? <Content /> : <Ticks />}
    </OrderBookContent>
  );
};

export default OrderBook;
