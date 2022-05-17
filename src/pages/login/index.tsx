import React, { useState, useRef, useEffect, ChangeEvent } from "react";
import styled from "styled-components";
import HomeHeader from "../../components/HomeHeader";
import LoginFooter from "../../components/LoginFooter";
import { Button, InputGroup, Input, useTooltip, message } from "@ccfoxweb/uikit";
import {
  checkAccount,
  check,
  login,
  getCertInfo,
  queryUserInfo,
  updateUserLanguage
} from "../../services/api/user";
import md5 from "js-md5";
import { useAppDispatch } from "../../store/hook";
import {
  setIsLogin,
  setUserInfo,
  setCertInfo,
  setUserLoginInfo
} from "../../store/modules/appSlice";
import { usernameReg, pwdRuleReg, pwdReg, googleCodeReg } from "../../contants/reg";
import { useAppSelector } from "../../store/hook";
import { setInjectInfo, getInjectInfo } from "../../functions/info";
import { useTranslation } from "next-i18next";
import useInit from "../../hooks/useInit";
import { useRouter } from "next/router";
import { ReactComponent as Lock } from "/public/images/SVG/lock-green.svg";
import { ReactComponent as ArrowRight } from "/public/images/SVG/arrow-right.svg";
import { ReactComponent as EyeOpen } from "/public/images/SVG/eyesOpen.svg";
import { ReactComponent as EyeClose } from "/public/images/SVG/eyeClose.svg";
import { uuid } from "../../utils/utils";
import useGeeTest from "../../utils/geeTest";
import Image from "next/image";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import CommonHead from "../../components/Head/CommonHead";

const PageContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  height: 100vh;
  min-height: 700px;
  padding-bottom: 64px;
  background-color: #4700cd;
  position: relative;

  // background-image: url("/images/home/login-bg.png");
  // background-size: cover;
`;
const PageCenter = styled.div`
  width: 100%;
  max-width: 360px;
  margin: 0 auto;
  // padding-top: 100px;
  padding: 75px 10px 0 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 3;
  & > h6 {
    min-width: 390px;
    font-size: 28px;
    font-weight: 600;
    color: #ffffff;
    line-height: 44px;
    text-align: center;
    ${({ theme }) => theme.mediaQueries.sm} {
      font-size: 32px;
    }
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
    padding: 100px 10px 0 10px;
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
const Desc = styled.section`
  height: 32px;
  background: #f5f3fb;
  border-radius: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  font-weight: 500;
  span {
    margin-right: 10px;
    color: #aaa4bb;
  }
  i {
    margin-left: 4px;
    font-style: normal;
    color: #14af81;
  }
  div {
    color: #220a60;
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
const ForgetRow = styled.section`
  display: flex;
  justify-content: space-between;
  align-item: center;
  height: 20px;
  padding-top: 16px;
  & > a {
    font-size: 14px;
    font-weight: 500;
    color: #6024fd;
    &:hover {
      opacity: 0.6;
    }
  }
`;
const ForgetPwd = styled.div`
  display: flex;
  justify-content: flex-end;
  a {
    height: 20px;
    display: flex;
    align-items: center;
    margin-top: -2px;
    &:hover {
      opacity: 0.6;
    }
    span {
      margin-right: 2px;
      font-size: 14px;
      font-weight: 500;
      color: #6024fd;
    }
  }
`;
const GoogleText = styled.section`
  font-size: 24px;
  font-weight: 600;
  color: #220a60;
  line-height: 32px;
  text-align: center;
`;
const InputRow = styled.div`
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
`;
const Contact = styled.p`
  margin-top: 24px;
  font-size: 12px;
  font-weight: 500;
  color: #aaa4bb;
  line-height: 18px;
  text-align: center;
`;
const ErrorMsg = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  text-align: center;
`;

const Img = styled.img`
  margin-top: 12px;
  border-radius: 8px;
  cursor: pointer;
`

const Login = () => {
  const [showPwd, setShowPwd] = useState<boolean>(false);
  const [showGoogle, setShowGoogle] = useState<boolean>(false);
  const [submiting, setSubmiting] = useState<boolean>(false);
  const [hasGeetest, setHasGeetest] = useState<boolean>(false);
  const [geeParams, setGeeParams] = useState<object>({});
  const [username, setUsername] = useState<string>("");
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [googleCode, setGoogleCode] = useState<string>("");
  const [codeList, setCodeList] = useState(["", "", "", "", "", ""]);
  const codeId = ["first", "second", "third", "fourth", "fifth", "sixth"];
  const [hostname, setHostName] = useState<string>("");
  const geeRef = useRef(null);
  const UserCheckRef = useRef(null);
  const usernameRef = useRef("");
  const passwordRef = useRef("");
  const dispatch = useAppDispatch();
  const userHabit = useAppSelector((state) => state.app.userHabit);
  const fromPath = useAppSelector((state) => state.app.fromPath);
  const isLogin = useAppSelector((state) => state.app.isLogin);
  const { t } = useTranslation();
  const { init } = useInit();
  const router = useRouter();

  const { initGeetest } = useGeeTest();


  const {
    tooltipVisible: usernameTooltipVisible,
    targetRef: usernameTarget,
    tooltip: usernameTooltip
  } = useTooltip(<ErrorMsg>{t("PhoneOrEmailMsg")}</ErrorMsg>, {
    placement: "top",
    trigger: "blur",
    isWarning: usernameError
  });
  const {
    tooltipVisible: passwordTooltipVisible,
    targetRef: passwordTarget,
    tooltip: passwordTooltip
  } = useTooltip(<ErrorMsg>{t("YourPassword")}</ErrorMsg>, {
    placement: "top",
    trigger: "blur",
    isWarning: passwordError
  });

  useEffect(() => {
    init();
    setHostName(window.location.hostname);
    // UserCheckRef.current = UserCheck;
    // if (!hasGeetest) {
    //   new myGeetest({
    //     containerId: "login-form-btn",
    //     nextHandle: UserCheckRef.current,
    //     closeGee: () => setSubmiting(false),
    //     form: [true],
    //   }).geetestValidate();
    //   setHasGeetest(true);
    // }
  }, []);

  useEffect(() => {
    let _from = fromPath ? String(fromPath) : "/"
    if (isLogin) router.replace(_from);
  }, [isLogin]);

  const onCheck = () => {
    if (submiting) return false;
    setSubmiting(true);
    setTimeout(() => {
      setSubmiting(false);
    }, 10000);
    try {
      // geeRef.current.click()
      initGeetest(
        {
          product: "bind",
          lang: userHabit.locale
        },
        UserCheck,
        () => setSubmiting(false)
      );
    } catch (errorInfo) {
      console.log("Failed:", errorInfo);
    }
  };

  // 一次认证 登录
  const UserCheck = (geeParams) => {
    setGeeParams(geeParams);
    const params = {
      username: usernameRef.current,
      password: md5(passwordRef.current),
      deviceId: localStorage.getItem("_deviceId") || uuid(),
      deviceInfo: window.navigator.userAgent,
      deviceType: 3,
      locale: getInjectInfo("locale") || "en_US"
    };
    localStorage.setItem("_deviceId", params.deviceId);
    check(params).then((response) => {
      let res = response.data;
      if (res.code === 0) {
        if (res.data.hasGoogle || res.data.hasNewDevice) {
          const loginObj = {
            ...params,
            ...geeParams,
            ...res.data,
            type: 1
          };
          dispatch(setUserLoginInfo(loginObj));
          router.push("/dv");
        } else {
          setToken(res);
        }
      }
      setSubmiting(false);
    });
  };

  // 二次验证 登录
  const submit = () => {
    try {
      const params = {
        username: usernameRef.current,
        password: md5(passwordRef.current),
        locale: getInjectInfo("locale") || "en_US",
        googleCode: googleCode.substring(0, 6),
        ...geeParams,
        type: 1
      };
      // console.log('params', params)
      login(params).then((response) => {
        let res = response.data;
        setGoogleCode("");
        if (res.code === 0) {
          setToken(res);
        }
        setSubmiting(false);
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

  const checkUsername = () => {
    if (usernameReg.test(username)) {
      const params = {
        username
      };
      checkAccount(params).then((res) => {
        if (res.data.code === 102020729) {
          message.error(t("NotRegistered"));
        }
      });
    }
  };

  const handleUsernameChange = (event: ChangeEvent<HTMLInputElement>) => {
    let { value } = event.target;
    if (value.length > 32) {
      value = value.slice(0, 32);
    }
    setUsername(value.trim());
    usernameRef.current = value.trim();
    setUsernameError(false);
  };
  const showUsernameBlur = () => {
    return usernameTooltipVisible
      ? usernameTooltipVisible && usernameError
      : usernameTooltipVisible || usernameError;
  };
  const regUsername = () => {
    if (usernameReg.test(username) || !username) {
      setUsernameError(false);
    } else {
      setUsernameError(true);
    }
  };
  useEffect(() => {
    usernameTooltipVisible && regUsername();
  }, [usernameTooltipVisible]);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const newValue = value.replace(pwdRuleReg, "");
    setPassword(newValue);
    passwordRef.current = newValue;
    setPasswordError(false);
  };
  const showPasswordBlur = () => {
    return passwordTooltipVisible
      ? passwordTooltipVisible && passwordError
      : passwordTooltipVisible || passwordError;
  };
  const regPassword = () => {
    if (pwdReg.test(password) || !password) {
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };
  useEffect(() => {
    passwordTooltipVisible && regPassword();
  }, [passwordTooltipVisible]);

  const handleCodeChange = (event: ChangeEvent<HTMLInputElement>, index: number) => {
    let { value } = event.target;
    let listTemp = [...codeList];
    listTemp[index] = value;
    setGoogle(listTemp);
  };

  const setGoogle = (listTemp) => {
    // console.log('listTemp', listTemp)
    // if (!googleChanged) return
    let tempValue = "";
    for (let i = 0; i < listTemp.length; i++) {
      if (i == 6) {
        console.log(i);
        break;
      }
      if (listTemp[i]) {
        tempValue = tempValue + listTemp[i];
      }
    }
    setGoogleCode(tempValue);
    // console.log("smsCode " + googleCode)
    let m = tempValue.split("");
    let location = 0;
    for (let i = 0; i < listTemp.length; i++) {
      if (m[i] && i < 6) {
        location++;
        listTemp[i] = m[i];
      } else {
        listTemp[i] = "";
      }
      setCodeList(listTemp);
    }
    if (location < 1) {
      location = 1;
    } else if (location > 6) {
      location = 6;
    }
    // console.log('codeId', codeId[location - 1], googleCode)
    document.getElementById(codeId[location - 1]).focus();
  };

  const gotoActivity = () => {
    // router.push('/activities/2022-April-Crypto-Battle')
    let myWindow = window.open(`${location?.origin}/activities/2022-April-Crypto-Battle`);
    myWindow.opener = null;
  }

  return (
    <>
      <CommonHead />
      <PageContainer>
        <Image src="/images/home/login-bg.png" alt="" layout="fill" objectFit="cover" priority />
        <HomeHeader />
        <PageCenter>
          <h6>{t("WelcomeCcfox")}</h6>
          <p>{t("WelcomeTips")}</p>
          <CardWarp>
            {!showGoogle ? (
              <>
                <Desc>
                  <span>{t("OfficialSite")}</span>
                  <Lock />
                  <i>https://</i>
                  <div>{hostname}</div>
                </Desc>
                <InputGroup
                  mt={"16px"}
                  hasClear={!!username}
                  clearClick={() => {
                    setUsername("");
                    usernameRef.current = "";
                  }}
                >
                  <>
                    <Input
                      type="text"
                      scale={"lg"}
                      placeholder={t("LoginAccount")}
                      value={username}
                      onChange={handleUsernameChange}
                      ref={usernameTarget}
                      isWarning={usernameError}
                      onBlur={checkUsername}
                    />
                    {showUsernameBlur() && usernameTooltip}
                  </>
                </InputGroup>
                <InputGroup
                  mt={"16px"}
                  hasClear={!!password}
                  clearClick={() => {
                    setPassword("");
                    passwordRef.current = "";
                  }}
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
                      placeholder={t("LoginPassword")}
                      value={password}
                      onChange={handlePasswordChange}
                      ref={passwordTarget}
                      isWarning={passwordError}
                      // onPaste={(e) => e.preventDefault()}
                      // onCopy={(e) => e.preventDefault()}
                      // onCut={(e) => e.preventDefault()}
                    />
                    {showPasswordBlur() && passwordTooltip}
                  </>
                </InputGroup>
                <Button
                  variant={"primary"}
                  mt={"24px"}
                  width="100%"
                  onClick={onCheck}
                  disabled={!usernameReg.test(username) || !pwdReg.test(password)}
                  isLoading={submiting}
                >
                  {t("Login")}
                </Button>
                <span
                  id="login-form-btn"
                  ref={geeRef}
                  style={{ height: 0, display: "none" }}
                ></span>
                <ForgetRow>
                  <Link href="/register">{t("RegisterNew")}</Link>
                  <ForgetPwd>
                    <Link href="/resetPwd">
                      <a>
                        <span>{t("ForgotPassword")}</span>
                        <ArrowRight />
                      </a>
                    </Link>
                  </ForgetPwd>
                </ForgetRow>
              </>
            ) : (
              <>
                <GoogleText>{t("LoginInputGoogle")}</GoogleText>
                <InputRow>
                  {codeList.map((item, index) => (
                    <Input
                      key={index}
                      id={codeId[index]}
                      type="number"
                      scale={"lg"}
                      value={item}
                      onChange={(e) => handleCodeChange(e, index)}
                      style={{ width: "48px" }}
                      maxlength={1}
                    />
                  ))}
                </InputRow>
                <Contact>{t("LoginInputGoogleTips")}: support@ccfox.com</Contact>
                <Button
                  variant={"primary"}
                  mt={"24px"}
                  width="100%"
                  onClick={submit}
                  disabled={!googleCodeReg.test(googleCode)}
                  isLoading={submiting}
                >
                  {t("Confirm")}
                </Button>
              </>
            )}
          </CardWarp>
          <Img src={`/images/tradingCompetition/${userHabit.locale}/activity.jpg`} width="100%" alt="" onClick={gotoActivity} />
        </PageCenter>
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

export default Login;
