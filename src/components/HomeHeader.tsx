import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import LanguageExchangeSelect from "./language&Exchange/index";
import DownloadApp from "./DownloadApp";
import Orders from "./Orders";
import UserCenter from "./UserCenter";
import Menu from "./Menu";
import LoginedPanel from "./Menu/LoginedPanel";
import { useAppDispatch, useAppSelector } from "../store/hook";
import { hostReplace } from "../utils/utils";
import { useTranslation } from "next-i18next";
import { ReactComponent as Logo } from "/public/images/SVG/home-logo.svg";
import Link from "next/link";
import _ from "lodash";
import ChangeSize from "../hooks/useClientSize";
import Image from "next/image";
import dayjs from "dayjs";
import { useRouter } from "next/router";
import { setFromPath } from "../store/modules/appSlice";

type MenuItem = {
  id: number;
  href: string;
  as?: string;
  isActive: boolean;
  text: string;
  disable?: boolean;
};

const Header = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  padding: 0 5px 0 12px;
  z-index: 90;
  display: flex;
  transition: all 0.2s;
  -moz-user-select: none; /*火狐*/
  -webkit-user-select: none; /*webkit浏览器*/
  -ms-user-select: none; /*IE10*/
  -khtml-user-select: none; /*早期浏览器*/
  user-select: none;
  justify-content: space-between;
  ${({ theme }) => theme.mediaQueries.md} {
    padding: 0 16px 0 32px;
    align-items: center;
    min-width: 1200px;
  }
`;

const LeftSide = styled.aside`
  height: 100%;
  display: flex;
  align-items: center;
  ul {
    display: none;
  }
  ${({ theme }) => theme.mediaQueries.md} {
    .logo {
      width: 110px;
      height: 32px;
      cursor: pointer;
    }
    ul {
      padding-left: 24px;
      height: 100%;
      display: flex;
      li {
        height: 100%;
        a {
          display: block;
          height: 100%;
          padding: 0 16px;
          font-size: 16px;
          font-weight: 500;
          color: #ffffff;
          line-height: 56px;
          &:hover {
            color: #20A3B5;
          }
          &.active {
            position: relative;
            color: #20A3B5;
          }
          &.active:before {
            content: " ";
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 20px;
            height: 3px;
            background: #20A3B5;
            transform: translate(-50%, 0);
          }
        }
      }
    }
  }
`;
const RightSide = styled.aside`
  height: 100%;
  display: flex;
  align-items: center;
`;
const Btn = styled.div`
  box-sizing: border-box;
  display: block;
  width: 80px;
  height: 32px;
  border-radius: 2px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    opacity: 0.6;
  }
`;
const LoginBtn = styled(Btn)`
  background: rgba(31, 24, 48, 0.25);
  border-radius: 2px;
  border: 1px solid rgba(31, 24, 48, 0.25);
  // border: 1px solid #6024fd;
`;
const RegisterBtn = styled(Btn)`
  margin-left: 10px;
  background: #20A3B5;
  ${({ theme }) => theme.mediaQueries.md} {
    margin-left: 16px;
  }
`;

const IsLogined = styled.div`
  display: none;
  ${({ theme }) => theme.mediaQueries.md} {
    display: flex;
  }
`;

const HomeHeader = ({ bgColor }: { bgColor?: string }) => {
  const router = useRouter();
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const [host, setHost] = useState<string>("");
  // const [scrollTop, setScrollTop] = useState<number>(0);
  const { isReady, locale, defaultLocale, pathname, asPath, replace } = useRouter();
  const dispatch = useAppDispatch();

  const HeaderRef = useRef(null);

  const { t } = useTranslation(["common"]);

  let size = ChangeSize();

  const handleScroll = (e) => {
    if (!HeaderRef.current) return;
    // background: ${({ bgColor, top }) =>
    // bgColor ? bgColor : `rgba(19, 15, 29, ${Math.floor(top / 2)})`};
    let top = e.srcElement.scrollingElement.scrollTop;
    HeaderRef.current.style.background =
      size.width < 1200
        ? "rgba(19, 15, 29, 1)"
        : bgColor
        ? bgColor
        : `rgba(19, 15, 29, ${Math.floor(top / 2)})`;
  };

  useEffect(() => {
    setHost(hostReplace());
    window.addEventListener("scroll", _.throttle(handleScroll, 800));
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (size.width < 1200) {
      HeaderRef.current.style.background = `rgba(19, 15, 29, 1)`;
    } else {
      HeaderRef.current.style.background = bgColor ? bgColor : `rgba(19, 15, 29, 0)`;
    }
  }, [size]);

  const menuItems: MenuItem[] = [
    // {
    //   id: 0,
    //   href: "/spot/[[...id]]",
    //   as: "/spot/BTC_USDT",
    //   isActive: router.asPath.indexOf("/spot/") !== -1,
    //   text: t("SpotTrade"),
    //   disable: false
    // },
    // {
    //   id: 1,
    //   href: "/contract/[[...id]]",
    //   as: "/contract/BTC_USDT",
    //   isActive: router.asPath.indexOf("/contract/") !== -1 && router.asPath.indexOf("-R") === -1,
    //   text: t("UsdtContract"),
    //   disable: false
    // },
    // {
    //   id: 2,
    //   href: "/contract/[[...id]]",
    //   as: "/contract/BTC_USD-R",
    //   isActive: router.asPath.indexOf("/contract/") !== -1 && router.asPath.indexOf("-R") !== -1,
    //   text: t("UsdtrContract"),
    //   disable: false
    // },
    // {
    //   id: 3,
    //   href: "/contractMarket",
    //   as: "",
    //   isActive: router.asPath.indexOf("/contractMarket") !== -1,
    //   text: t("ContractInfo"),
    //   disable: false
    // },
    {
      id: 4,
      href: "/finance/crypto_fixed_return",
      as: "",
      isActive:
        router.asPath.indexOf("/finance/crypto_fixed_return") !== -1 ||
        router.asPath.indexOf("/fm/regular") !== -1,
      text: t("FmTitle"),
      disable: false
    },
    {
      id: 5,
      href: `https://${host}/invite`,
      as: "",
      isActive: router.asPath.indexOf("invite") !== -1,
      text: t("InviteReturn"),
      disable: !isLogin
    }
  ];

  const setFromPathF = () => {
    if (asPath !== '/login' && asPath !== '/register') {
      dispatch(setFromPath(asPath))
    }
  }

  return (
    <Header ref={HeaderRef}>
      <LeftSide>
        <Link href="/">
          {/* <Logo className="logo" /> */}
          <Image
            className="logo"
            src="/images/home/logo_R.png"
            alt="CCFOX"
            width={110}
            height={32}
            priority
          />
        </Link>
        <ul>
          {menuItems.map(
            (item: MenuItem) =>
              !item.disable && (
                <li key={item.id}>
                  {/* 通过 http 开头，来判断是否外链，因为外链不能使用 Link */}
                  {item.href.startsWith("http") ? (
                    <a href={item.href} className={item.isActive ? "active" : ""}>
                      {item.text}
                    </a>
                  ) : (
                    <Link href={item.href} as={item.as}>
                      <a className={item.isActive ? "active" : ""}>{item.text}</a>
                    </Link>
                  )}
                </li>
              )
          )}
        </ul>
      </LeftSide>
      <RightSide>
        {isLogin ? (
          <IsLogined>
            <UserCenter />
            <Orders />
          </IsLogined>
        ) : (
          <>
            <Link href={`/login`}>
              <LoginBtn onClick={setFromPathF}>{t("Login")}</LoginBtn>
            </Link>
            <Link href={`/register`}>
              <RegisterBtn onClick={setFromPathF}>{t("Register")}</RegisterBtn>
            </Link>
          </>
        )}
        {/* <DownloadApp /> */}
        <LanguageExchangeSelect />
        {isLogin && <LoginedPanel />}
        <Menu />
      </RightSide>
    </Header>
  );
};

export default HomeHeader;
