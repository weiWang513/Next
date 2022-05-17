import React, { useState, ChangeEvent } from "react";
import styled from "styled-components";
import { Button, InputGroup, Input } from "@ccfoxweb/uikit";
import { usernameReg } from "../../../contants/reg";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "../../../store/hook";
import { useRouter } from "next/router";

const TravelWarp = styled.div`
  height: 250px;
  background: #f5f3fb;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding:0 24px;
  & > h2 {
    font-size: 24px;
    font-weight: 600;
    color: #220a60;
    line-height: 33px;
    ${({ theme }) => theme.mediaQueries.md}{
        font-size: 32px;
        font-weight: 600;
        color: #220a60;
        line-height: 44px;
    }
  }
  & > div {
    width:100%;
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    ${({ theme }) => theme.mediaQueries.md}{
      display: flex;
      flex-direction: row;
      margin-top: 32px;
    }
    aside {
      width: 100%;
      height: 48px;
      ${({ theme }) => theme.mediaQueries.md}{
        width: 497px;
        height: 48px;
      }
    }
    .seat{
      width:1px;
      height:16px;
    }
    span {
      width: 100%;
      height: 48px;
      margin-left:0;
      ${({ theme }) => theme.mediaQueries.md} {
        width: 126px;
        margin-left: 16px;
      }
      & > button {
        width:100%;
        ${({ theme }) => theme.mediaQueries.md} {
          width:130px;
        }
      }
    }
  }
`;
const StartTravel = () => {
  const [username, setUsername] = useState<string>("");
  const { t } = useTranslation();

  const { push } = useRouter();

  const isLogin = useAppSelector((state) => state.app.isLogin);
  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    if (value.length > 32) {
      value = value.slice(0, 32);
    }
    setUsername(value.trim());
  };

  const goRegister = () => {
    if (usernameReg.test(username)) {
      push(`/register?username=${username}`);
      // window.location.href = `/register?username=${username}`;
    } else {
      push(`/register`);
      // window.location.href = `/register`;
    }
  };

  return (
    <>
      {!isLogin ? (
        <TravelWarp>
          <h2>{t("StartTravel")}</h2>
          <div>
            <aside>
              <InputGroup
                hasClear={!!username}
                clearClick={() => setUsername("")}
              >
                <Input
                  type="text"
                  scale={"md"}
                  placeholder={t("LoginAccount")}
                  value={username}
                  onChange={handleUsernameChange}
                />
              </InputGroup>
            </aside>
            <span className="seat"></span>
            <span>
              <Button variant={"primary"} onClick={goRegister}>
                {t("Register")}
              </Button>
            </span>
          </div>
        </TravelWarp>
      ) : null}
    </>
  );
};

export default StartTravel;
