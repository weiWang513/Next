import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import PosiMode from './posiMode'
import Lever from './lever'
import CountSwitch from './countSwitch'
import Calc from './calc'
import Setting from './setting'
const PlaceSettingW = styled(Flex)`
  flex: 0 0 320px;
  padding-left: 16px; 
  padding-right: 10px;
`



const PlaceSetting = () => {
  return (
    <PlaceSettingW>
      <PosiMode />
      <Lever />
      <CountSwitch />
      <Calc />
      <Setting />
    </PlaceSettingW>
  )
}

export default PlaceSetting