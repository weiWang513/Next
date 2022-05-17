import { FC } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import Contact from "./Contact";
import { useTranslation } from "next-i18next";

const Container = styled(Flex)`
  padding: 40px;
  background: #f5f3fb;
  border-radius: 0px 0px 16px 16px;
  transition: all 0.5s;

  // 移动端
  @media only screen and (max-width: 1280px) {
    display: block;
    padding: 24px;
  }
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  margin-bottom: 4px;
  font-size: 20px;
  font-weight: 600;
  color: #220a60;
  line-height: 28px;
  transition: all 0.5s;

  // 移动端
  @media only screen and (max-width: 1280px) {
    font-size: 16px;
    text-align: center;
    line-height: 22px;
  }
`;

const Paragraph = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #aaa4bb;
  line-height: 17px;
  transition: all 0.5s;

  // 移动端
  @media only screen and (max-width: 1280px) {
    margin-bottom: 16px;
    text-align: center;
  }
`;

const Footer: FC = () => {
  const { t } = useTranslation();
  return (
    <Container>
      <Content>
        <Title>{t("custom503.community")}</Title>
        <Paragraph>{t("custom503.communityDetail")}</Paragraph>
      </Content>
      <Contact />
    </Container>
  );
};

export default Footer;
