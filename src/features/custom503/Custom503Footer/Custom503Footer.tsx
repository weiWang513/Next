import { FC } from "react";
import styled from "styled-components";

const Custom503Footer: FC = () => {
  const currentYear = new Date().getFullYear();

  return <Container>© 2019 - {currentYear} ccfox.com All rights reserved.</Container>;
};

const Container = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  padding: 24px 0;
  text-align: center;

  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.5);
  line-height: 18px;
`;

export default Custom503Footer;
