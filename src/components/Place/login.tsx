import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Flex, Button, useModal } from "@ccfoxweb/uikit";
import { useTranslation } from "next-i18next";
import Link from "next/link";
const LoginArea = styled(Flex)`
  width: 100%;
  justify-content: center;
`;

const Login = styled(Flex)`
  flex-direction: column;
  width: 288px;
  margin-top: 20px;
`;

const LoginT = styled(Flex)`
  flex-direction: column;
  height: 42px;
  margin-bottom: 16px;
  span {
    font-weight: 600;
    color: rgba(97, 89, 118, 1);
    line-height: 22px;
    font-size: 14px;
  }
  span.t {
    color: #fff;
    font-size: 16px;
  }
`;

const BtnWarp = styled(Flex)`
  flex-direction: ${({ flexd }) => flexd};
`;

const login = (props) => {
  const gotoRegister = () => {};
  const { t } = useTranslation();
  const gotoLogin = () => {};
  return (
    <LoginArea mt={props?.isPosiArea ? "140px" : ""}>
      <Login>
        <LoginT>
          <span className="t">{t("notLogged")}</span>
          <span>{t("PlsLogin")}</span>
        </LoginT>
        <BtnWarp flexd={props?.isPosiArea ? "row" : "column"}>
          <Link href="/register">
            <Button
              width="100%"
              mb={props?.isPosiArea ? 0 : "8px"}
              mr={props?.isPosiArea ? "16px" : 0}
              variant={"primary"}
              scale={"md"}
              isDark={true}
              onClick={gotoRegister}
            >
              {t("FastRegister")}
            </Button>
          </Link>
          <Link href="/login">
            <Button
              width="100%"
              variant={"secondary"}
              scale={"md"}
              isDark={true}
              onClick={gotoLogin}
            >
              {t("Login")}
            </Button>
          </Link>
        </BtnWarp>
      </Login>
    </LoginArea>
  );
};

export default login;
