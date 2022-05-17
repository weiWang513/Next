import React, { useRef, useState } from "react";
import styled from "styled-components";
import ExchangeInfo from "./ExchangeInfo";
import Card from "./Card";
import Slide from "./Slide";
import Image from "next/image";
import { useAppSelector } from "../../../store/hook";
import { selectSocketStatus } from "../../../store/modules/appSlice";

const left = 0;
const center = 520;
const right = 975;

const leftBottom = -30;
const centerBottom = -30;
const rightBottom = -30;

const BannerWarp = styled.div`
  height: 360px;
  background: url("/images/home/home_top_bg.png") #4700cd;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden;
  ${({ theme }) => theme.mediaQueries.md} {
    height: 767px;
  }
`;

const BannerCenter = styled.div`
  height: 100%;
  z-index: 3;
  position: absolute;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 1200px;
    display: flex;
    justify-content: space-between;
  }
`;

const LeftWarp = styled.aside`
  display: flex;
  flex-direction: column;
  z-index: 2;
  // pointer-events: none;
  justify-content: flex-start;
`;

const RightWarp = styled.aside`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
    flex-direction: column;
    z-index: 2;
  }
`;

const AnimationPanel = styled.div`
  position: absolute;
  // z-index: 1;
  width: 1733px;
  height: 100%;
  left: 50%;
  transform: translateX(-50%);
  top: 0;
  // .left {
  //   bottom: ${leftBottom}px;
  //   left: ${left}px;
  //   z-index: 3;
  //   width: 100%;
  //   height: 100%;
  //   max-width: 755px;
  //   min-height: 827px;
  // }
  // .center {
  //   bottom: ${centerBottom}px;
  //   left: ${center}px;
  //   z-index: 1;
  //   width: 100%;
  //   height: 100%;
  //   max-width: 899px;
  //   min-height: 827px;
  // }
  // .right {
  //   bottom: ${rightBottom}px;
  //   left: ${right}px;
  //   z-index: 3;
  //   width: 100%;
  //   height: 100%;
  //   max-width: 782px;
  //   min-height: 661px;
  // }
  & > section {
    display: none;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      display: block;
      position: absolute;
      left: 200px;
      top: 30px;
      width: 532px;
      height: 532px;
      z-index: 2;
    }
  }
`;

const TinySliderWrap = styled.div`
  width: 100%;
  max-width: 366px;
  height: 145px;
  display: block;
  padding: 0 10px;
  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
    padding: 0;
  }
`;

const Banner = () => {
  // const AnimationPanelRef = useRef(null);
  // const AnimationLeftRef = useRef(null);
  // const AnimationCenterRef = useRef(null);
  // const AnimationRightRef = useRef(null);
  // const isInner = useRef(false);

  // const socketStatus = useAppSelector(selectSocketStatusr);

  // const _onMouseMove = (e) => {
  //   const { clientX, clientY } = e.nativeEvent;
  //   const move = 50;

  //   if (!isInner.current) {
  //     AnimationLeftRef.current.style.transition = `all 1s`;
  //     AnimationCenterRef.current.style.transition = `all 1s`;
  //     AnimationRightRef.current.style.transition = `all 1s`;
  //   } else {
  //     AnimationLeftRef.current.style.transition = "all";
  //     AnimationCenterRef.current.style.transition = "all";
  //     AnimationRightRef.current.style.transition = "all";
  //   }

  //   // AnimationLeftRef.current.style.transition = isInner ? "all" : `all 1s`;
  //   AnimationLeftRef.current.style.left = `${left - clientX / move}px`;
  //   AnimationLeftRef.current.style.bottom = `${leftBottom + clientY / move}px`;

  //   // AnimationCenterRef.current.style.transition = isInner ? "all" : `all 1s`;
  //   AnimationCenterRef.current.style.left = `${center + clientX / move}px`;
  //   AnimationCenterRef.current.style.bottom = `${
  //     centerBottom - clientY / move
  //   }px`;

  //   // AnimationRightRef.current.style.transition = isInner ? "all" : `all 1s`;
  //   AnimationRightRef.current.style.left = `${right - clientX / move}px`;
  //   AnimationRightRef.current.style.bottom = `${
  //     rightBottom + clientY / move
  //   }px`;

  //   !isInner.current && setTimeout(() => (isInner.current = true), 1000);
  // };

  // const _onMouseLeave = () => {
  //   AnimationLeftRef.current.style.transition = `all 1s`;
  //   AnimationLeftRef.current.style.left = `${left}px`;
  //   AnimationLeftRef.current.style.bottom = `${leftBottom}px`;
  //   AnimationCenterRef.current.style.transition = `all 1s`;
  //   AnimationCenterRef.current.style.left = `${center}px`;
  //   AnimationCenterRef.current.style.bottom = `${centerBottom}px`;
  //   AnimationRightRef.current.style.transition = `all 1s`;
  //   AnimationRightRef.current.style.left = `${right}px`;
  //   AnimationRightRef.current.style.bottom = `${rightBottom}px`;
  //   isInner.current = false;
  // };

  return (
    <BannerWarp>
      <AnimationPanel>
        <Image
          src={"/images/home/login-bg.png"}
          alt="ccfox"
          layout="fill"
          objectFit="fill"
          priority
        />
        <section>
          <img src={"/images/home/masoon_animation.png"} alt="ccfox" />
        </section>
      </AnimationPanel>

      <BannerCenter>
        <LeftWarp>
          <ExchangeInfo />
          <TinySliderWrap>
            <Slide />
          </TinySliderWrap>
        </LeftWarp>
        <RightWarp>
          <Card />
          <Slide />
        </RightWarp>
      </BannerCenter>
    </BannerWarp>
  );
};

export default Banner;
