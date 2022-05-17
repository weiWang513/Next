/*
  极验mixin
 */
// 导入极验官方给的代码
import React, { useEffect, useState } from "react";
import http from "../services/http";
// import { getInjectInfo } from "../functions/info";
// 自定义语言与极验语言对应表
const geetestLangMap = {
  zh_CN: "zh-cn",
  zh_TW: "zh-tw",
  en_US: "en",
  ja_JP: "ja",
  ko_KR: "ko",
  ru_RU: "ru",
};
// // 极验默认配置
// const geetestOptions = {
//   product: "popup", // 极验展现形式 可选值有 float、popup、custom、bind
//   width: "100%",
//   lang: "zh_CN",
//   autoShow: true, // 当product为bind时，如果次参数为true，则在极验加载完成后立即显示极验弹窗
//   area: null, // 极验绑定的元素，仅在 product为 custom、float、popup时需要传递
//   autoRefreshOnLangChange: true, // 语言改变时是否自动刷新
// };
const useGeeTest = () => {
  const [geetest, setGeetest] = useState({
    geetestSuccessData: null, // 极验用户行为操作成功后的数据
    geetestObj: null, // 极验对象
    geetestLoading: false,
    geetestFatched: false, // 判断是否从服务器获取了极验数据
    showGeetest: false, // 是否使用极验
    sign: "", // 极验降级 用的签名
    geetestRestartCountMax: 5, // 极验重试最大此时
    count: 1,
    geetestOptions: {},
  });

  const [geetestOptions, setGeetestOptions] = useState({
    product: "popup", // 极验展现形式 可选值有 float、popup、custom、bind
    width: "100%",
    lang: "zh_CN",
    autoShow: true, // 当product为bind时，如果次参数为true，则在极验加载完成后立即显示极验弹窗
    area: null, // 极验绑定的元素，仅在 product为 custom、float、popup时需要传递
    autoRefreshOnLangChange: true, // 语言改变时是否自动刷新
  });

  const changeLang = (lang) => {
    let options = geetest.geetestOptions;
    if (options.autoRefreshOnLangChange && geetest.geetestObj) {
      initGeetest({
        ...options,
        lang: lang.code,
      });
    }
  };

  // 初始化极验
  const initGeetest = (options, onSuccess, onClose) => {
    if (!options || {}.toString.call(options) !== "[object Object]") {
      console.error("initGeetest方法的参数options必须是一个对象！");
      return;
    }
    // let newOptions = Object.assign({}, geetestOptions, options);
    let newOptions = { ...geetestOptions, ...options };
    if (
      (newOptions.product === "popup" ||
        newOptions.product === "custom" ||
        newOptions.product === "float") &&
      !newOptions.area
    ) {
      console.error(
        "product为popup、custom、float时options参数中必须有area属性，area属性值可以为css选择器或dom元素！"
      );
      return;
    }
    // geetest.geetestOptions = newOptions;
    setGeetest({ ...geetest, geetestOptions: newOptions });
    _geetestRegist_(newOptions, onSuccess, onClose);
  };

  // 重置极验
  const geetestReset = (cb) => {
    if (geetest.geetestObj) {
      //   geetest.geetestSuccessData = {};
      setGeetest({ ...geetest, geetestSuccessData: {} });
      geetest.geetestObj.reset();
      if (typeof cb === "function") {
        cb();
      }
    } else {
      console.error("极验不存在!");
    }
  };

  // 显示极验弹窗，此方法只有在product为bind时才有效
  const geetestShow = () => {
    if (geetest.geetestObj) {
      if (geetest.geetestOptions.product === "bind") {
        geetest.geetestObj.verify();
      } else {
        console.error("极验的product值非bind，无法调用show！");
      }
    } else {
      console.error("极验不存在!");
    }
  };

  // 初始化极验，内部使用
  const _initGeetestInternal_ = (data, options, onSuccess, onClose) => {
    let geetest = geetest;

    window.initGeetest(
      {
        // 以下 4 个配置参数为必须，不能缺少
        gt: data.gt,
        challenge: data.challenge,
        offline: !data.success, // 表示用户后台检测极验服务器是否宕机
        new_captcha: true, // 用于宕机时表示是新验证码的宕机
        product: options.product, // 产品形式，包括：float，popup，bind
        width: options.width,
        lang: geetestLangMap[options.lang],
      },
      function (captchaObj) {
        if (geetest?.geetestObj) {
          try {
            // 如果之前已经初始化过了，则线将之前生成的dom移除掉
            geetest.geetestObj.destroy();
          } catch (e) {
            console.error("极验销毁失败", e);
          }
        }
        // geetest.geetestObj = captchaObj;
        setGeetest({ ...geetest, geetestObj: captchaObj });
        if (
          options.product === "popup" ||
          options.product === "custom" ||
          options.product === "float"
        ) {
          captchaObj.appendTo(options.area);
        }
        // 为bind模式时极验加载完成后自动弹出极验弹窗
        if (options.autoShow && options.product === "bind") {
          captchaObj.onReady(() => {
            captchaObj.verify();
          });
        }
        // geetest.geetestSuccessData = {};
        setGeetest({ ...geetest, geetestSuccessData: {} });
        // 当用户操作后并且通过验证后的回调
        captchaObj.onSuccess(function () {
          let successData = captchaObj.getValidate();
          //   geetest.geetestSuccessData = successData;
          setGeetest({
            ...geetest,
            geetestSuccessData: { ...successData, reqId: data.reqId },
          });
          console.log("用户行为验证通过数据", successData);
          /*
              这种方式不可采用，原因，作用域会被缓存
              if (typeof options.callback === 'function') {
                options.callback(successData);
              }
              用户行为验证通过后调用回调函数
            */
          if (typeof onSuccess === "function") {
            onSuccess({ ...successData, reqId: data.reqId });
          }
        });
        captchaObj.onError(function (e) {
          console.error("极验出错了", e);
        });
        captchaObj.onClose(function (e) {
          if (typeof onClose === "function") {
            onClose();
          }
        });
        console.log("极验实例", captchaObj);
      }
    );
  };

  // 调用接口，获取极验数据
  const _geetestRegist_ = (options, onSuccess, onClose) => {
    if (geetest.geetestLoading) {
      return;
    }
    // geetest.geetestLoading = true;
    setGeetest({ ...geetest, geetestLoading: true });
    http
      .get(`/users/gee/init_env?t=${new Date().getTime()}`)
      .then((res) => {
        let data = res.data;
        // TIP 后台需要控制是否开启极验，因此需要判断 enable===true && success===1 才显示极限
        // geetest.sign = data.sign;
        // geetest.geetestFatched = true;
        if (
          typeof data.enable == "undefined" ||
          (data.enable === true && data.success === 1)
        ) {
          //   geetest.showGeetest = true;
          setGeetest({ ...geetest, showGeetest: true });
        } else {
          //   geetest.showGeetest = false;
          //   geetest.geetestLoading = false;

          setGeetest({ ...geetest, showGeetest: false, geetestLoading: false });

          /*// 如果极验禁用，则调用onDisableGeetest回调
          if(typeof options.onDisableGeetest === 'function'){
            options.onDisableGeetest();
          }*/
          // 如果极验禁用，则调用onDisableGeetest回调
          if (typeof onDisableGeetest === "function") {
            onDisableGeetest();
          }
          return;
        }
        // geetest.geetestLoading = false;
        setGeetest({ ...geetest, geetestLoading: false });
        _initGeetestInternal_(data, options, onSuccess, onClose);
      })
      .catch((err) => {
        // console.error("极验初始化失败", err);
        // if (geetest.count > geetest.geetestRestartCountMax) {
        //   geetest.geetestLoading = false;
        //   return;
        // }
        // console.log("正在重试初始化极验！当前次数：" + geetest.count);
        // geetest.count++;
        // _geetestRegist_(options);
      });
  };

  useEffect(() => {
    return () => {
      if (geetest.geetestObj) {
        geetest.geetestObj.destroy();
      }
    };
  }, []);

  return { initGeetest, geetest, geetestShow };
};

export default useGeeTest;
