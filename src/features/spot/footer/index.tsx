import React from "react";
import styled from "styled-components";

const FooterContainer = styled.div`
  width: 100%;
  flex: 0 0 32px;
  background: #130f1d;
  display: flex;
  align-items: center;
  padding: 0 16px;
  box-sizing: border-box;
`;

const CopyRight = styled.div`
  color: #615976;
  font-size: 12px;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <CopyRight>© 2019 - 2022 ccfox.com All rights reserved.</CopyRight>
    </FooterContainer>
  );
};

export default Footer;
