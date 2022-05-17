/**
 * http配置
 */

import axios from "axios";
import store from "./../store/store";
import noTokenUrl from "./noTokenUrl";
import noReserveUrl from "./noReserveUrl";
import { getInjectInfo, removeInjectInfo } from "../functions/info";
import { setIsLogin } from "../store/modules/appSlice";
import i18next, { i18n } from "next-i18next";
import { message } from "@ccfoxweb/uikit";

// axios 配置
axios.defaults.timeout = 10000;
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
axios.defaults.baseURL = 'https://awsapitest.ctestc.cn';
const csr = process.browser;

// http request 拦截器
axios.interceptors.request.use(
  (config) => {
    const apiUrl = config.url;
    let token = "";
    if (noTokenUrl.indexOf(apiUrl) > -1) return config;

    token = getInjectInfo("_authorization");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.headers["client-agent"] = "pc";
    return config;
  },
  (err) => Promise.reject(err)
);

// http response 拦截器
const filterArr = [
  0, 1, 2, 3, 1031, 1041, 6071, 102190708, 102110705, 102020729, 202220007, 202220008, 202220011,
  202220012, 202220013, 102160504
];
/**
 * 1,2,3资产用来判断状态
 * 1031 下单用到
 * 1041 撮合未就绪，不显示
 */
axios.interceptors.response.use(
  (response) => {
    const resData = response.data;
    if (resData.hasOwnProperty("code")) {
      const index = filterArr.findIndex((item) => item === resData?.code);
      if (index > -1) return response;

      const apiUrl = response.config.url;
      if (noReserveUrl.indexOf(apiUrl) > -1) return response;

      if (resData?.code && csr && i18n?.store?.data[i18n.language]) {
        const msgObj =
          i18n?.store?.data[i18n.language]?.code?.[resData.code] || `error: ${resData.code}`;

        // const msgObj =
        //   i18n?.store?.data[i18n.language]?.translation?.ResCode?.[
        //     resData.code
        //   ];
        message.error(msgObj);
      }
    }
    return response;
  },
  (error) => {
    console.log(error);
    if (error?.response) {
      if (error?.response.status === 401) {
        store.dispatch(setIsLogin(false));
        removeInjectInfo("_authorization");
      }
    }
    return Promise.reject(error?.response);
  }
);

export default axios;
