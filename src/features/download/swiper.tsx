import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import swip0 from "../../../public/images/download/swip0.png";
import Image from "next/image";
import { useAppSelector } from "../../store/hook";
import { Swiper, SwiperSlide } from "swiper/react";


import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";

// install Swiper modules
SwiperCore.use([Pagination, Navigation, Autoplay]);

const SwiperC = styled.div`
  margin-top: 56px;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-top: 243px;
    height: 696px;
    width: 500px;
  }
`;

const Animation = styled.div`
  width: 375px;
  height: 513px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 467px;
    height: 696px;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  & > div {
    position: absolute;
  }
  .t {
    width: 202px;
    height: 72px;
    top: 70px;
    left: 20px;
    transition: all 0.8s ease;
    transform: translate(20px, -20px);
    opacity: 0;
    z-index: 2;
    img {
      width: 202px;
      height: 72px;
    }
    &.animate {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }
  .m {
    width: 467px;
    height: 696px;
    top: 0;
    left: 0;
    img {
      width: 467px;
      height: 696px;
    }
  }
  .b {
    width: 292px;
    height: 211px;
    bottom: 187px;
    left: 96px;
    transition: all 0.6s ease 0.8s;
    transform: translate(-50px, 30px);
    opacity: 0;
    img {
      width: 292px;
      height: 211px;
    }
    &.animate {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }
`;

const AnimationMain = styled.div<{ w?; h? }>`
  width: ${({ w }) => w};
  height: ${({ h }) => h};
  top: 0;
  left: 0;
  img {
    width: ${({ w }) => w};
    height: ${({ h }) => h};
  }
`;

const D = styled.div<{ d? }>`
  display: ${({ d }) => (d ? "none" : "block")};
  ${({ theme }) => theme.mediaQueries.md} {
    display: ${({ d }) => (d ? "block" : "none")};
    height: 100%;
  }
`;

const AnimationTemp = styled.div<{ w?; h?; t?; b?; l?; tx?; ty?; delay? }>`
  width: ${({ w }) => w};
  height: ${({ h }) => h};
  top: ${({ t }) => t};
  bottom: ${({ b }) => b};
  left: ${({ l }) => l};
  transition: ${({ delay }) => `all 0.6s ease ${delay}s`};
  transform: ${({ tx, ty }) => `translate(${tx}, ${ty})`};
  opacity: 0;
  img {
    width: ${({ w }) => w};
    height: ${({ h }) => h};
  }
  &.animate {
    transform: translate(0px, 0px);
    opacity: 1;
  }
`;

const SwiperContainer = styled(Swiper)`
  width: 375px;
  ${({ theme }) => theme.mediaQueries.md} {
    width: 500px;
  }
  // height: 100%;
  
`;

const swiper = (props) => {
  const [swiperRef, setSwiperRef] = useState(null);
  const [realIndex, setRealIndex] = useState(-1);
  const swiperContainer = useRef(null);

  const userHabit = useAppSelector((state) => state.app.userHabit);

  const startAuto = () => {
    swiperRef?.autoplay?.start();
  };

  const stopAuto = () => {
    swiperRef?.autoplay?.stop();
  };

  useEffect(() => {
    if (!swiperRef || !swiperContainer) return;

    swiperRef && swiperContainer?.current?.addEventListener("mouseenter", stopAuto);
    swiperRef && swiperContainer?.current?.addEventListener("mouseleave", startAuto);

    return () => {
      swiperRef && swiperContainer?.current?.removeEventListener("mouseenter", stopAuto);
      swiperRef && swiperContainer?.current?.removeEventListener("mouseleave", startAuto);
    };
  }, [swiperContainer, swiperRef]);

  const paginationUpdate = (swiper, paginationEl) => {
    console.log('swiper', swiper.realIndex, swiperRef?.realIndex)
    setRealIndex(swiper.realIndex);
  };

  const getImgUrl = (v) => {
    switch (userHabit.locale) {
      case 'en_US':
      case 'ko_KR':
        return `/images/download/${v}-${userHabit.locale}.png`
        
        default:
        return `/images/download/${v}-${userHabit.locale}.png`
        return 'swip10'
        break;
    }
  }

  return (
    <SwiperC ref={swiperContainer}>
      <D d={1}>
        <SwiperContainer
          onSwiper={setSwiperRef}
          spaceBetween={50}
          onPaginationUpdate={paginationUpdate}
          loop={true}
          pagination={true}
          autoplay={{
            delay: 12500,
            disableOnInteraction: false
          }}
        >
          <SwiperSlide key={"1"}>
            <Animation>
              <AnimationMain w="467px" h="696px">
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/swip0.png"
                      : `/images/download/swip0-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationMain>
            </Animation>
          </SwiperSlide>
          <SwiperSlide key={"2"}>
            <Animation>
              <AnimationMain w="467px" h="696px">
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/swip10.png"
                      : `/images/download/swip10-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationMain>
              <AnimationTemp
                w="202px"
                h="72px"
                t="60px"
                l="10px"
                delay="1"
                tx="20px"
                ty="0"
                className={`${realIndex === 1 ? "animate" : ""}`}
              >
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/swip11.png"
                      : `/images/download/swip11-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationTemp>
              <AnimationTemp
                w="292px"
                h="211px"
                b="187px"
                l="86px"
                delay="2"
                tx="-50px"
                ty="30px"
                className={`${realIndex === 1 ? "animate" : ""}`}
              >
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/swip12.png"
                      : `/images/download/swip12-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationTemp>
            </Animation>
          </SwiperSlide>
          <SwiperSlide key={"3"}>
            <Animation>
              <AnimationMain w="467px" h="696px">
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/swip20.png"
                      : `/images/download/swip20-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationMain>
              <AnimationTemp
                w="290px"
                h="320px"
                t="143px"
                l="-16px"
                delay="1"
                tx="40px"
                ty="20px"
                className={`${realIndex === 2 ? "animate" : ""}`}
              >
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/swip21.png"
                      : `/images/download/swip21-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationTemp>
              <AnimationTemp
                w="340px"
                h="84px"
                b="158px"
                l="16px"
                delay="2"
                tx="0px"
                ty="10px"
                className={`${realIndex === 2 ? "animate" : ""}`}
              >
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/swip22.png"
                      : `/images/download/swip22-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationTemp>
            </Animation>
          </SwiperSlide>
        </SwiperContainer>
        {/* <img src={"/images/download/swip0.png"} width='467px' height='696px' alt="" /> */}
      </D>
      <D d={0}>
        <SwiperContainer
          onSwiper={setSwiperRef}
          spaceBetween={50}
          loop={true}
          pagination={true}
          onPaginationUpdate={paginationUpdate}
          autoplay={{
            delay: 12500,
            disableOnInteraction: false
          }}
        >
          <SwiperSlide key={"1"}>
            <Animation>
              <AnimationMain w="375px" h="493px">
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/m-swip0.png"
                      : `/images/download/m-swip0-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationMain>
            </Animation>
          </SwiperSlide>
          <SwiperSlide key={"2"}>
            <Animation>
              <AnimationMain w="375px" h="493px">
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/m-swip10.png"
                      : `/images/download/m-swip10-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationMain>
              <AnimationTemp
                w="162px"
                h="52px"
                t="40px"
                l="60px"
                delay="1"
                tx="20px"
                ty="0"
                className={`${realIndex === 1 ? "animate" : ""}`}
              >
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/m-swip11.png"
                      : `/images/download/m-swip11-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationTemp>
              <AnimationTemp
                w="201px"
                h="151px"
                b="147px"
                l="106px"
                delay="2"
                tx="-20px"
                ty="10px"
                className={`${realIndex === 1 ? "animate" : ""}`}
              >
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/m-swip12.png"
                      : `/images/download/m-swip12-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationTemp>
            </Animation>
          </SwiperSlide>
          <SwiperSlide key={"3"}>
            <Animation>
              <AnimationMain w="375px" h="493px">
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/m-swip20.png"
                      : `/images/download/m-swip20-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationMain>
              <AnimationTemp
                w="200px"
                h="225px"
                t="113px"
                l="52px"
                delay="1"
                tx="40px"
                ty="20px"
                className={`${realIndex === 2 ? "animate" : ""}`}
              >
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/swip21.png"
                      : `/images/download/swip21-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationTemp>
              <AnimationTemp
                w="223px"
                h="60px"
                b="128px"
                l="75px"
                delay="2"
                tx="0px"
                ty="10px"
                className={`${realIndex === 2 ? "animate" : ""}`}
              >
                <img
                  src={
                    userHabit.locale.indexOf("zh") > -1
                      ? "/images/download/swip22.png"
                      : `/images/download/swip22-${userHabit.locale}.png`
                  }
                  alt=""
                />
              </AnimationTemp>
            </Animation>
          </SwiperSlide>
        </SwiperContainer>
        {/* <img src={"/images/download/m-swip0.png"} width="414px" height="513px" alt="" /> */}
      </D>
    </SwiperC>
  );
};

export default swiper;
