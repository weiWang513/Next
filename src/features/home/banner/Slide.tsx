import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { Flex } from "@ccfoxweb/uikit";
import { getBannerList } from "../../../services/api/common";
import { Swiper, SwiperSlide } from "swiper/react";
import { useAppSelector } from "../../../store/hook";
// import Image from "next/image";
import useChangeSize from "../../../hooks/useClientSize";

const SwiperContainer = styled(Swiper)`
  width: 100%;
  height: 100%;
`;
const SlideWarp = styled.div`
  width: 100%;
  max-width: 366px;
  height: 100%;
  margin-top: 24px;
  // overflow: hidden;
  position: relative;
  background: rgba(71, 0, 205, 1);

  ${({ theme }) => theme.mediaQueries.md} {
    width: 400px;
    max-width: 400px;
    height: 127px;
  }

  .swiper-button-next {
    &:after {
      display: none;
    }
    ${({ theme }) => theme.mediaQueries.md} {
      position: absolute;
      right: 0 !important;
      top: 0 !important;
      margin-top: 0 !important;
      width: 64px;
      height: 100%;
      transition: all 0.2s ease;
      background: url("/images/SVG/slide-right.svg");
      z-index: 3;
      :hover {
        background: url("/images/SVG/slide-right-hover.svg");
      }
      &:after {
        display: none;
      }
    }
  }

  .mySwiper {
    width: 100%;
    height: 100%;
  }
  .swiper-slide {
    text-align: center;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .swiper-slide img {
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    object-fit: cover;
  }

  .swiper-slide {
    width: 100%;
  }

  .swiper-slide:nth-child(n) {
    width: 320px;
    border-radius: 8px;
    // overflow: hidden;
    cursor: pointer;
  }
`;
// const ListWarp = styled.div`
//   min-width: 6000px;
//   height: 100%;
//   display: flex;
//   &.flash {
//     transition: all 0;
//   }
//   &.animate {
//     transition: all 0.5s linear;
//   }
//   & > li {
//     width: 320px;
//     height: 127px;
//     border-radius: 8px;
//   }
// `

const PaginationWrap = styled(Flex)`
  height: 4px;
  width: 100%;
  margin-top: 17px;
  justify-content: center;
  align-items: center;

  .pagination-item {
    width: 12px;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 2px;
    display: block;
    margin: 0 3px;
    cursor: pointer;
  }

  .pagination-item-active {
    background: #ffffff;
  }
`;

const Slide = () => {
  const swiperContainer = useRef(null);
  const [swiperRef, setSwiperRef] = useState(null);
  const [bannerList, setBannerLset] = useState([]);
  const [loading, setLoading] = useState(false);
  const [realIndex, setRealIndex] = useState(0);
  const userHabit = useAppSelector((state) => state.app.userHabit);

  const screenSize = useChangeSize();

  const goOpenUrl = (url) => {
    const locale = userHabit.locale || "en_US";
    let myWindow = window.open(
      `${url}${url.indexOf("?") > -1 ? "&" : "?"}locale=${locale}&device=pc`
    );

    myWindow.opener = null;
  };

  const paginationUpdate = (swiper, paginationEl) => {
    setRealIndex(swiper.realIndex);
  };

  const changeSlider = (index) => {
    // console.log("swiperRef", swiperRef);
    // swiperRef.pagination.update(index);
  };

  useEffect(() => {
    if (userHabit.locale === "") return;

    let lang = userHabit.locale;
    const params = { type: 0, locale: lang };
    getBannerList(params).then((res) => {
      if (res.data.code === 0) {
        let list = res.data.data;
        if (list.length === 1) {
          list = [...list, ...list];
        }
        setBannerLset(list);
        setTimeout(() => setLoading(false), 1000);
      }
    });
  }, [userHabit.locale]);

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

  return (
    <SlideWarp ref={swiperContainer}>
      {bannerList.length > 0 && userHabit.locale !== "" && (
        <SwiperContainer
          onSwiper={setSwiperRef}
          pagination={true}
          slidesPerView={screenSize.width < 1200 ? 1 : 1.23}
          spaceBetween={screenSize.width < 1200 ? 32 : 16}
          loop={true}
          navigation={{
            nextEl: ".swiper-button-next"
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false
          }}
          onPaginationUpdate={paginationUpdate}
          className="mySwiper"
        >
          {bannerList.map((item, index) => (
            <SwiperSlide key={index} onClick={() => goOpenUrl(item.jumpUrl)}>
              {/* <Image src={item.imgUrl} alt={item.title} layout="fill" objectFit="cover" priority /> */}
              <img src={item.imgUrl} alt={item.title} />
            </SwiperSlide>
          ))}
          {bannerList.length > 0 && <div className="swiper-button-next"></div>}
        </SwiperContainer>
      )}

      {screenSize.width < 1200 && (
        <PaginationWrap>
          {bannerList?.map((item, index) => {
            return (
              <div
                className={`pagination-item ${index === realIndex ? "pagination-item-active" : ""}`}
                onClick={() => changeSlider(index)}
                key={index}
              ></div>
            );
          })}
        </PaginationWrap>
      )}
    </SlideWarp>
  );
};

export default Slide;
