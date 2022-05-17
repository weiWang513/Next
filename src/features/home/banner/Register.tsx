import React, { useState, useEffect, useRef, ChangeEvent } from "react";
import styled from "styled-components";
import { Button, InputGroup, Input, useTooltip, useModal, message } from "@ccfoxweb/uikit";
import {
  checkAccount,
  getVerifyCodeBeforeAuth,
  isValidBeforeAuth,
  register,
  getCertInfo,
  queryUserInfo,
  updateUserLanguage
} from "../../../services/api/user";
import { getQueryString } from "../../../utils/utils";
import md5 from "js-md5";
import { useAppDispatch } from "../../../store/hook";
import { setIsLogin, setUserInfo, setCertInfo } from "../../../store/modules/appSlice";
import {
  phoneReg,
  emailReg,
  codeReg,
  pwdRuleReg,
  letterReg,
  numberReg
} from "../../../contants/reg";
import CustomModal from "./CodeModal";
import { useAppSelector } from "../../../store/hook";
import { setInjectInfo, getInjectInfo } from "../../../functions/info";
import { useTranslation } from "next-i18next";
import { ReactComponent as PwdActive } from "/public/images/SVG/pwd-active.svg";
import { ReactComponent as PwdUnactive } from "/public/images/SVG/pwd-unactive.svg";
import { ReactComponent as EyeOpen } from "/public/images/SVG/eyesOpen.svg";
import { ReactComponent as EyeClose } from "/public/images/SVG/eyeClose.svg";
import { ReactComponent as ArrowBottomBlack } from "/public/images/SVG/arrow-bottom-black.svg";
import { ReactComponent as SuccessReg } from "/public/images/SVG/success-reg.svg";
import { uuid } from "../../../utils/utils";
import useGeeTest from "../../../utils/geeTest";
import { SIGN_PRIVATE_KEY } from "../../../contants/index";
import jsrsasign from "jsrsasign";
import Link from "next/link";

const RegWarp = styled.div`
  padding: 0 40px;
`;
const TypeRow = styled.section`
  margin-top: 16px;
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
const AgreeText = styled.article`
  margin-top: 16px;
  font-size: 14px;
  font-weight: 500;
  color: #aaa4bb;
  line-height: 20px;
  text-align: center;
  & > a {
    cursor: pointer;
    color: #6024fd;
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
const InviteRow = styled.section<{ show: boolean }>`
  height: 20px;
  margin-top: 10px;
  display: flex;
  align-items: center;
  cursor: pointer;
  & > span {
    font-size: 14px;
    font-weight: 500;
    color: #aaa4bb;
  }
  & > i {
    width: 16px;
    height: 16px;
    margin-left: 8px;
    transform: ${({ show }) => (show ? "rotateZ(180deg)" : "rotateZ(0)")};
  }
`;
const InviteWarp = styled.div`
  margin-top: 2px;
  height: 48px;
`;
const SuccessWarp = styled.div``;
const SuccessTop = styled.section`
  padding-top: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  & > div {
    font-size: 24px;
    font-weight: 600;
    color: #14af81;
    line-height: 24px;
  }
  & > p {
    font-size: 14px;
    font-weight: bold;
    color: #aaa4bb;
    line-height: 18px;
  }
`;
const SuccessBtnRow = styled.div`
  padding-top: 40px;
  width: 100%;
  display: flex;
  & > a {
    flex: 1;
    & + a {
      margin-left: 16px;
    }
  }
`;

const Register = ({ changeRegStatus }) => {
  const [regStep, setRegStep] = useState<number>(0);
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [hasGeetest, setHasGeetest] = useState<boolean>(false);
  const [businessType, setBusinessType] = useState<string>("registerEmail");
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
  const [showInvite, setShowInvite] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>("");
  const [totalTime, setTotalTime] = useState<number>(60);

  const businessTypeRef = useRef("registerEmail");
  const areaCodeRef = useRef("");
  const phoneRef = useRef("");
  const emailRef = useRef("");
  const sending = useRef(false);
  const totalTimeRef = useRef(60);
  const timer = useRef(null);
  const SendCodeRef = useRef(null); //极验 验证码
  const geeRef = useRef(null);

  const dispatch = useAppDispatch();
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const isLogin = useAppSelector((state) => state.app.isLogin);

  const { t } = useTranslation();
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
    const codeQuery = getQueryString("inviteCode");
    const codeLocal = getInjectInfo("inviteCode");
    if (codeQuery) {
      setInviteCode(codeQuery);
      setInjectInfo("inviteCode", codeQuery);
    } else if (codeLocal) {
      setInviteCode(codeLocal);
    }
    // SendCodeRef.current = sendMsg;
    // if (!hasGeetest) {
    //   new myGeetest({
    //     containerId: "send-code-btn",
    //     nextHandle: SendCodeRef.current,
    //     closeGee: () => setWaitSend(false),
    //     form: [true],
    //   }).geetestValidate();
    //   setHasGeetest(true);
    // }
  }, []);
  useEffect(() => {
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

  useEffect(() => {
    if (!isLogin) {
      setRegStep(0);
      toogleType("registerEmail");
    }
  }, [isLogin]);

  const checkUsername = () => {
    if (businessType === "registerPhone" && phoneReg.test(phone)) {
      getCheckResult(phone);
    }
    if (businessType === "registerEmail" && emailReg.test(email)) {
      getCheckResult(email);
    }
  };
  const getCheckResult = (username) => {
    const params = {
      username
    };
    checkAccount(params).then((res) => {
      if (res.data.code === 0) {
        message.error(t("Registered"));
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
    setPassword("");
    setConfirm("");
  };

  const sendMsg = (geeParams) => {
    changeRegStatus(false);
    if (submiting) return false;
    setSubmiting(true);
    const params = {
      businessType: businessTypeRef.current,
      receiver: businessTypeRef.current === "registerPhone" ? phoneRef.current : emailRef.current,
      ...geeParams,
      type: 1,
      currentLocale: getInjectInfo("locale")
    };
    if (businessTypeRef.current === "registerPhone") {
      params.areaCode = areaCodeRef.current;
    }
    getVerifyCodeBeforeAuth(params).then((response) => {
      let res = response.data;
      // console.log(response, 'getVerifyCodeBeforeAuth')
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
    if (businessType === "registerPhone") {
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
    if (businessType === "registerEmail") {
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
  };

  const onValidCode = () => {
    if (submiting) return false;
    setSubmiting(true);
    const params = {
      businessType: businessTypeRef.current,
      receiver: businessTypeRef.current === "registerPhone" ? phoneRef.current : emailRef.current,
      code
    };
    isValidBeforeAuth(params).then((response) => {
      let res = response.data;
      // console.log(response, 'isValidBeforeAuth')
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

  const handleInviteChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setInviteCode(value);
  };

  const urlStr = (obj) => {
    let str = "";
    for (let k in obj) {
      if (str) {
        str += `&`;
      }
      str += `${k}=${obj[k]}`;
    }
    return str;
  };

  const sortObj = (obj) => {
    let _obj = JSON.parse(JSON.stringify(obj));
    Object.keys(_obj).forEach((item) => {
      const key = _obj[item];
      if (key === "" || key === null || key === undefined) {
        delete _obj[item];
      }
    });

    const keys = Object.keys(_obj); //获取key
    keys.sort(); //给key排序，排序是根据首字母进行
    let sorted = {};
    for (let k of keys) {
      sorted[k] = _obj[k];
    }
    return sorted; //返回排序好的对象
  };

  const onRegister = () => {
    if (submiting) return false;
    setSubmiting(true);
    let params = {
      password: md5(password),
      validCode: code,
      inviteCode: inviteCode || null,
      businessType: businessType,
      login_pass_grade: 1,
      userChannel: "web_register",
      areaCode: null,
      phone: null,
      email: null,
      deviceId: localStorage.getItem("_deviceId") || uuid(),
      deviceInfo: window.navigator.userAgent,
      deviceType: 3,
      sign: ""
    };
    localStorage.setItem("_deviceId", params.deviceId);
    if (businessType === "registerPhone") {
      params.areaCode = areaCodeRef.current;
      params.phone = phoneRef.current;
    } else {
      params.email = emailRef.current;
    }

    let _signStr = urlStr(sortObj(params));

    // SHA256withRSA
    let rsa = new jsrsasign.RSAKey(); // new一个RSA对象
    const k = SIGN_PRIVATE_KEY; // SHA256withRSA私钥
    rsa = jsrsasign.KEYUTIL.getKey(k); // 将私钥 转成16进制
    const sig = new jsrsasign.KJUR.crypto.Signature({
      alg: "SHA256withRSA"
    }); // 采用SHA256withRSA进行加密
    sig.init(rsa); // 算法初始化
    const newStr = _signStr;
    sig.updateString(newStr); // 对123456进行加密
    const sign = jsrsasign.hextob64(sig.sign()); // 加密后的16进制转成base64，这就是签名了

    params.sign = sign.replace(/\s+/g, "");

    register(params).then((response) => {
      let res = response.data;
      setSubmiting(false);
      if (res.code === 0) {
        // message.success(t("RegisterSuccess"))
        setToken(res);
        setRegStep((num) => num + 1);
      }
      if (res.code === 102020715) {
        message.error(t("CodeExpired"));
        setCode("");
        setRegStep((num) => num - 1);
      }
    });
  };

  const setToken = (res) => {
    dispatch(setIsLogin(true));
    updateUserInfo();
    const value = res.data.access_token;
    setInjectInfo("_authorization", value);
    setInjectInfo("loginInformation", JSON.stringify(res.data));
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

  const GoService = () => {
    if (userHabit.locale === "zh_CN") {
      let myWindow = window.open(
        "https://ccfox.zendesk.com/hc/zh-cn/articles/360029055231-%E6%9C%8D%E5%8A%A1%E6%9D%A1%E6%AC%BE"
      );
      myWindow.opener = null;
    } else if (userHabit.locale === "zh_TW") {
      let myWindow = window.open(
        "https://ccfox.zendesk.com/hc/zh-hk/articles/360029055231-%E6%9C%8D%E5%8B%99%E6%A2%9D%E6%AC%BE"
      );
      myWindow.opener = null;
    } else {
      let myWindow = window.open(
        "https://ccfox.zendesk.com/hc/en-us/articles/360029055231-Terms-of-Services"
      );
      myWindow.opener = null;
    }
  };

  return (
    <RegWarp>
      {regStep === 0 && (
        <>
          <TypeRow>
            <TypeBtn
              active={businessType === "registerEmail"}
              onClick={() => toogleType("registerEmail")}
            >
              <span>{t("EmailRegister")}</span>
            </TypeBtn>
            <TypeBtn
              active={businessType === "registerPhone"}
              onClick={() => toogleType("registerPhone")}
            >
              <span>{t("PhoneRegister")}</span>
            </TypeBtn>
          </TypeRow>
          {businessType === "registerPhone" ? (
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
                    onBlur={checkUsername}
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
                    onBlur={checkUsername}
                  />
                  {showEmailBlur() && emailTooltip}
                </>
              </InputGroup>
            </AccountRow>
          )}
          <InputGroup
            mt={"10px"}
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
            mt={"34px"}
            variant={"primary"}
            width="100%"
            disabled={
              (businessType === "registerPhone" &&
                (!phoneReg.test(phone) || !codeReg.test(code))) ||
              (businessType === "registerEmail" && (!emailReg.test(email) || !codeReg.test(code)))
            }
            onClick={onValidCode}
            isLoading={submiting}
          >
            {t("Next")}
          </Button>
          <AgreeText>
            {t("RegisterAgree")}
            <a onClick={() => GoService()}>{t("RegisterAgreeTerms")}</a>
          </AgreeText>
        </>
      )}
      {regStep === 1 && (
        <>
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
            mt={"10px"}
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
          <InviteRow show={showInvite} onClick={() => setShowInvite(!showInvite)}>
            <span>{t("RegisterInviteCode")}</span>
            <i>
              <ArrowBottomBlack />
            </i>
          </InviteRow>
          <InviteWarp>
            {showInvite && (
              <InputGroup hasClear={!!inviteCode} clearClick={() => setInviteCode("")}>
                <Input
                  type={"text"}
                  scale={"lg"}
                  placeholder={t("InputInviteCode")}
                  value={inviteCode}
                  onChange={handleInviteChange}
                />
              </InputGroup>
            )}
          </InviteWarp>
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
      {regStep === 2 && (
        <SuccessWarp>
          <SuccessTop>
            <SuccessReg />
            <div>{t("RegisterSuccess")}</div>
            <p>{t("CongratulationsCreate")}</p>
          </SuccessTop>
          <SuccessBtnRow>
            <Link href="/contract/BTC_USDT">
              <Button variant={"secondary"} width="100%">
                {t("GoExchange")}
              </Button>
            </Link>
            <Button
              variant={"primary"}
              width="100%"
              onClick={() => changeRegStatus(true)}
              ml={"20px"}
            >
              {t("FastOtc")}
            </Button>
          </SuccessBtnRow>
        </SuccessWarp>
      )}
    </RegWarp>
  );
};

export default Register;
