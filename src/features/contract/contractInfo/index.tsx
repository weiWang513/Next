import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";

import Info from "./info";
import PlaceSetting from "./placeSetting";
const ContractInfoW = styled(Flex)`
  padding: 8px 0;
  background: #130f1d;
`;

const ContractInfo = () => {
  return (
    <ContractInfoW>
      <Info></Info>
      <PlaceSetting></PlaceSetting>
    </ContractInfoW>
  );
};

export default ContractInfo;
