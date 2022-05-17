import React, { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../store/hook";
import { tradingData, queryCandlesticks } from "../../../services/api/home";
import useInterval from "../../../hooks/useInterval";
import { Skeleton } from "@ccfoxweb/uikit";
import { queryIndicatorList } from "../../../services/api/contract";

import Card from "./Card";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// import Swiper core and required modules
import SwiperCore, { Pagination, Navigation, Autoplay } from "swiper";

// install Swiper modules
SwiperCore.use([Pagination, Navigation, Autoplay]);
import ChangeSize from "../../../hooks/useClientSize";

// Import Swiper styles
// import "swiper/components/navigation/navigation.min.css";

const ChartWarp = styled.div<{ screenSzie?: { width; height } }>`
  height: ${({ screenSzie }) => (screenSzie.width > 1200 ? "129px" : "104px")};
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
`;
const SwiperContainer = styled(Swiper)`
  width: 100%;
  height: 100%;
  :hover {
    .swiper-navigation-next,
    .swiper-navigation-pre {
      opacity: 1;
    }
  }
  .swiper-slide {
    display: flex;
    justify-content: center;
    align-items: center;
    :after {
      content: "";
      position: absolute;
      width: 1px;
      height: 42px;
      background: #f5f3fb;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
`;

const SwiperNavNext = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  background: url("/images/SVG/indictorArrowRight.svg");
  :hover {
    background: url("/images/SVG/indictorArrowRightActive.svg");
  }
`;

const SwiperNavPre = styled.div`
  width: 40px;
  height: 40px;
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  cursor: pointer;
  opacity: 0;
  transition: all 0.2s;
  background: url("/images/SVG/indictorArrowLeft.svg");
  :hover {
    background: url("/images/SVG/indictorArrowLeftActive.svg");
  }
`;

const Loading = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 33;
`;

const ContractChart = () => {
  const swiperContainer = useRef(null);
  const [swiperRef, setSwiperRef] = useState(null);
  const [tradingDataList, setTradingDataList] = useState([]);
  const [candlesticksList, setCandlesticksList] = useState([]);
  const [indictorList, setIndictorList] = useState([]);
  const [slidesPerView, setSlidesPerView] = useState(5);

  const contractList = useAppSelector((state) => state.contract.contractBasicList);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  // const indictorList = useAppSelector((state) => state.contract.indictorList);

  const startAuto = () => {
    swiperRef?.autoplay?.start();
  };

  const stopAuto = () => {
    swiperRef?.autoplay?.stop();
  };

  const _slidePre = () => swiperRef.slideNext();

  const _slideNext = () => swiperRef.slideNext();

  let screenSzie = ChangeSize();

  const getData = () => {
    if (!contractList.length) return;

    tradingData().then((res) => {
      // console.log(res, "tradingData");
      if (res?.data?.code === 0) {
        let data = res.data.data;
        setTradingDataList(data);
      }
    });

    let contracts = contractList
      ?.filter((el: any) => (userHabit.locale === "zh_CN" ? el.contractId !== 999999 : true))
      .map((el: any) => el.contractId);
    let params = {
      range: "86400000",
      point: 200,
      contracts: contracts.join()
    };
    queryCandlesticks(params).then((res) => {
      // console.log(res, "tradingData");
      let data = res?.data?.data || [];
      setCandlesticksList(data);
    });

    queryIndicatorList().then((res) => {
      setIndictorList(res?.data || []);
    });
  };

  useInterval(getData, 60 * 1000, false);

  useEffect(() => {
    swiperRef && swiperContainer?.current?.addEventListener("mouseenter", stopAuto);
    swiperRef && swiperContainer?.current?.addEventListener("mouseleave", startAuto);

    return () => {
      swiperRef && swiperContainer?.current?.removeEventListener("mouseenter", stopAuto);
      swiperRef && swiperContainer?.current?.removeEventListener("mouseleave", startAuto);
    };
  }, [swiperContainer, swiperRef]);

  useEffect(() => {
    getData();
  }, [contractList]);

  useEffect(() => {
    let width = screenSzie?.width || 1000;

    if (width > 1200) {
      setSlidesPerView(5);
    } else {
      let num = Math.floor((width - 22) / 130);

      setSlidesPerView(num);
    }
  }, [screenSzie]);

  return (
    <ChartWarp ref={swiperContainer} screenSzie={screenSzie}>
      <SwiperContainer
        onSwiper={setSwiperRef}
        slidesPerView={slidesPerView}
        navigation={{
          nextEl: ".swiper-navigation-next",
          prevEl: ".swiper-navigation-pre"
        }}
        className="mySwiper"
        loop={true}
        autoplay={{
          delay: 2500
        }}
      >
        <SwiperNavPre className="swiper-navigation-pre" onClick={_slidePre} />

        <SwiperNavNext className="swiper-navigation-next" onClick={_slideNext} />
        {contractList
          ?.filter((el: any) => (userHabit.locale === "zh_CN" ? el.contractId !== 999999 : true))
          ?.map((el: any) => {
            return (
              <SwiperSlide key={el?.contractId}>
                <Card
                  item={el}
                  screenSzie={screenSzie}
                  tradingData={tradingDataList?.find((item) => item?.contractId === el?.contractId)}
                  candlesticksItem={
                    candlesticksList.find((item) => item?.contractId === el?.contractId) || {}
                  }
                  pcr={indictorList.find((item) => item?.ci === el?.contractId)?.pcr24 || 0}
                />
              </SwiperSlide>
            );
          })}
      </SwiperContainer>
    </ChartWarp>
  );
};

export default ContractChart;
