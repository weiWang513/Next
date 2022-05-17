import React from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { ReactComponent as NoDataIcon } from "/public/images/SVG/pnlNodata.svg";

const NoData = styled(Flex)`
  width: 352px;
  height: 268px;
  justify-content: center;
`;

const pnlNoData = () => {
  return (
    <NoData>
      <NoDataIcon />
    </NoData>
  );
};

export default pnlNoData;
