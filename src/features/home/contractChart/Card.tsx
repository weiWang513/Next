import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import IndicatorChart from "../../../components/IndicatorChart";
import IndictorSlider from "../../../components/IndictorSlider";
import IndicatorInfo from "./IndictorInfo";
import { useRouter } from "next/router";

const CardContainer = styled(Flex)<{ screenSzie: any }>`
  flex-direction: column;
  width: ${({ screenSzie }) => (screenSzie.width > 1200 ? "244px" : "120px")};
  height: ${({ screenSzie }) => (screenSzie.width > 1200 ? "129px" : "104px")};
  padding: 16px;
  box-sizing: border-box;
  border-radius: 8px;
  overflow: hidden;
  background: #ffffff;
  cursor: pointer;
  // :hover {
  //   transform: translateY(-8px);
  //   box-shadow: 0px 4px 8px 0px rgba(34, 10, 96, 0.05);
  //   transition: transform 0.2s;
  // }
`;

const Top = styled(Flex)`
  justify-content: space-between;
`;

const Bottom = styled(Flex)`
  justify-content: space-between;
  margin-top: 8px;
`;

const TinyTop = styled(Flex)`
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Card = ({ item, tradingData, candlesticksItem, pcr, screenSzie }) => {
  const { push } = useRouter();
  const goTrade = (symbol) => {
    if (screenSzie?.width > 1200) {
      let a = symbol.replace(/\/|\-/, "_");
      push({ pathname: "/contract/[[...id]]", query: { id: a } });
    } else {
      push('/download')      
    }
  };
  return (
    <CardContainer onClick={() => goTrade(item.symbol)} screenSzie={screenSzie}>
      {screenSzie?.width > 1200 ? (
        <>
          <Top>
            <IndicatorInfo item={item} screenSzie={screenSzie} />
            <IndicatorChart candlesticksItem={candlesticksItem} pcr={pcr} />
          </Top>
          <Bottom>
            <IndictorSlider tradingData={tradingData} contractId={item.contractId} />
          </Bottom>
        </>
      ) : (
        <TinyTop>
          <IndicatorInfo item={item} screenSzie={screenSzie} />
        </TinyTop>
      )}
    </CardContainer>
  );
};

export default Card;
