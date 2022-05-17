import { FC } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import Logo from "./Logo";
import Language from "./Language";

const Container = styled(Flex)`
  z-index: 100;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  width: 100vw;
  height: 56px;
  padding: 0 16px 0 32px;
  justify-content: space-between;
  transition: all 0.5s;
  // 移动端
  @media only screen and (max-width: 1280px) {
    padding: 0 16px 0 16px;
  }
`;

const Custom503Header: FC = () => {
  return (
    <Container>
      <Logo />
      <Language />
    </Container>
  );
};

export default Custom503Header;
