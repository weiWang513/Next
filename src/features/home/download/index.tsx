import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import QRCode from "../../../components/DownloadApp/QRCode";
import { useAppSelector } from "../../../store/hook";
import { useTranslation } from "next-i18next";
import { ReactComponent as Iphone } from "/public/images/SVG/iphone.svg";
import { ReactComponent as Android } from "/public/images/SVG/Android.svg";
import ChangeSize from "../../../hooks/useClientSize";
import Buttons from "../../download/Buttons";
import _ from "lodash";
import Image from "next/image";

const DownloadWarp = styled.div`
  width: 100%;
  background: #6024fd;
`;
const DownloadCenter = styled.div`
  width: 1200px;
  height: 440px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  & > div {
    position: absolute;
  }
  .rt {
    width: 476px;
    height: 391px;
    top: -24px;
    right: -100px;
    transition: all 0.8s ease;
    transform: translate(20px, -20px);
    opacity: 0;
    &.animate {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }
  .rb {
    width: 499px;
    height: 400px;
    bottom: -200px;
    right: 16px;
    transition: all 0.6s ease 0.4s;
    transform: translate(20px, 20px);
    opacity: 0;
    &.animate {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }
  .lb {
    width: 499px;
    height: 400px;
    bottom: -280px;
    left: 96px;
    transition: all 0.6s ease 0.8s;
    transform: translate(-20px, -20px);
    opacity: 0;
    &.animate {
      transform: translate(0px, 0px);
      opacity: 1;
    }
  }
  .ct {
    width: 554px;
    height: 392px;
    bottom: -26px;
    left: 430px;
    transition: opacity 0.8s ease 1.2s;
    // transform: translateY(20px);
    opacity: 0;
    &.animate {
      animation: 4s linear 2s infinite alternate wave;
      transform: translateY(0px);
      opacity: 1;
    }
  }

  @keyframes wave {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
`;
const LeftSide = styled.aside`
  display: flex;
  flex-direction: column;
  & > h2 {
    font-size: 32px;
    font-weight: 600;
    color: #ffffff;
    line-height: 44px;
  }
  & > p {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
  }
  & > i {
    width: 36px;
    height: 6px;
    background: #ffffff;
    margin-top: 32px;
  }
  & > section {
    display: flex;
    margin-top: 48px;
    & > aside {
      width: 104px;
      height: 104px;
      background: #ffffff;
      border-radius: 4px;
      overflow: hidden;
    }
    & > div {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .download-block {
        display: flex;
        padding: 10px 16px;
        width: 156px;
        background: #ffffff;
        border-radius: 4px;
        aside {
          width: 24px;
          height: 24px;
        }
        div {
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          p {
            font-size: 10px;
            font-weight: 400;
            color: #130f1d;
            line-height: 10px;
          }
          span {
            font-size: 16px;
            font-weight: bold;
            color: #130f1d;
            line-height: 20px;
          }
        }
      }
    }
  }
`;
const DownloadAdapWarp = styled.div`
  width: 100%;
  background: #6024fd;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  & > h2 {
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    padding: 44px 10px;
  }
  & > p {
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
    padding: 0 24px;
  }
  & > i {
    width: 36px;
    height: 6px;
    background: #ffffff;
    margin-top: 16px;
  }
  .download-img {
    margin-top: 26px;
    width: 414px;
    height: 365px;
    overflow: hidden;
    // background: url("/images/download/swip0.png") no-repeat center;
    img{
      width: 414px !important;
      height: 513px !important;
      max-width: 414px !important;
      max-height: 513px !important;
    }
  }
  .download-more {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    & > span {
      font-size: 12px;
      font-weight: 500;
      color: #ffffff;
    }
  }
  & > section {
    display: flex;
    margin-bottom: 27px;
    margin-top: -75px;
    & > aside {
      width: 104px;
      height: 104px;
      background: #ffffff;
      border-radius: 4px;
      overflow: hidden;
    }
    & > div {
      margin-left: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      .download-block {
        display: flex;
        padding: 10px 16px;
        width: 159px;
        background: #ffffff;
        border-radius: 4px;
        div {
          margin-left: 19px;
          display: flex;
          flex-direction: column;
          p {
            font-size: 10px;
            font-weight: 400;
            color: #130f1d;
            line-height: 11px;
          }
          span {
            font-size: 16px;
            font-weight: bold;
            color: #130f1d;
            line-height: 19px;
          }
        }
      }
    }
  }
`;
const Download = ({}) => {
  const versionObj = useAppSelector((state) => state.app.versionObj);
  const [animateStart, setAnimateStart] = useState<boolean>(false);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const [scrollTop, setScrollTop] = useState<number>(0);
  const { t } = useTranslation();

  const handleScroll = (e) => {
    setScrollTop(e.srcElement.scrollingElement.scrollTop);
  };

  useEffect(() => {
    window.addEventListener("scroll", _.throttle(handleScroll, 800));

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollTop >= 680) {
      setAnimateStart(true);
    }
  }, [scrollTop]);
  let size = ChangeSize();
  useEffect(() => {}, [size]);
  return (
    <>
      {size.width > 767 ? (
        <DownloadWarp>
          <DownloadCenter>
            <div className={`rt  ${animateStart ? "animate" : ""}`}>
              <img
                src={
                  userHabit.locale.indexOf("zh") > -1
                    ? "/images/home/phone-rt.png"
                    : "/images/home/phone-rt-en.png"
                }
                alt=""
              />
              {/* <Image
                src={
                  userHabit.locale.indexOf("zh") > -1
                    ? "/images/home/phone-rt.png"
                    : "/images/home/phone-rt-en.png"
                }
                alt=""
                layout="fill"
                objectFit="cover"
              /> */}
            </div>
            <div className={`rb ${animateStart ? "animate" : ""}`}>
              <img
                src={
                  userHabit.locale.indexOf("zh") > -1
                    ? "/images/home/phone-rb.png"
                    : "/images/home/phone-rb-en.png"
                }
                alt=""
              />
              {/* <Image
                src={
                  userHabit.locale.indexOf("zh") > -1
                    ? "/images/home/phone-rb.png"
                    : "/images/home/phone-rb-en.png"
                }
                alt=""
                layout="fill"
                objectFit="cover"
              /> */}
            </div>
            <div className={`lb ${animateStart ? "animate" : ""}`}>
              <img
                src={
                  userHabit.locale.indexOf("zh") > -1
                    ? "/images/home/phone-lb.png"
                    : "/images/home/phone-lb-en.png"
                }
                alt=""
              />
              {/* <Image
                src={
                  userHabit.locale.indexOf("zh") > -1
                    ? "/images/home/phone-lb.png"
                    : "/images/home/phone-lb-en.png"
                }
                alt=""
                layout="fill"
                objectFit="cover"
              /> */}
            </div>
            <div className={`ct ${animateStart ? "animate" : ""}`}>
              <img
                src={
                  userHabit.locale.indexOf("zh") > -1
                    ? "/images/home/phone-ct.png"
                    : "/images/home/phone-ct-en.png"
                }
                alt=""
              />
              {/* <Image
                src={
                  userHabit.locale.indexOf("zh") > -1
                    ? "/images/home/phone-ct.png"
                    : "/images/home/phone-ct-en.png"
                }
                alt=""
                layout="fill"
                objectFit="cover"
              /> */}
            </div>
            <LeftSide>
              <h2>{t("DownloadTitle")}</h2>
              <p>{t("DownloadDesc")}</p>
              <i></i>
              <section>
                <aside>
                  {/* @ts-ignore */}
                  <QRCode url={`${window.location.origin}/${userHabit.locale}/download`} />
                </aside>
                <div>
                  <section className="download-block">
                    <aside>
                      <Iphone />
                    </aside>
                    <div>
                      <p>Download for</p>
                      <span>iPhone</span>
                    </div>
                  </section>
                  <section className="download-block">
                    <aside>
                      <Android />
                    </aside>
                    <div>
                      <p>Download for</p>
                      <span>Android</span>
                    </div>
                  </section>
                </div>
              </section>
            </LeftSide>
          </DownloadCenter>
        </DownloadWarp>
      ) : (
        <DownloadAdapWarp>
          <h2>{t("DownloadTitle")}</h2>
          <p>{t("DownloadDesc")}</p>
          <i></i>
          <div className="download-img">
            <img src="/images/download/m-swip0.png" width='414px' height='513px' alt="" />
          </div>
          <Buttons posi='absolute' />
          {/* <section>
            <aside> */}
              {/* @ts-ignore */}
              {/* <QRCode url={`${versionObj?.mobileUrl}/download?locale=${userHabit.locale}`} />
            </aside>
            <div>
              <section className="download-block">
                <Image src={"/images/home/ios-icon.png"} alt="ios" width={26} height={26} />
                <div>
                  <p>Download for</p>
                  <span>iPhone</span>
                </div>
              </section>
              <section className="download-block">
                <Image src={"/images/home/Android-icon.png"} alt="Android" width={26} height={26} />
                <div>
                  <p>Download for</p>
                  <span>Android</span>
                </div>
              </section>
            </div>
          </section> */}
          {/* <div className="download-more">
            <span>{t("downloadMoreCHanel")}</span>
            <Image
              src={"/images/home/more.png"}
              alt="more download chanel"
              width={24}
              height={24}
            />
          </div> */}
        </DownloadAdapWarp>
      )}
    </>
  );
};

export default Download;
