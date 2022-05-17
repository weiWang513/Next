import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import HomeHeader from "../../components/HomeHeader";
import LoginFooter from "../../components/LoginFooter";
import { Button, InputGroup, Input, useTooltip, message } from "@ccfoxweb/uikit";
import {
  login,
  getCertInfo,
  queryUserInfo,
  updateUserLanguage,
  getVerifyCodeBeforeAuth
} from "../../services/api/user";
import { desensitization } from "../../utils/utils";
import { useAppDispatch } from "../../store/hook";
import {
  setIsLogin,
  setUserInfo,
  setCertInfo,
  setUserLoginInfo
} from "../../store/modules/appSlice";
import { useAppSelector } from "../../store/hook";
import { setInjectInfo, getInjectInfo } from "../../functions/info";
import { useTranslation } from "next-i18next";
import useInit from "../../hooks/useInit";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CommonHead from "../../components/Head/CommonHead";

const PageContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  min-height: 700px;
  padding-bottom: 64px;
  background-color: #4700cd;
  background-image: url("/images/home/login-bg.png");
  background-size: cover;
`;
const PageCenter = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  // padding-top: 100px;
  padding: 100px 10px 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  & > h6 {
    font-size: 32px;
    font-weight: 600;
    color: #ffffff;
    line-height: 44px;
    text-align: center;
  }
  & > p {
    padding-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #ffffff;
    line-height: 20px;
    text-align: center;
  }
  ${({ theme }) => theme.mediaQueries.sm} {
    width: 400px;
    max-width: 400px;
  }
`;
const CardWarp = styled.div`
  width: 100%;
  padding: 24px;
  margin-top: 32px;
  background: #ffffff;
  box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
  ${({ theme }) => theme.mediaQueries.sm} {
    padding: 40px 40px 32px;
  }
`;
const ErrorMsg = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
`;
const TypeWarp = styled.div`
  & + div {
    margin-top: 24px;
  }
`;
const LabelRow = styled.section`
  height: 22px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  & > .type-text {
    font-size: 16px;
    font-weight: 600;
    color: #625488;
  }
  & > .send-text {
    font-size: 12px;
    font-weight: 500;
    color: #aaa4bb;
  }
`;
const CodeTextWarp = styled.aside`
  padding-left: 16px;
  border-left: 1px solid #e6e3f0;
  display: flex;
  align-items: center;
  & > span {
    font-size: 14px;
    font-weight: 600;
    color: #aaa4bb;
  }
`;

const Device = () => {
  const [submiting, setSubmiting] = useState<boolean>(false);
  // const [hasGeetest, setHasGeetest] = useState<boolean>(false)
  const dispatch = useAppDispatch();
  const userLoginInfo = useAppSelector((state) => state.app.userLoginInfo);
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { t } = useTranslation();
  const { init } = useInit();
  const router = useRouter();

  const [googleCode, setGoogleCode] = useState<string>("");
  const [googleCodeError, setGoogleCodeError] = useState<boolean>(false);

  const [waitSendPhone, setWaitSendPhone] = useState<boolean>(false);
  const [totalTimePhone, setTotalTimePhone] = useState<number>(60);
  const [waitSendEmail, setWaitSendEmail] = useState<boolean>(false);
  const [totalTimeEmail, setTotalTimeEmail] = useState<number>(60);
  const [codePhone, setCodePhone] = useState<string>("");
  const [codePhoneError, setCodePhoneError] = useState<boolean>(false);
  const [codeEmail, setCodeEmail] = useState<string>("");
  const [codeEmailError, setCodeEmailError] = useState<boolean>(false);
  const fromPath = useAppSelector((state) => state.app.fromPath);
  // const geePhoneRef = useRef(null)
  // const PhoneCheckRef = useRef(null)
  const sendingPhone = useRef(false);
  const timerPhone = useRef(null);
  const totalTimePhoneRef = useRef(60);
  // const geeEmailRef = useRef(null)
  // const EmailCheckRef = useRef(null)
  const sendingEmail = useRef(false);
  const timerEmail = useRef(null);
  const totalTimeEmailRef = useRef(60);


  const {
    tooltipVisible: codePhoneTooltipVisible,
    targetRef: codePhoneTarget,
    tooltip: codePhoneTooltip
  } = useTooltip(<ErrorMsg>{t("CodeMsg")}</ErrorMsg>, {
    placement: "top",
    trigger: "blur",
    isWarning: codePhoneError
  });
  const {
    tooltipVisible: codeEmailTooltipVisible,
    targetRef: codeEmailTarget,
    tooltip: codeEmailTooltip
  } = useTooltip(<ErrorMsg>{t("CodeMsg")}</ErrorMsg>, {
    placement: "top",
    trigger: "blur",
    isWarning: codeEmailError
  });
  const {
    tooltipVisible: googleCodeTooltipVisible,
    targetRef: googleCodeTarget,
    tooltip: googleCodeTooltip
  } = useTooltip(<ErrorMsg>{t("CodeMsg")}</ErrorMsg>, {
    placement: "top",
    trigger: "blur",
    isWarning: googleCodeError
  });

  useEffect(() => {
    init();
    // PhoneCheckRef.current = sendPhoneMsg;
    // EmailCheckRef.current = sendEmailMsg;
    // if (!hasGeetest) {
    //   new myGeetest({
    //     containerId: "phone-code-btn",
    //     nextHandle: PhoneCheckRef.current,
    //     closeGee: () => setWaitSendPhone(false),
    //     form: [true],
    //   }).geetestValidate();
    //   new myGeetest({
    //     containerId: "email-code-btn",
    //     nextHandle: EmailCheckRef.current,
    //     closeGee: () => setWaitSendEmail(false),
    //     form: [true],
    //   }).geetestValidate();
    //   setHasGeetest(true);
    // }
    if (!userLoginInfo.username) {
      router.push("/login");
    }
    if (userLoginInfo.phone) {
      sendCodePhone();
    }
    if (userLoginInfo.email) {
      sendCodeEmail();
    }
  }, []);

  useEffect(() => {
    let _from = fromPath ? String(fromPath) : "/"
    if (isLogin) router.replace(_from);
  }, [isLogin]);

  const sendPhoneMsg = () => {
    const params = {
      businessType: "loginPhone",
      receiver: userLoginInfo.phone,
      type: 1,
      hasVerify: 1,
      currentLocale: getInjectInfo("locale")
    };
    getVerifyCodeBeforeAuth(params).then((response) => {
      let res = response.data;
      if (res.code === 0) {
        message.success(t("SentSuccess"));
        countDownPhone();
      }
      setWaitSendPhone(false);
    });
  };
  const countDownPhone = () => {
    sendingPhone.current = true;
    timerPhone.current = setInterval(() => {
      setTotalTimePhone((num) => num - 1);
      totalTimePhoneRef.current = totalTimePhoneRef.current - 1;
      if (totalTimePhoneRef.current > 0) {
      } else {
        sendingPhone.current = false;
        totalTimePhoneRef.current = 60;
        setTotalTimePhone(60);
        clearInterval(timerPhone.current);
      }
    }, 1000);
  };

  const sendEmailMsg = () => {
    const params = {
      businessType: "loginEmail",
      receiver: userLoginInfo.email,
      type: 1,
      hasVerify: 1,
      currentLocale: userHabit.locale
    };
    getVerifyCodeBeforeAuth(params).then((response) => {
      let res = response.data;
      if (res.code === 0) {
        message.success(t("SentSuccess"));
        countDownEmail();
      }
      setWaitSendEmail(false);
    });
  };
  const countDownEmail = () => {
    sendingEmail.current = true;
    timerEmail.current = setInterval(() => {
      setTotalTimeEmail((num) => num - 1);
      totalTimeEmailRef.current = totalTimeEmailRef.current - 1;
      if (totalTimeEmailRef.current > 0) {
      } else {
        sendingEmail.current = false;
        totalTimeEmailRef.current = 60;
        setTotalTimeEmail(60);
        clearInterval(timerEmail.current);
      }
    }, 1000);
  };

  const handleCodePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    setCodePhone(value.trim());
    setCodePhoneError(false);
  };
  const showCodePhoneBlur = () => {
    return codePhoneTooltipVisible
      ? codePhoneTooltipVisible && codePhoneError
      : codePhoneTooltipVisible || codePhoneError;
  };
  const handleCodeEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    setCodeEmail(value.trim());
    setCodeEmailError(false);
  };
  const showCodeEmailBlur = () => {
    return codeEmailTooltipVisible
      ? codeEmailTooltipVisible && codeEmailError
      : codeEmailTooltipVisible || codeEmailError;
  };
  const handleGoogleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    setGoogleCode(value.trim());
    setGoogleCodeError(false);
  };
  const showGoogleCodeBlur = () => {
    return googleCodeTooltipVisible
      ? googleCodeTooltipVisible && googleCodeError
      : googleCodeTooltipVisible || googleCodeError;
  };

  const sendCodePhone = () => {
    setWaitSendPhone(true);
    sendPhoneMsg();
    // geePhoneRef.current.click();
  };
  const sendCodeEmail = () => {
    setWaitSendEmail(true);
    sendEmailMsg();
    // geeEmailRef.current.click();
  };

  // 二次验证 登录
  const submit = () => {
    try {
      const params = {
        ...userLoginInfo,
        phoneBussinessType: userLoginInfo.phone ? "loginPhone" : "",
        phoneCode: codePhone,
        mailBussinessType: userLoginInfo.email ? "loginEmail" : "",
        mailCode: codeEmail,
        googleCode: googleCode,
        locale: getInjectInfo("locale") || "en_US"
      };
      // console.log('params', params)
      login(params).then((response) => {
        let res = response.data;
        setGoogleCode("");
        if (res.code === 0) {
          setToken(res);
        }
        // setSubmiting(false);
      });
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  const setToken = (res) => {
    dispatch(setIsLogin(true));
    message.success(t("LoginSuccess"));
    updateUserInfo();
    const value = res.data.access_token;
    setInjectInfo("_authorization", value);
    setInjectInfo("loginInformation", JSON.stringify(res.data));
    let _from = fromPath ? String(fromPath) : "/"
    router.push(_from);
    dispatch(setUserLoginInfo({}));
  };

  const updateUserInfo = () => {
    getCertInfo().then((res) => {
      if (res.data.code === 0) {
        dispatch(setCertInfo(res.data.data));
      }
    });
    queryUserInfo().then((res) => {
      if (res.data.code === 0) {
        dispatch(setUserInfo(res.data.data));
      }
    });
    updateUserLanguage({ locale: userHabit.locale || "en_US" });
  };

  return (
    <>
      <CommonHead />
      <PageContainer>
        <HomeHeader />
        {(userLoginInfo.phone || userLoginInfo.email || userLoginInfo.hasGoogle) && (
          <PageCenter>
            <h6>{userLoginInfo.hasNewDevice ? t("DeviceTitle") : t("GoogleCode")}</h6>
            {userLoginInfo.hasNewDevice && <p>{t("DeviceTips")}</p>}
            <CardWarp>
              {userLoginInfo.phone && (
                <TypeWarp>
                  <LabelRow>
                    <div className="type-text">{t("PhoneVerify")}</div>
                    {totalTimePhone < 60 && (
                      <span className="send-text">
                        {t("CodeSendTo")}:{desensitization(userLoginInfo.phone)}
                      </span>
                    )}
                  </LabelRow>
                  <InputGroup
                    mt={"8px"}
                    endIcon={
                      <CodeTextWarp>
                        {totalTimePhone === 60 && !sendingPhone.current ? (
                          <Button
                            variant={"text"}
                            scale="sm"
                            onClick={sendCodePhone}
                            isLoading={waitSendPhone}
                          >
                            {t("GetCode")}
                          </Button>
                        ) : (
                          <span>{totalTimePhone}s</span>
                        )}
                      </CodeTextWarp>
                    }
                  >
                    <>
                      <Input
                        type="text"
                        scale={"lg"}
                        placeholder={t("RegisterCodePage")}
                        value={codePhone}
                        onChange={handleCodePhoneChange}
                        ref={codePhoneTarget}
                        isWarning={codePhoneError}
                      />
                      {showCodePhoneBlur() && codePhoneTooltip}
                    </>
                  </InputGroup>
                  {/* <span
                  id="phone-code-btn"
                  ref={geePhoneRef}
                  style={{ height: 0, display: "none" }}
                ></span> */}
                </TypeWarp>
              )}
              {userLoginInfo.email && (
                <TypeWarp>
                  <LabelRow>
                    <div className="type-text">{t("EmailVerify")}</div>
                    {totalTimeEmail < 60 && (
                      <span className="send-text">
                        {t("CodeSendTo")}:{desensitization(userLoginInfo.email)}
                      </span>
                    )}
                  </LabelRow>
                  <InputGroup
                    mt={"8px"}
                    endIcon={
                      <CodeTextWarp>
                        {totalTimeEmail === 60 && !sendingEmail.current ? (
                          <Button
                            variant={"text"}
                            scale="sm"
                            onClick={sendCodeEmail}
                            isLoading={waitSendEmail}
                          >
                            {t("GetCode")}
                          </Button>
                        ) : (
                          <span>{totalTimeEmail}s</span>
                        )}
                      </CodeTextWarp>
                    }
                  >
                    <>
                      <Input
                        type="text"
                        scale={"lg"}
                        placeholder={t("RegisterCodePage")}
                        value={codeEmail}
                        onChange={handleCodeEmailChange}
                        ref={codeEmailTarget}
                        isWarning={codeEmailError}
                      />
                      {showCodeEmailBlur() && codeEmailTooltip}
                    </>
                  </InputGroup>
                  {/* <span
                  id="email-code-btn"
                  ref={geeEmailRef}
                  style={{ height: 0, display: "none" }}
                ></span> */}
                </TypeWarp>
              )}
              {userLoginInfo.hasGoogle && (
                <TypeWarp>
                  <LabelRow>
                    <div className="type-text">{t("GoogleCode")}</div>
                  </LabelRow>
                  <InputGroup mt={"8px"}>
                    <>
                      <Input
                        type="text"
                        scale={"lg"}
                        placeholder={t("LoginInputGoogle")}
                        value={googleCode}
                        onChange={handleGoogleCodeChange}
                        ref={googleCodeTarget}
                        isWarning={googleCodeError}
                      />
                      {showGoogleCodeBlur() && googleCodeTooltip}
                    </>
                  </InputGroup>
                </TypeWarp>
              )}

              <Button
                mt={"24px"}
                variant={"primary"}
                width="100%"
                disabled={
                  (userLoginInfo.phone && !codePhone) ||
                  (userLoginInfo.email && !codeEmail) ||
                  (userLoginInfo.hasGoogle && !googleCode)
                }
                onClick={() => submit()}
                isLoading={submiting}
              >
                {t("Confirm")}
              </Button>
            </CardWarp>
          </PageCenter>
        )}

        <LoginFooter />
      </PageContainer>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});

export default Device;
