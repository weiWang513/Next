import { useRouter } from "next/router";
import {
  setLocale,
  setUpDownColor,
  setCurrency,
  setVersionObj,
  setIsLogin,
  setUserInfo,
  setCertInfo
} from "../store/modules/appSlice";

import { getInjectInfo, setInjectInfo } from "../functions/info";
import { queryVersion, queryUserInfo, getCertInfo } from "../services/api/user";
import { useAppDispatch } from "../store/hook";
import { getContractList, getCurrencyList } from "../store/modules/contractSlice";
import { getSpotContractList, getSpotCurrencyList } from "../store/modules/spotSlice";

// import { getQueryString, mHostReplace } from "../utils/utils";

const useInit = () => {
  const dispatch = useAppDispatch();
  const { asPath, locale } = useRouter();

  const init = () => {
    // 禁止iframe嵌套
    if (window != window.top) {
      window.top.location.href = window.location.href;
    }

    // 移动端跳转
    // const flag = navigator.userAgent.match(
    //   /(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
    // );
    // const code = getQueryString("inviteCode");
    // const mDomain = mHostReplace();
    // if (mDomain) {
    //   if (asPath.indexOf("register") > -1) {
    //     if (flag) {
    //       window.location.href = `https://${mDomain}/inviteRegister?inviteCode=${code}`;
    //       return;
    //     }
    //   }
    //   if (flag) {
    //     window.location.href = `https://${mDomain}`;
    //     return;
    //   }
    // }

    // // lang
    setInjectInfo("locale", locale);
    dispatch(setLocale(locale));

    // userInfo
    const _authorization = getInjectInfo("_authorization");

    if (_authorization) {
      dispatch(setIsLogin(true));
      queryUserInfo().then((res) => {
        if (res.data.code === 0) {
          dispatch(setUserInfo(res.data.data));
        } else {
          setInjectInfo("_authorization", "");
        }
      });
      getCertInfo().then((res) => {
        if (res.data.code === 0) {
          dispatch(setCertInfo(res.data.data));
        }
      });
    }

    // udesk
    const udeskBtn = document.querySelector("#udesk_container");
    if (asPath.indexOf("contract") > -1 || asPath.indexOf("spot") > -1) {
      // @ts-ignore
      udeskBtn && (udeskBtn.style.display = "none");
    } else {
      // @ts-ignore
      udeskBtn && (udeskBtn.style.display = "block");
    }

    // updowncolor
    dispatch(setUpDownColor(getInjectInfo("_upDownColor")));

    // currency
    dispatch(setCurrency(getInjectInfo("currency")));

    // version
    queryVersion({ name: "app" }).then((res) => {
      if (res?.data?.code === 0) {
        dispatch(setVersionObj(JSON.parse(res.data?.data?.description)));
      }
    });
  };

  const setCommonData = () => {
    dispatch(getContractList());
    dispatch(getCurrencyList());
  };

  const setSpotCommonData = () => {
    dispatch(getSpotContractList());
    dispatch(getSpotCurrencyList());
  };

  return { init, setCommonData, setSpotCommonData };
};

export default useInit;
