import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Login from "./Login";
import Register from "./Register";
import BuyCoin from "./BuyCoin";
import { useAppSelector } from "../../../store/hook";
import { useTranslation } from "next-i18next";

const CardWarp = styled.div`
  width: 400px;
  height: 376px;
  background: #ffffff;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  margin-top: 128px;
  position: relative;
`;

const BgWrap = styled.div`
  width: 463px;
  height: 439px;
  // background: url("/images/home/login_chris_bg.png") no-repeat;
  // background-size: 100% 100%;
  position: absolute;
  top: -43px;
  left: -35px;
`;

const ContentWrap = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 2;
`;

const CardHeader = styled.div`
  height: 63px;
  padding: 0 24px;
  border-bottom: 1px solid #f6f6f6;
  display: flex;
`;
const CardBtn = styled.section<{ active: boolean }>`
  padding: 0 16px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  span {
    height: 60px;
    font-size: 18px;
    font-weight: 600;
    line-height: 64px;
    color: ${({ active }) => (active ? "#6024FD" : "#220A60")};
  }
  i {
    width: 36px;
    height: 3px;
    background: #6024fd;
    border-radius: 2px;
    display: ${({ active }) => (active ? "block" : "none")};
  }
`;

const Card = () => {
  const [curTab, setCurTab] = useState<string>("login");
  const [regStatus, setRegStatus] = useState<boolean>(true);
  const { t } = useTranslation();

  const isLogin = useAppSelector((state) => state.app.isLogin);

  // console.log('Card', isLogin, regStatus)
  return (
    <CardWarp>
      {/* <BgWrap>
        <img src="/images/home/login_chris_bg.png" alt="" />
      </BgWrap> */}

      <ContentWrap>
        {!isLogin || !regStatus ? (
          <>
            {!isLogin && (
              <CardHeader>
                <CardBtn active={curTab === "login"} onClick={() => setCurTab("login")}>
                  <span>{t("Login")}</span>
                  <i></i>
                </CardBtn>
                <CardBtn active={curTab === "register"} onClick={() => setCurTab("register")}>
                  <span>{t("Register")}</span>
                  <i></i>
                </CardBtn>
              </CardHeader>
            )}
            {curTab === "login" ? (
              <Login changeRegStatus={(status) => setRegStatus(status)} />
            ) : (
              <Register changeRegStatus={(status) => setRegStatus(status)} />
            )}
          </>
        ) : (
          <BuyCoin />
        )}
      </ContentWrap>
    </CardWarp>
  );
};

export default Card;
