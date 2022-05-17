import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Button } from "@ccfoxweb/uikit";
import { ReactComponent as AndroidI } from "/public/images/SVG/Android.svg";
import { ReactComponent as Google } from "/public/images/SVG/Google_icon.svg";
import { ReactComponent as Iphone } from "/public/images/SVG/iphone.svg";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../store/hook";

const Buttons = styled(Flex)<{ posi? }>`
  width: 100%;
  height: 116px;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.3) 100%);
  justify-content: center;
  position: ${({ posi }) => posi};
  bottom: 0;
  left: 0;
  right: 0;
  padding: 0 12px;
  z-index: 10;

  ${({ theme }) => theme.mediaQueries.md} {
    display: none;
  }
`;
const Inner = styled(Flex)<{ bg? }>`
  width: 100%;
  max-width: 366px;
  height: 52px;
  background: ${({ bg }) => bg || "#FFFFFF"};
  box-shadow: ${({ bg }) => (bg ? "" : "0px 8px 24px 0px rgba(0, 0, 0, 0.3)")};
  border-radius: 8px;
  padding: 0 6px;
`;

const Item = styled.div<{ bg?; c?; h? }>`
  flex: 1;
  margin-right: 6px;
  height: ${({ h }) => h || "40px"};
  line-height: ${({ h }) => h || "40px"};
  text-align: center;
  border-radius: 4px;
  background: ${({ bg }) => bg};
  color: ${({ c }) => c};
`;

const DownloadBtn = styled(Button)`
  // border: none;
  // &:hover{
  //   border: none;
  // }
  border-radius: 8px;
  padding: 0;
`;

const AndroidBtn = styled(Flex)`
  justify-content: space-between;
`;

const AndroidInner = styled(Flex)`
  flex-direction: column;
  margin-left: 8px;
  align-items: flex-start;
  span.t {
    font-size: 12px;
    font-weight: 400;
    color: #220a60;
    line-height: 15px;
  }
  span.b {
    font-size: 16px;
    font-weight: bold;
    color: #220a60;
    line-height: 21px;
  }
`;

const buttons = (props) => {
  const [DeviceF, setDeviceF] = useState(true);
  const { t } = useTranslation();
  const userHabit = useAppSelector((state) => state.app.userHabit);

  const versionObj = useAppSelector((state) => state.app.versionObj);
  const apk_native_url =
    "https://ccfox-sz-1304819207.cos.ap-guangzhou.myqcloud.com/android/ccfox-android-native.apk";

  const IOS = [
    {
      t: t("DownloadPage8"),
      bg: "secondary",
      // url: `https://journeynes.com/cg4c3vMn.html`
      url: `${versionObj?.mobileUrl}/download/ios?locale=${userHabit?.locale}`
    },
    {
      t: t("DownloadPage9"),
      bg: "primary",
      url: "https://testflight.apple.com/join/ytP8snP1"
    }
  ];

  const Android = [
    {
      t: "Android APK",
      bg: "secondary",
      url: apk_native_url
    }
  ];
  // ,{
  //   t: 'Google Play',
  //   bg: 'secondary',
  // }

  useEffect(() => {
    setDeviceF(!isAndroid());
  }, []);

  const isAndroid = () => {
    //判断用户手机类型
    const u = navigator.userAgent;
    // app = navigator.appVersion;
    const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1; //安卓终端
    //   var isIOS = !!u.match(/(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      //判断为安卓手机
      return true;
    }
    return false;
  };
  const gotoIos = (v) => {
    let myWindow = window.open(v);
    myWindow.opener = null;
  };

  const gotoAndroid = (v) => {
    // let myWindow = window.open(v);
    // myWindow.opener = null;
    window.location.href = v;
  };
  return (
    <Buttons posi={props.posi || "fixed"}>
      <Inner bg={DeviceF ? "transparent" : "transparent"}>
        {DeviceF ? (
          <>
            {IOS.map((e, i) => {
              return (
                <DownloadBtn
                  scale={"md"}
                  border={"none"}
                  width="100%"
                  mr={i === 0 ? "6px" : 0}
                  key={i}
                  variant={e.bg}
                  onClick={() => gotoIos(e.url)}
                >
                  {e.t}
                </DownloadBtn>
              );
            })}
            {/* {
            IOS.map((e, i) => {
              return <DownloadBtn width="100%" key={i} variant={e.bg} mr={i===0 ? '12px' : 0} onClick={gotoIos}>
                <AndroidBtn>
                  <Iphone width={32} height={32} />
                  <AndroidInner>
                    <span className="b">{e.t}<          /span>
                  </AndroidInner>
                </AndroidBtn>
              </DownloadBtn>
            })
          } */}
          </>
        ) : (
          <>
            {Android.map((e, i) => {
              return (
                <DownloadBtn
                  width="100%"
                  key={i}
                  variant={e.bg}
                  mr={i === 0 ? "12px" : 0}
                  onClick={() => gotoAndroid(e.url)}
                >
                  <AndroidBtn>
                    {!i ? <AndroidI width={32} height={32} /> : <Google width={32} height={32} />}
                    <AndroidInner>
                      <span className="t">Download for</span>
                      <span className="b">{e.t}</span>
                    </AndroidInner>
                  </AndroidBtn>
                </DownloadBtn>
              );
            })}
          </>
        )}
      </Inner>
    </Buttons>
  );
};

export default buttons;
