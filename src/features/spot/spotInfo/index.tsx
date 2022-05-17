import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";

import Info from "./info";
import PlaceSetting from "./placeSetting";

const Container = styled(Flex)`
  padding: 8px 0;
  background: #130f1d;
`;

const SpotInfo = () => {
  return (
    <Container>
      <Info></Info>
      <PlaceSetting></PlaceSetting>
    </Container>
  );
};

export default SpotInfo;
