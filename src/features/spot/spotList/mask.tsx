import React from "react";
import styled from "styled-components";

const Mask = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
`;

const mask = (props) => {
  return <Mask onClick={props.close}></Mask>;
};

export default mask;
