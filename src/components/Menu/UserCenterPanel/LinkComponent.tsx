import React, { useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { ReactComponent as Spot } from "/public/images/SVG/spot.svg";

const T = styled(Flex)`
  padding: 0 16px;
  height: 56px;
  span{
    flex: 1;
    padding-left: 8px;
    font-size: 16px;
    font-weight: 500;
    color: #220A60;
    line-height: 22px;
  }
`

const trade = props => {
  return <T onClick={() => props.handel && props.handel()}>
    {props.renderIcon()}
    <span>{props.title}</span>
  </T>
}

export default trade