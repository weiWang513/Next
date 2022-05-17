import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import styled from "styled-components";
import HomeHeader from "../../components/HomeHeader";
import LoginFooter from "../../components/LoginFooter";
import { Button, InputGroup, Input, useTooltip, useModal, message } from "@ccfoxweb/uikit";
import {
  checkAccount,
  getVerifyCodeBeforeAuth,
  isValidBeforeAuth,
  changePassword
} from "../../services/api/user";
import md5 from "js-md5";
import { phoneReg, emailReg, codeReg, pwdRuleReg, letterReg, numberReg } from "../../contants/reg";
import CustomModal from "../../features/home/banner/AllCodeModal";
import { getInjectInfo } from "../../functions/info";
import { useAppSelector } from "../../store/hook";
import { useTranslation } from "next-i18next";
import useInit from "../../hooks/useInit";
import { useRouter } from "next/router";
import { ReactComponent as PwdActive } from "/public/images/SVG/pwd-active.svg";
import { ReactComponent as PwdUnactive } from "/public/images/SVG/pwd-unactive.svg";
import { ReactComponent as EyeOpen } from "/public/images/SVG/eyesOpen.svg";
import { ReactComponent as EyeClose } from "/public/images/SVG/eyeClose.svg";
import { ReactComponent as ArrowBottomBlack } from "/public/images/SVG/arrow-bottom-black.svg";
import useGeeTest from "../../utils/geeTest";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import CommonHead from "../../components/Head/CommonHead";

const PageContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  height: 100vh;
  min-height: 700px;
  padding-bottom: 64px;
  background: #f5f3fb;
  position: relative;
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  & > h6 {
    font-size: 32px;
    font-weight: 600;
    color: #220a60;
    line-height: 44px;
    text-align: center;
  }
  & > p {
    padding-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #ec516d;
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
const TypeRow = styled.section`
  border-radius: 4px;
  background: #f5f3fb;
  overflow: hidden;
  display: flex;
`;
const TypeBtn = styled.aside<{ active: boolean }>`
  box-sizing: border-box;
  flex: 1;
  height: 40px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ active }) => (active ? "#FFFFFF" : "none")};
  color: ${({ active }) => (active ? " #6A45FF" : "#AAA4BB")};
  border: ${({ active }) => (active ? "1px solid #E6E3F0" : "none")};
`;
const AccountRow = styled.section`
  margin-top: 16px;
  display: flex;
`;
const AreaWarp = styled.aside`
  box-sizing: border-box;
  width: 120px;
  margin-right: 10px;
  padding: 0 12px;
  border-radius: 4px;
  border: 1px solid #e6e3f0;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:hover {
    border: 1px solid #6f5aff;
  }
  & > span {
    font-size: 14px;
    font-weight: bold;
    color: #130f1d;
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
const ErrorMsg = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
`;
const PwdTips = styled.div`
  padding: 16px;
  & > div {
    padding-bottom: 4px;
    font-size: 14px;
    font-weight: 600;
    color: #220a60;
    line-height: 20px;
  }
`;
const CheckRow = styled.section<{ active: boolean }>`
  margin-top: 12px;
  height: 20px;
  display: flex;
  & > span {
    margin-left: 4px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ active }) => (active ? "#14AF81" : "#AAA4BB")};
  }
`;
const EyeWarp = styled.section`
  width: 36px;
  height: 36px;
  cursor: pointer;
  &:hover {
    opacity: 0.6;
  }
`;
const PwdTitle = styled.section`
  font-size: 14px;
  font-weight: 600;
  color: #220a60;
  line-height: 20px;
`;

const Register = () => {
  const [regStep, setRegStep] = useState<number>(0);
  const [submiting, setSubmiting] = useState<boolean>(false);
  // const [hasGeetest, setHasGeetest] = useState<boolean>(false);
  const [businessType, setBusinessType] = useState<string>("changeLoginPasswordEmail");
  const [areaCode, setAreaCode] = useState<string>("+86");
  const [phone, setPhone] = useState<string>("");
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<boolean>(false);
  const [code, setCode] = useState<string>("");
  const [codeError, setCodeError] = useState<boolean>(false);
  const [waitSend, setWaitSend] = useState<boolean>(false);
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [showCfm, setShowCfm] = useState<boolean>(false);
  const [confirm, setConfirm] = useState<string>("");
  const [confirmError, setConfirmError] = useState<boolean>(false);
  const [totalTime, setTotalTime] = useState<number>(60);

  const businessTypeRef = useRef("changeLoginPasswordEmail");
  const areaCodeRef = useRef("");
  const phoneRef = useRef("");
  const emailRef = useRef("");
  const sending = useRef(false);
  const totalTimeRef = useRef(60);
  const timer = useRef(null);
  const SendCodeRef = useRef(null); //极验 验证码
  const geeRef = useRef(null);

  const userHabit = useAppSelector((state) => state.app.userHabit);
  const isLogin = useAppSelector((state) => state.app.isLogin);

  const { t } = useTranslation();
  const { init } = useInit();
  const router = useRouter();

  const { initGeetest } = useGeeTest();

  const {
    tooltipVisible: phoneTooltipVisible,
    targetRef: phoneTarget,
    tooltip: phoneTooltip
  } = useTooltip(<ErrorMsg>{t("PhoneMsg")}</ErrorMsg>, {
    placement: "top",
    trigger: "blur",
    isWarning: phoneError
  });
  const {
    tooltipVisible: emailTooltipVisible,
    targetRef: emailTarget,
    tooltip: emailTooltip
  } = useTooltip(<ErrorMsg>{t("EmailMsg")}</ErrorMsg>, {
    placement: "top",
    trigger: "blur",
    isWarning: emailError
  });
  const {
    tooltipVisible: codeTooltipVisible,
    targetRef: codeTarget,
    tooltip: codeTooltip
  } = useTooltip(<ErrorMsg>{t("CodeMsg")}</ErrorMsg>, {
    placement: "top",
    trigger: "blur",
    isWarning: codeError
  });
  const {
    tooltipVisible: passwordTooltipVisible,
    targetRef: passwordTarget,
    tooltip: passwordTooltip
  } = useTooltip(
    <PwdTips>
      <div>{t("PwdNeed")}: </div>
      <CheckRow active={password.length >= 8 && password.length <= 24}>
        {password.length >= 8 && password.length <= 24 ? <PwdActive /> : <PwdUnactive />}
        <span>{t("8to24")}</span>
      </CheckRow>
      <CheckRow active={letterReg.test(password)}>
        {letterReg.test(password) ? <PwdActive /> : <PwdUnactive />}
        <span>{t("LetterInclude")}</span>
      </CheckRow>
      <CheckRow active={numberReg.test(password)}>
        {numberReg.test(password) ? <PwdActive /> : <PwdUnactive />}
        <span>{t("NumberInclude")}</span>
      </CheckRow>
    </PwdTips>,
    {
      placement: "left",
      trigger: "focus",
      isWarning: false
    }
  );
  const {
    tooltipVisible: confirmTooltipVisible,
    targetRef: confirmTarget,
    tooltip: confirmTooltip
  } = useTooltip(<ErrorMsg>{t("TwicePwdMsg")}</ErrorMsg>, {
    placement: "top",
    trigger: "blur",
    isWarning: confirmError
  });

  const selectAreaCode = (value) => {
    setAreaCode(value);
    areaCodeRef.current = value;
  };
  const [openModal] = useModal(
    <CustomModal title={t("ChoosePhoneCode")} selectAreaCode={selectAreaCode} />
  );

  useEffect(() => {
    init();
    SendCodeRef.current = sendMsg;
    // new myGeetest({
    //   containerId: "send-code-btn",
    //   nextHandle: SendCodeRef.current,
    //   closeGee: () => setWaitSend(false),
    //   form: [true],
    // }).geetestValidate();
  }, []);

  useEffect(() => {
    if (isLogin) router.replace("/");
  }, [isLogin]);

  useEffect(() => {
    if (userHabit.locale === "") return;
    const localeObj = {
      zh_CN: "+86",
      zh_TW: "+852",
      en_US: "+44",
      ko_KR: "+82",
      ja_JP: "+81",
      vi_VN: "+84",
      tu_TR: "+90"
    };
    const locale = userHabit.locale || "en_US";
    areaCodeRef.current = localeObj[locale];
    setAreaCode(localeObj[locale]);
  }, [userHabit.locale]);

  const checkUsername = () => {
    if (businessType === "changeLoginPasswordPhone" && phoneReg.test(phone)) {
      getCheckResult(phone);
    }
    if (businessType === "changeLoginPasswordEmail" && emailReg.test(email)) {
      getCheckResult(email);
    }
  };
  const getCheckResult = (username) => {
    const params = {
      username
    };
    checkAccount(params).then((res) => {
      if (res.data.code === 0) {
        if (businessType === "changeLoginPasswordPhone") {
          if (phoneReg.test(phone)) {
            setWaitSend(true);
            // geeRef.current.click();
            initGeetest(
              {
                product: "bind",
                lang: userHabit.locale
              },
              sendMsg,
              () => setWaitSend(false)
            );
          } else {
            setPhoneError(true);
          }
        }
        if (businessType === "changeLoginPasswordEmail") {
          if (emailReg.test(email)) {
            setWaitSend(true);
            // geeRef.current.click();
            initGeetest(
              {
                product: "bind",
                lang: userHabit.locale
              },
              sendMsg,
              () => setWaitSend(false)
            );
          } else {
            setEmailError(true);
          }
        }
      } else if (res.data.code === 102020729) {
        message.error(t("NotRegistered"));
      }
    });
  };
  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    if (value.length > 15) {
      value = value.slice(0, 15);
    }
    setPhone(value.trim());
    phoneRef.current = value.trim();
    setPhoneError(false);
  };
  const showPhoneBlur = () => {
    return phoneTooltipVisible
      ? phoneTooltipVisible && phoneError
      : phoneTooltipVisible || phoneError;
  };
  const regPhone = () => {
    if (phoneReg.test(phone) || !phone) {
      setPhoneError(false);
    } else {
      setPhoneError(true);
    }
  };
  useEffect(() => {
    phoneTooltipVisible && regPhone();
  }, [phoneTooltipVisible]);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    if (value.length > 32) {
      value = value.slice(0, 32);
    }
    setEmail(value);
    emailRef.current = value;
    setEmailError(false);
  };
  const showEmailBlur = () => {
    return emailTooltipVisible
      ? emailTooltipVisible && emailError
      : emailTooltipVisible || emailError;
  };
  const regEmail = () => {
    if (emailReg.test(email) || !email) {
      setEmailError(false);
    } else {
      setEmailError(true);
    }
  };
  useEffect(() => {
    emailTooltipVisible && regEmail();
  }, [emailTooltipVisible]);

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    if (value.length > 6) {
      value = value.slice(0, 6);
    }
    setCode(value.trim());
    setCodeError(false);
  };
  const showCodeBlur = () => {
    return codeTooltipVisible ? codeTooltipVisible && codeError : codeTooltipVisible || codeError;
  };
  const regCode = () => {
    if (codeReg.test(code) || !code) {
      setCodeError(false);
    } else {
      setCodeError(true);
    }
  };
  useEffect(() => {
    codeTooltipVisible && regCode();
  }, [codeTooltipVisible]);

  const toogleType = (type) => {
    setTotalTime(60);
    totalTimeRef.current = 60;
    sending.current = false;
    businessTypeRef.current = type;
    timer.current && clearInterval(timer.current);
    setPhone("");
    setEmail("");
    setCode("");
    phoneRef.current = "";
    emailRef.current = "";
    setPhoneError(false);
    setEmailError(false);
    setCodeError(false);
    setBusinessType(type);
  };

  const sendMsg = async (geeParams) => {
    if (submiting) return false;

    setSubmiting(true);
    const params = {
      businessType: businessTypeRef.current,
      receiver:
        businessTypeRef.current === "changeLoginPasswordPhone"
          ? phoneRef.current
          : emailRef.current,
      ...geeParams,
      type: 1,
      currentLocale: getInjectInfo("locale")
    };
    if (businessTypeRef.current === "changeLoginPasswordPhone") {
      params.areaCode = areaCodeRef.current;
    }
    getVerifyCodeBeforeAuth(params).then((response) => {
      let res = response.data;
      if (res.code === 0) {
        message.success(t("SentSuccess"));
        countDown();
        setWaitSend(false);
      }
      setSubmiting(false);
    });
  };
  const countDown = () => {
    sending.current = true;
    timer.current = setInterval(() => {
      setTotalTime((num) => num - 1);
      totalTimeRef.current = totalTimeRef.current - 1;
      if (totalTimeRef.current > 0) {
      } else {
        sending.current = false;
        totalTimeRef.current = 60;
        setTotalTime(60);
        clearInterval(timer.current);
      }
    }, 1000);
  };
  const sendCode = () => {
    checkUsername();
  };

  const onValidCode = () => {
    if (submiting) return false;
    setSubmiting(true);
    const params = {
      businessType: businessTypeRef.current,
      receiver:
        businessTypeRef.current === "changeLoginPasswordPhone"
          ? phoneRef.current
          : emailRef.current,
      code
    };
    isValidBeforeAuth(params).then((response) => {
      let res = response.data;
      if (res.code === 0) {
        setRegStep((num) => num + 1);
      }
      setSubmiting(false);
    });
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newValue = value.replace(pwdRuleReg, "");
    setPassword(newValue);
  };

  const handleConfirmChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newValue = value.replace(pwdRuleReg, "");
    setConfirm(newValue);
    setConfirmError(false);
  };
  const showConfirmBlur = () => {
    return confirmTooltipVisible
      ? confirmTooltipVisible && confirmError
      : confirmTooltipVisible || confirmError;
  };
  const regConfirm = () => {
    if (confirm === password || !confirm) {
      setConfirmError(false);
    } else {
      setConfirmError(true);
    }
  };
  useEffect(() => {
    confirmTooltipVisible && regConfirm();
  }, [confirmTooltipVisible]);

  const onRegister = () => {
    if (submiting) return false;
    setSubmiting(true);
    let params = {
      password: md5(password),
      validCode: code,
      businessType: businessType,
      login_pass_grade: 1,
      areaCode: null,
      receiver: null
    };
    if (businessType === "changeLoginPasswordPhone") {
      params.areaCode = areaCodeRef.current;
      params.receiver = phoneRef.current;
    } else {
      params.receiver = emailRef.current;
    }
    changePassword(params).then((response) => {
      let res = response.data;
      setSubmiting(false);
      if (res.code === 0) {
        message.success(t("ResetPwdSuccess"));
        router.push("/login");
      }
      if (res.code === 102020715) {
        message.error(t("CodeExpired"));
        setCode("");
        setRegStep((num) => num - 1);
      }
    });
  };

  return (
    <>
      <CommonHead />
      <PageContainer>
        <HomeHeader bgColor={"rgba(19, 15, 29, 1)"} />
        <PageCenter>
          <h6>{t("ResetPwd")}</h6>
          <p>{t("ResetPwdTips")}</p>
          <CardWarp>
            {regStep === 0 && (
              <>
                <TypeRow>
                  <TypeBtn
                    active={businessType === "changeLoginPasswordEmail"}
                    onClick={() => toogleType("changeLoginPasswordEmail")}
                  >
                    <span>{t("EmailVerify")}</span>
                  </TypeBtn>
                  <TypeBtn
                    active={businessType === "changeLoginPasswordPhone"}
                    onClick={() => toogleType("changeLoginPasswordPhone")}
                  >
                    <span>{t("PhoneVerify")}</span>
                  </TypeBtn>
                </TypeRow>
                {businessType === "changeLoginPasswordPhone" ? (
                  <AccountRow>
                    <AreaWarp onClick={() => openModal()}>
                      <span>{areaCode}</span>
                      <ArrowBottomBlack />
                    </AreaWarp>
                    <InputGroup
                      hasClear={!!phone}
                      clearClick={() => {
                        setPhone("");
                        phoneRef.current = "";
                      }}
                    >
                      <>
                        <Input
                          type="number"
                          scale={"lg"}
                          placeholder={t("YourPhone")}
                          value={phone}
                          onChange={handlePhoneChange}
                          ref={phoneTarget}
                          isWarning={phoneError}
                          // onBlur={checkUsername}
                        />
                        {showPhoneBlur() && phoneTooltip}
                      </>
                    </InputGroup>
                  </AccountRow>
                ) : (
                  <AccountRow>
                    <InputGroup
                      hasClear={!!email}
                      clearClick={() => {
                        setEmail("");
                        emailRef.current = "";
                      }}
                    >
                      <>
                        <Input
                          type="text"
                          scale={"lg"}
                          placeholder={t("YourEmail")}
                          value={email}
                          onChange={handleEmailChange}
                          ref={emailTarget}
                          isWarning={emailError}
                          // onBlur={checkUsername}
                        />
                        {showEmailBlur() && emailTooltip}
                      </>
                    </InputGroup>
                  </AccountRow>
                )}
                <InputGroup
                  mt={"16px"}
                  hasClear={!!code}
                  clearClick={() => setCode("")}
                  endIcon={
                    <CodeTextWarp>
                      {totalTime === 60 && !sending.current ? (
                        <Button variant={"text"} scale="sm" onClick={sendCode} isLoading={waitSend}>
                          {t("GetCode")}
                        </Button>
                      ) : (
                        <span>{totalTime}s</span>
                      )}
                    </CodeTextWarp>
                  }
                >
                  <>
                    <Input
                      type="text"
                      scale={"lg"}
                      placeholder={t("RegisterCodePage")}
                      value={code}
                      onChange={handleCodeChange}
                      ref={codeTarget}
                      isWarning={codeError}
                    />
                    {showCodeBlur() && codeTooltip}
                  </>
                </InputGroup>
                <span id="send-code-btn" ref={geeRef} style={{ height: 0, display: "none" }}></span>
                <Button
                  mt={"24px"}
                  variant={"primary"}
                  width="100%"
                  disabled={
                    (businessType === "changeLoginPasswordPhone" &&
                      (!phoneReg.test(phone) || !codeReg.test(code))) ||
                    (businessType === "changeLoginPasswordEmail" &&
                      (!emailReg.test(email) || !codeReg.test(code)))
                  }
                  onClick={onValidCode}
                  isLoading={submiting}
                >
                  {t("Next")}
                </Button>
              </>
            )}
            {regStep === 1 && (
              <>
                <PwdTitle>{t("SetNewPwd")}: </PwdTitle>
                <InputGroup
                  mt={"16px"}
                  hasClear={!!password}
                  clearClick={() => setPassword("")}
                  endIcon={
                    <EyeWarp onClick={() => setShowPwd(!showPwd)}>
                      {showPwd ? <EyeOpen /> : <EyeClose />}
                    </EyeWarp>
                  }
                >
                  <>
                    <Input
                      type={showPwd ? "text" : "password"}
                      scale={"lg"}
                      placeholder={t("YourPassword")}
                      value={password}
                      onChange={handlePasswordChange}
                      ref={passwordTarget}
                      // onPaste={(e) => e.preventDefault()}
                      // onCopy={(e) => e.preventDefault()}
                      // onCut={(e) => e.preventDefault()}
                    />
                    {passwordTooltipVisible && passwordTooltip}
                  </>
                </InputGroup>
                <InputGroup
                  mt={"16px"}
                  hasClear={!!confirm}
                  clearClick={() => setConfirm("")}
                  endIcon={
                    <EyeWarp onClick={() => setShowCfm(!showCfm)}>
                      {showCfm ? <EyeOpen /> : <EyeClose />}
                    </EyeWarp>
                  }
                >
                  <>
                    <Input
                      type={showCfm ? "text" : "password"}
                      scale={"lg"}
                      placeholder={t("PwdAgain")}
                      value={confirm}
                      onChange={handleConfirmChange}
                      ref={confirmTarget}
                      isWarning={confirmError}
                      // onPaste={(e) => e.preventDefault()}
                      // onCopy={(e) => e.preventDefault()}
                      // onCut={(e) => e.preventDefault()}
                    />
                    {showConfirmBlur() && confirmTooltip}
                  </>
                </InputGroup>
                <Button
                  mt={"22px"}
                  variant={"primary"}
                  width="100%"
                  disabled={
                    !letterReg.test(password) ||
                    password.length < 8 ||
                    password.length > 24 ||
                    !numberReg.test(password) ||
                    password !== confirm
                  }
                  onClick={onRegister}
                  isLoading={submiting}
                >
                  {t("Complete")}
                </Button>
              </>
            )}
          </CardWarp>
        </PageCenter>
        <LoginFooter bgColor="#0B0814" />
      </PageContainer>
    </>
  );
};

export const getStaticProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common", "code"]))
  }
});

export default Register;
