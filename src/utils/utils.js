import http from "../services/http";
import { getInjectInfo } from "../functions/info";

/* 封装极验验证公共方法
 **obj需含有两属性
 *{containerId//添加按钮的ID
 *nextHandle//下一步操作
 *}
 */
export class myGeetest {
  constructor(obj) {
    this.settings = obj;
  }

  geetestValidate() {
    const that = this;
    let lang = "en";
    switch (getInjectInfo("locale")) {
      case "zh_CN":
        lang = "zh";
        break;
      case "zh_TW":
        lang = "zh-tw";
        break;
      case "ko_KR":
        lang = "ko";
        break;

      default:
        break;
    }
    // console.log('lang', lang)
    http.get(`/users/gee/init_env?t=${new Date().getTime()}`).then((res) => {
      let data = res.data;
      that.reqId = data.reqId;
      window.initGeetest(
        {
          gt: data.gt,
          challenge: data.challenge,
          offline: !data.success,
          new_captcha: true,
          product: "bind",
          lang
        },
        that.handler
      );
    });
  }

  // 一次验证
  handler = (captchaObj) => {
    const that = this;
    captchaObj
      .onReady(() => {
        // your code
      })
      .onClose(() => {
        that.settings.closeGee();
      })
      .onSuccess(() => {
        // your code
        const result = captchaObj.getValidate();
        // console.log(result);
        that.geetestValidateAgain(result);
      })
      .onError(() => {
        captchaObj.reset(); // 调用该接口进行重置
      });
    if (!document.getElementById(that.settings.containerId)) return;
    document.getElementById(that.settings.containerId).addEventListener("click", () => {
      if (that.settings.form.every((item) => item !== false && item !== undefined)) {
        captchaObj.verify();
      }
    });
  };

  // 极验二次验证
  geetestValidateAgain(result) {
    const that = this;
    const parmars = {
      geetest_challenge: result.geetest_challenge,
      geetest_validate: result.geetest_validate,
      geetest_seccode: result.geetest_seccode,
      reqId: this.reqId
    };
    that.settings.nextHandle(parmars);
  }
}

/**
 *全局唯一uuid
 */
export const uuid = () => {
  const s = [];
  const hexDigits = "0123456789abcdef";
  for (let i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23] = "-";

  return s.join("");
};

export const allAreaCodeList = () => {
  return [
    { label: "ChinaCode", value: "+86" },
    { label: "HongKongCode", value: "+852" },
    { label: "Macao", value: "+853" },
    { label: "Taiwan", value: "+886" },
    { label: "Korea", value: "+82" },
    { label: "Japan", value: "+81" },
    { label: "American", value: "+1 " },
    { label: "Canada", value: "+1" },
    { label: "England", value: "+44" },
    { label: "Singapore", value: "+65" },
    { label: "Malaysia", value: "+60" },
    { label: "Thailand", value: "+66" },
    { label: "Vietnam", value: "+84" },
    { label: "ThePhilippines", value: "+63" },
    { label: "Indonesia", value: "+62" },
    { label: "Italy", value: "+39" },
    { label: "Russia", value: "+7" },
    { label: "NewZealand", value: "+64" },
    { label: "Netherlands", value: "+31" },
    { label: "Sweden", value: "+46" },
    { label: "Australia", value: "+61" },
    { label: "Ukraine", value: "+380" },
    { label: "France", value: "+33" },
    { label: "Afghanistan", value: "+93" },
    { label: "Argentina", value: "+54" },
    { label: "Austria", value: "+43" },
    { label: "Bangladesh", value: "+880" },
    { label: "Bhutan", value: "+975" },
    { label: "Brazil", value: "+55" },
    { label: "CentralAfrica", value: "+236" },
    { label: "Colombia", value: "+57" },
    { label: "Cuba", value: "+53" },
    { label: "Egypt", value: "+20" },
    { label: "Finland", value: "+358" },
    { label: "Hawaii", value: "+1808" },
    { label: "Iran", value: "+98" },
    { label: "Iraq", value: "+964" },
    { label: "Ireland", value: "+353" },
    { label: "Israel", value: "+972" },
    { label: "Jamaica", value: "+1876" },
    { label: "Jordan", value: "+962" },
    { label: "Kuwait", value: "+965" },
    { label: "Laos", value: "+856" },
    { label: "Kyrgyzstan", value: "+996" },
    { label: "Maldive", value: "+960" },
    { label: "Mexico", value: "+52" },
    { label: "Monaco", value: "+377" },
    { label: "Myanmar", value: "+95" },
    { label: "Nepal", value: "+977" },
    { label: "Panama", value: "+507" },
    { label: "Peru", value: "+51" },
    { label: "Pakistan", value: "+92" },
    { label: "Switzerland", value: "+41" },
    { label: "Turkey", value: "+90" },
    { label: "Germany", value: "+49" },
    { label: "India", value: "+91" },
    { label: "AE", value: "+971" },
    { label: "BN", value: "+673" },
    { label: "NG", value: "+234" }
  ];
};

export const areaCodeList = () => {
  return [
    // { label: "ChinaCode", value: "+86" },
    { label: "HongKongCode", value: "+852" },
    { label: "Macao", value: "+853" },
    { label: "Taiwan", value: "+886" },
    { label: "Korea", value: "+82" },
    { label: "Japan", value: "+81" },
    { label: "American", value: "+1 " },
    { label: "Canada", value: "+1" },
    { label: "England", value: "+44" },
    { label: "Singapore", value: "+65" },
    { label: "Malaysia", value: "+60" },
    { label: "Thailand", value: "+66" },
    { label: "Vietnam", value: "+84" },
    { label: "ThePhilippines", value: "+63" },
    { label: "Indonesia", value: "+62" },
    { label: "Italy", value: "+39" },
    { label: "Russia", value: "+7" },
    { label: "NewZealand", value: "+64" },
    { label: "Netherlands", value: "+31" },
    { label: "Sweden", value: "+46" },
    { label: "Australia", value: "+61" },
    { label: "Ukraine", value: "+380" },
    { label: "France", value: "+33" },
    { label: "Afghanistan", value: "+93" },
    { label: "Argentina", value: "+54" },
    { label: "Austria", value: "+43" },
    { label: "Bangladesh", value: "+880" },
    { label: "Bhutan", value: "+975" },
    { label: "Brazil", value: "+55" },
    { label: "CentralAfrica", value: "+236" },
    { label: "Colombia", value: "+57" },
    { label: "Cuba", value: "+53" },
    { label: "Egypt", value: "+20" },
    { label: "Finland", value: "+358" },
    { label: "Hawaii", value: "+1808" },
    { label: "Iran", value: "+98" },
    { label: "Iraq", value: "+964" },
    { label: "Ireland", value: "+353" },
    { label: "Israel", value: "+972" },
    { label: "Jamaica", value: "+1876" },
    { label: "Jordan", value: "+962" },
    { label: "Kuwait", value: "+965" },
    { label: "Laos", value: "+856" },
    { label: "Kyrgyzstan", value: "+996" },
    { label: "Maldive", value: "+960" },
    { label: "Mexico", value: "+52" },
    { label: "Monaco", value: "+377" },
    { label: "Myanmar", value: "+95" },
    { label: "Nepal", value: "+977" },
    { label: "Panama", value: "+507" },
    { label: "Peru", value: "+51" },
    { label: "Pakistan", value: "+92" },
    { label: "Switzerland", value: "+41" },
    { label: "Turkey", value: "+90" },
    { label: "Germany", value: "+49" },
    { label: "India", value: "+91" },
    { label: "AE", value: "+971" },
    { label: "BN", value: "+673" },
    { label: "NG", value: "+234" }
  ];
};

export const getQueryString = (param) => {
  const reg = new RegExp("(^|&)" + param + "=([^&]*)(&|$)", "i");
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return "";
};

export const getMainDomain = () => {
  try {
    const host = window.location.host;
    let hostArr = host.split(".");
    if (hostArr.length === 2) {
      return `.${host}`;
    }
    if (hostArr.length === 3) {
      return `.${hostArr[1]}.${hostArr[2]}`;
    }
    return "localhost";
  } catch (error) {
    console.log(error, "hostReplace error");
    return "localhost";
  }
};

export const hostReplace = () => {
  try {
    const host = window.location.host;
    const preDomain = process.env.NEXT_PUBLIC_PRE_DOMAIN;
    let hostArr = host.split(".");
    if (hostArr.length === 2) {
      if (preDomain) {
        return `${preDomain}.${host}`;
      } else {
        return host;
      }
    }
    if (hostArr.length === 3) {
      if (preDomain) {
        return `${preDomain}.${hostArr[1]}.${hostArr[2]}`;
      } else {
        return `${hostArr[1]}.${hostArr[2]}`;
      }
    }
    return host;
  } catch (error) {
    return "";
  }
};

export const mHostReplace = () => {
  try {
    const host = window.location.host;
    const mDomain = process.env.NEXT_PUBLIC_M_DOMAIN;
    let hostArr = host.split(".");
    if (hostArr.length === 2) {
      if (mDomain) {
        return `${mDomain}.${host}`;
      } else {
        return host;
      }
    }
    if (hostArr.length === 3) {
      if (mDomain) {
        return `${mDomain}.${hostArr[1]}.${hostArr[2]}`;
      } else {
        return `${hostArr[1]}.${hostArr[2]}`;
      }
    }
    return "";
  } catch (error) {
    return "";
  }
};

export const wsReplace = (type = "future") => {
  try {
    const host = window.location.host;
    const preDomain =
      type === "future"
        ? process.env.NEXT_PUBLIC_FUTURE_WS_URL
        : process.env.NEXT_PUBLIC_SPOT_WS_URL;
    let hostArr = host.split(".");
    if (hostArr.length === 2) {
      return `https://${preDomain}.${host}`;
    }
    if (hostArr.length === 3) {
      return `https://${preDomain}.${hostArr[1]}.${hostArr[2]}`;
    }
    return type === "future"
      ? process.env.NEXT_PUBLIC_FUTURE_LOCAL_WS
      : process.env.NEXT_PUBLIC_SPOT_LOCAL_WS;
  } catch (error) {
    return "";
  }
};

export const desensitization = (str, frontLen = 3, endLen = 3) => {
  if (!str || str.length <= 4) {
    return "****";
  }
  let xing = "****";
  return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
};

export const MarkedPriceLink = (v) => {
  switch (v) {
    case "zh_CN":
      return "https://ccfox.zendesk.com/hc/zh-cn/articles/360028073772-%E5%90%88%E7%90%86%E4%BB%B7%E6%A0%BC%E6%A0%87%E8%AE%B0";
    case "zh_TW":
      return "https://ccfox.zendesk.com/hc/zh-hk/articles/360028073772-%E5%90%88%E7%90%86%E5%83%B9%E6%A0%BC%E6%A8%99%E8%A8%98";
    case "en_US":
    case "ko_KR":
      return "https://ccfox.zendesk.com/hc/en-us/articles/360028073772-Fair-Price-Marking";

    default:
      break;
  }
};

export const FundingRateLink = (v) => {
  switch (v) {
    case "zh_CN":
      return "https://ccfox.zendesk.com/hc/zh-cn/articles/360028387091-%E6%B0%B8%E7%BB%AD%E5%90%88%E7%BA%A6%E6%8C%87%E5%8D%97";
    case "zh_TW":
      return "https://ccfox.zendesk.com/hc/zh-hk/articles/360028387091-%E6%B0%B8%E7%BA%8C%E5%90%88%E7%B4%84";
    case "en_US":
    case "ko_KR":
      return "https://ccfox.zendesk.com/hc/en-us/articles/360028387091-Perpetual-Contract";

    default:
      break;
  }
};

export const LiqPriceCLink = (v) => {
  switch (v) {
    case "zh_CN":
      return "https://ccfox.zendesk.com/hc/zh-cn/articles/360028366011-%E5%BC%BA%E5%88%B6%E5%B9%B3%E4%BB%93";
    case "zh_TW":
      return "https://ccfox.zendesk.com/hc/zh-hk/articles/360028366011-%E5%BC%B7%E5%88%B6%E5%B9%B3%E5%80%89";
    case "en_US":
    case "ko_KR":
      return "https://ccfox.zendesk.com/hc/en-us/articles/360028366011-Why-did-I-get-liquidated-";

    default:
      break;
  }
};

export const AutodeleverageQueueLink = (v) => {
  switch (v) {
    case "zh_CN":
      return "https://ccfox.zendesk.com/hc/zh-cn/articles/360028366071-%E5%BC%BA%E5%88%B6%E5%87%8F%E4%BB%93";
    case "zh_TW":
      return "https://ccfox.zendesk.com/hc/zh-hk/articles/360028366071-%E5%BC%B7%E5%88%B6%E6%B8%9B%E5%80%89";
    case "en_US":
    case "ko_KR":
      return "https://ccfox.zendesk.com/hc/en-us/articles/360028366071-Forced-Deleveraging";

    default:
      break;
  }
};

export const resolveSavedWidgetContent = (
  _savedWidgetContent,
  symbol,
  interval,
  buyColor,
  sellColor
) => {
  let candleStyle = _savedWidgetContent?.charts?.[0]?.panes?.[0]?.sources?.[0]?.state?.candleStyle;

  let volumePalette =
    _savedWidgetContent?.charts?.[0]?.panes?.[1]?.sources?.[0]?.state?.palettes?.volumePalette;

  let mainSymbol = _savedWidgetContent?.charts?.[0]?.panes?.[0]?.sources?.[0]?.state?.symbol;
  if (mainSymbol) {
    _savedWidgetContent.charts[0].panes[0].sources[0].state.symbol = symbol;
    _savedWidgetContent.charts[0].panes[0].sources[0].state.shortName = symbol;
  }

  let mainInterval = _savedWidgetContent?.charts?.[0]?.panes?.[0]?.sources?.[0]?.state?.interval;
  if (mainInterval) {
    _savedWidgetContent.charts[0].panes[0].sources[0].state.interval = interval;
  }

  if (candleStyle) {
    candleStyle.upColor = buyColor;
    candleStyle.borderUpColor = buyColor;
    candleStyle.wickUpColor = buyColor;

    candleStyle.downColor = sellColor;
    candleStyle.borderDownColor = sellColor;
    candleStyle.wickDownColor = sellColor;
  }

  if (volumePalette) {
    volumePalette.colors[1].color = buyColor;

    volumePalette.colors[0].color = sellColor;
  }

  _savedWidgetContent.charts[0].chartProperties.paneProperties.legendProperties.showLegend = true;

  return _savedWidgetContent;
};

export const getSavedWidgetContentItem = (id) => {
  try {
    let content = JSON.parse(window.localStorage.getItem("tv_chart_save"));

    return content?.[id] || null;
  } catch (error) {
    console.log("tv_chart_save error", error);
    return null;
  }
};

export const setSavedWidgetContentItem = (id, item) => {
  try {
    let content = JSON.parse(window.localStorage.getItem("tv_chart_save")) || {};

    content[id] = item;

    window.localStorage.setItem("tv_chart_save", JSON.stringify(content));
  } catch (error) {
    console.log("tv_chart_save error", error);
  }
};
