import Image from "next/image";
import { FC } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: relative;
  display: block;
  width: 197px;
  height: 172px;
  transition: all 0.5s;
  // 移动端
  @media only screen and (max-width: 1280px) {
    position: absolute;
    left: 50%;
    top: 0;
    width: 143px;
    height: 124px;
    overflow: hidden;
    transform: translate(-50%, -33px);
  }
`;

const Banner: FC = () => {
  return (
    <Container>
      <Image src="/images/503/oops@2x.png" alt="oops" layout="fill" priority />
    </Container>
  );
};

export default Banner;
