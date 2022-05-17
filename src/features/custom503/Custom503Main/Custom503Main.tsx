import { FC } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import Banner from "./Banner";
import AnnouncementTitle from "./AnnouncementTitle";
import DetailLink from "./DetailLink";
import Footer from "./Footer";
import AnnouncementContent from "./AnnouncementContent";

const Container = styled.div`
  position: fixed;
  left: 50%;
  top: 50%;
  width: 734px;
  transform: translate(-50%, -50%);
  background: #ffffff;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.3);
  border-radius: 16px;
  transition: all 0.5s;

  // 移动端
  @media only screen and (max-width: 1280px) {
    width: 90vw;
  }
`;

const Main = styled(Flex)`
  position: relative;
  padding: 56px 63px 50px;
  // 移动端
  @media only screen and (max-width: 1280px) {
    padding: 24px;
  }
`;

const Announcement = styled.div`
  flex: 1;
  padding: 12px 0 0 28px;

  // 移动端
  @media only screen and (max-width: 1280px) {
    padding: 76px 0 0 0;
  }
`;

const Custom503Main: FC = () => {
  return (
    <Container>
      <Main>
        <Banner />
        <Announcement>
          <AnnouncementTitle />
          <AnnouncementContent />
          <DetailLink />
        </Announcement>
      </Main>
      <Footer />
    </Container>
  );
};

export default Custom503Main;
