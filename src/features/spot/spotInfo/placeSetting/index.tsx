import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import Setting from "./setting";

const PlaceSettingW = styled(Flex)`
  flex: 0 0 320px;
  padding-left: 16px;
  padding-right: 10px;
  justify-content: flex-end;
`;

const PlaceSetting = () => {
  return (
    <PlaceSettingW>
      <Setting />
    </PlaceSettingW>
  );
};

export default PlaceSetting;
