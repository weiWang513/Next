import dayjs from "dayjs";
import store from "../store/store";
import { i18n } from "next-i18next";
const Big = require("big.js");

export const formatByPriceTick = (num, contractId) => {
  if (num === "") return 0;
  if (!Number(num)) return num;

  let id = 0;
  if (!contractId) {
    id = store.getState().contract.contractId;
  } else {
    id = contractId;
  }
  let contractList = store.getState().contract.contractList;
  if (!contractList.find((el) => el.contractId === id) || !num) return num;
  let priceTick = scientificNotationToString(
    Number(contractList.find((el) => el.contractId === id).priceTick).toString()
  );
  let floatLen = priceTick.indexOf(".") > -1 ? priceTick.split(".")[1].length : 0;
  let numT = num.toString();
  let num0 = numT.indexOf(".") > -1 ? numT.split(".")[0] : numT;
  let num1 = "";
  for (let i = 0; i < floatLen; i++) {
    if (numT.indexOf(".") > -1) {
      num1 += numT.split(".")[1][i] ? numT.split(".")[1][i] : "0";
    } else {
      num1 += "0";
    }
  }
  return floatLen === 0 ? num0 : `${num0}.${num1}`;
};

export const formatSpotPriceByTick = (num, contractId) => {
  if (num === "") return 0;
  if (!Number(num)) return num;

  let id = 0;
  if (!contractId) {
    id = store.getState().spot.spotId;
  } else {
    id = contractId;
  }
  let spotList = store.getState().spot.spotList;
  if (!spotList.find((el) => el.contractId === id) || !num) return num;
  let priceTick = scientificNotationToString(
    Number(spotList.find((el) => el.contractId === id).priceTick).toString()
  );
  let floatLen = priceTick.indexOf(".") > -1 ? priceTick.split(".")[1].length : 0;
  let numT = num.toString();
  let num0 = numT.indexOf(".") > -1 ? numT.split(".")[0] : numT;
  let num1 = "";
  for (let i = 0; i < floatLen; i++) {
    if (numT.indexOf(".") > -1) {
      num1 += numT.split(".")[1][i] ? numT.split(".")[1][i] : "0";
    } else {
      num1 += "0";
    }
  }
  return floatLen === 0 ? num0 : `${num0}.${num1}`;
};

export const getContractSymbolById = (id) => {
  if (!id) return null;
  const contractList = store.getState().contract.contractList;
  const contractItem = contractList.find((item) => item.contractId === id);
  const symbol = contractItem ? contractItem.symbol : "";
  return symbol;
};

export const getCurrencySymbolById = (id) => {
  if (!id) return null;
  const contractCurrencyList = store.getState().contract.currencyList;
  const spotCurrencyList = store.getState().spot.currencyList;
  const currencyList = contractCurrencyList.length > 0 ? contractCurrencyList : spotCurrencyList;
  const currencyItem = currencyList.find((item) => item.currencyId === id);
  const symbol = currencyItem ? currencyItem.symbol : "";
  return symbol;
};

export const getCurrencyPrecisionById = (id) => {
  if (!id) return 2;
  const contractCurrencyList = store.getState().contract.currencyList;
  const spotCurrencyList = store.getState().spot.currencyList;
  const currencyList = contractCurrencyList.length > 0 ? contractCurrencyList : spotCurrencyList;
  const currencyItem = currencyList.find((item) => item.currencyId === id);
  const precision = currencyItem ? currencyItem.displayPrecision : 8;
  return precision;
};

export const dateFormat = (value, type = "YYYY-MM-DD HH:mm:ss") => {
  // 日期格式化
  if (!value) return "";
  value = dayjs(value).format(type);
  return value;
};
export const dateFormatYMD = (value, type = "YYYY.MM.DD") => {
  // 日期格式化
  if (!value) return "";
  value = dayjs(value).format(type);
  return value;
};
//  //日期格式化
export const dateFormat2 = (value, type = "YYYY.MM.DD HH:mm:ss") => {
  // 日期格式化
  if (!value) return "";
  value = dayjs(value).format(type);
  return value;
};

export const dateFormatForHis = (value, type = "HH:mm MM/DD") => {
  // 日期格式化
  if (!value) return "";
  value = dayjs(value).format(type);
  return value;
};

export const dateFormatForCond = (value, type = "MM/DD HH:mm") => {
  // 日期格式化
  if (!value) return "";
  value = dayjs(value).format(type);
  return value;
};

export const dateFormatForTick = (value, type = "HH:mm:ss") => {
  // 日期格式化
  if (!value) return "";
  value = dayjs(value).format(type);
  return value;
};

export const dateFormatForMDHMS = (value, type = "MM.DD HH:mm:ss") => {
  // 日期格式化
  if (!value) return "";
  value = dayjs(value).format(type);
  return value;
};

export const toRateFilter = (value) => {
  // 将小数变成百分比
  if (!value) return "0%";
  if (value > 0) {
    value = `${parseInt(value * 100)}%`;
  } else if (value < 0) {
    value = `${parseInt(value * 100)}%`;
  }
  return value;
};

export const toRate2Filter = (value) => {
  // 将小数变成百分比
  if (!value) return "0%";
  value = `${parseFloat(value * 100).toFixed(2)}%`;
  return value;
};
export const toRate4Filter = (value) => {
  // 将小数变成百分比
  if (!value) return "0%";
  value = `${parseFloat(value * 100).toFixed(4)}%`;
  return value;
};
export const formatByLength = (value) => {
  // 格式化成million
  if (!value) return 0;
  const valueArr = value.toString().split(".");
  if (valueArr[0].length > 9) {
    return `${parseFloat(valueArr[0] / 1000000000).toFixed(4)}b`;
  }
  if (valueArr[0].length > 6) {
    return `${parseFloat(valueArr[0] / 1000000).toFixed(4)}m`;
  }
  if (valueArr[0].length > 3) {
    return `${parseFloat(valueArr[0] / 1000).toFixed(2)}k`;
  }
  return value.toFixed(2).toString();
};
/**
 * @description 涨跌色标注
 * @author wangwei
 * @param {*} param
 */
export const addColorProperty = (oldVal, newVal, property) => {
  if (!newVal || !newVal.length) {
    return false;
  }
  newVal.forEach((item, index) => {
    let compareVal;
    if (oldVal.length) {
      compareVal = oldVal[index] ? Number(oldVal[index][property]) : 0;
    } else {
      compareVal = 0;
    }
    if (Number(item[property]) > compareVal) {
      item.upDowns = 1;
    } else if (Number(item[property]) === compareVal) {
      item.upDowns = 0;
    } else {
      item.upDowns = -1;
    }
  });
};

export const slice6 = (value) => {
  if (!Number(value) || value === true) return "0.000000";
  let v = new Big(value).toFixed(18).toString();
  const nArr = v.split(".");
  const pNArrLength = nArr[1] && nArr[1].length ? nArr[1].length : 0;
  if (pNArrLength >= 6) {
    return nArr[0] + "." + nArr[1].slice(0, 6);
  } else {
    let str = "";
    for (let i = 0; i < 6 - pNArrLength; i++) {
      str += "0";
    }
    return pNArrLength === 0 ? v + "." + str : v + "" + str;
  }
};

// export const toFix6 = value => {
//   if (!Number(value)) return 0
//   if (Number(value) === 0) return 0
//   let v
//   if (typeof value === 'string') {
//     v = value
//   } else if (typeof value === 'number') {
//     v = new Big(value).toFixed(18).toString()
//   } else {
//     v = String(value)
//   }

//   if (v.indexOf('e') > -1) {
//     let vItem = v.split('e')
//     let v0 = Number(vItem[0]).toFixed(2)
//     return `${v0}e${vItem[1]}`
//   }

//   if (v.indexOf('.') > -1) {
//     const nArr = v.split('.')
//     const pNArr = nArr[1].split('')
//     for (const key in pNArr) {
//       if (Number(pNArr[key]) > 0) {
//         if (Number(key) > 7) {
//           // const n = `${nArr[0]}.00000001`
//           const n = `${nArr[0]}`
//           return n
//         }
//         if (Number(key) < 7 && Number(key) > -1) {
//           const n = `${nArr[0]}.${nArr[1].slice(0, Number(key) + 2)}`
//           return n
//         }
//         if (Number(key) === 7 && Number(key) > -1) {
//           const n = `${nArr[0]}.${nArr[1].slice(0, Number(key) + 1)}`
//           return n
//         }
//         break
//       }
//     }
//   } else {
//     return v
//   }
//   return Number(value).toFixed(2)
// }
export const toDeExponential = (value) => {
  if (!Number(value)) return 0;
  if (Number(value) === 0) return 0;
  let str = value.toString();
  if (!/e/i.test(str)) {
    return value;
  }
  return Number(value)
    .toFixed(18)
    .replace(/\.?0+$/, "");
};

export const toFix64 = (value) => {
  return Number(value).toFixed(4);
};

//  距离结算时间
export const filterTime = (msd) => {
  if (msd === "--") return "--";
  if (msd < 0) {
    return i18n.t("Deliveryed");
  } else if (msd === 0) {
    return "--";
  } else {
    var time = parseFloat(msd) / 1000;

    if (time != null && time !== "") {
      if (time > 60 && time < 60 * 60) {
        let min = parseInt(time / 60.0);
        let sec = parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
        let finalMin = min >= 10 ? min : "0" + min;
        let finalSec = sec >= 10 ? sec : "0" + sec;
        // 分秒
        time = `00:${finalMin}:${finalSec}`;
      } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
        let hour = parseInt(time / 3600.0);
        let min = parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60);
        let sec = parseInt(
          (parseFloat((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60) -
            parseInt((parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60)) *
            60
        );
        let finalHour = hour >= 10 ? hour : "0" + hour;
        let finalMin = min >= 10 ? min : "0" + min;
        let finalSec = sec >= 10 ? sec : "0" + sec;
        // 时分秒
        time = `${finalHour}:${finalMin}:${finalSec}`;
      } else if (time >= 60 * 60 * 24) {
        // console.log(msd)
        let mss = parseFloat(msd);
        let day = parseInt(mss / (1000 * 60 * 60 * 24));
        let hour = parseInt((mss % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let min = parseInt((mss % (1000 * 60 * 60)) / (1000 * 60));
        let sec = Math.floor((mss % (1000 * 60)) / 1000);
        let finalDay = day;
        let finalHour = hour >= 10 ? hour : "0" + hour;
        let finalMin = min >= 10 ? min : "0" + min;
        let finalSec = sec >= 10 ? sec : "0" + sec;
        // 天时分秒
        time = `${finalDay} ${i18n.t("Days")} ${finalHour}:${finalMin}:${finalSec}`;
      } else {
        // 秒
        let sec = parseInt(time);
        let finalSec = sec >= 10 ? sec : "0" + sec;
        time = `00:00:${finalSec}`;
      }
    }
    return time;
  }
};

export const isNumber = (obj) => {
  return Number(obj) === +Number(obj);
};

export const formatPrice = (v, o, pt) => {
  /**
   * @param v inputValue
   * @param o oldValue
   * @param pt priceTick
   */
  if (v === "") {
    return "";
  }
  let reg = /^\d+\.?\d*$/;
  let regNumber = /^\d+\.?\d+$/;
  if (reg.test(v)) {
    if (pt && regNumber.test(v)) {
      let price = Number.isInteger(Number(new Big(v).div(pt)))
        ? v
        : new Big(Math.floor(new Big(v).div(pt))).times(pt).toString();

      return price.length > 8 ? price.slice(0, 9) : price;
    } else {
      return v;
    }
  } else {
    return o;
  }
};
export const formatQuantity = (v, o, ls) => {
  /**
   * @param v inputValue
   * @param o oldValue
   * @param ls lotSize
   */
  if (v === "") {
    return "";
  }
  let reg = /^\d+\.?\d*$/;
  let regNumber = /^\d+\.?\d+$/;
  if (reg.test(v)) {
    if (ls && regNumber.test(v)) {
      let price = Number.isInteger(Number(new Big(v).div(ls)))
        ? v
        : new Big(Math.floor(new Big(v).div(ls))).times(ls).toString();
      return price.length > 6 ? price.slice(0, 7) : price;
    } else {
      return v;
    }
  } else {
    return o;
  }
};
export const formatAmount = (v, o) => {
  /**
   * @param v inputValue
   * @param o oldValue
   * @param ls lotSize
   */
  if (v === "") {
    return "";
  }
  let reg = /^\d+\.?[0-9]{0,6}$/;
  // let reg =/^\d{1,3}$|^\d{1,3}[.]\d{1,6}$/
  // let regNumber = /^\d+\.?\d+$/
  if (reg.test(v) && v.length < 12) {
    return v;
  } else {
    return o;
  }
};

export const round = (n, d = 2) => {
  return new Big(n || 0).round(d, 0).toPrecision(d, 0).toString();
};

/**
 * @description 科学计数法转为string
 * @param {string, number} param
 */
export function scientificNotationToString(param) {
  let _isMinus = Number(param) < 0 ? true : false;
  let strParam = String(Math.abs(param));
  let flag = /e/.test(strParam);
  if (!flag) return String(param);

  // 指数符号 true: 正，false: 负
  let sysbol = true;
  if (/e-/.test(strParam)) {
    sysbol = false;
  }

  // 指数
  let index = Number(strParam.match(/\d+$/)[0]);
  // 基数
  let basis = strParam.match(/^[\d\.]+/)?.[0].replace(/\./, "");

  if (sysbol) {
    return `${_isMinus ? "-" : ""}${basis.padEnd(index + 1, 0)}`;
  } else {
    return `${_isMinus ? "-" : ""}${basis.padStart(index + basis.length, 0).replace(/^0/, "0.")}`;
  }
}

/**
 * 保留小数点后有效位数的方法
 *
 * @param {源数据} v
 * @param {有效位数} decimal
 * @returns
 */

export const toFix6 = (v, decimal = 2) => {
  if (!Number(v)) return "0";
  v = Number(v).toString().replace(/,/g, "");
  if (!Number(v) || Math.abs(Number(v)) < 1e-18) {
    return new Big(0).toFixed(Number(decimal) || 2).toString();
  }
  if (Math.abs(Number(v)) >= 1) {
    return Number(
      new Big(v).round(Number(decimal) || 2, 0).toFixed(Number(decimal) || 2)
    ).toString();
  }
  let _numA = scientificNotationToString(v).split(".");
  let _idx = 0;
  if (_numA[1]) {
    let _numAr = _numA[1].split("");
    for (let i = 0; i < _numAr.length; i++) {
      let _num = _numAr[i];
      // if (Number(_num) > 0) {
      _idx = i;
      break;
      // }
    }
    let _n = _numA[1].slice(0, _idx + decimal);
    let _nA = _n.split("");
    let _nIndex = _nA.reverse().findIndex((e) => Number(e) > 0);
    let _index = 0; // _n.length - _nIdex - 1
    if (_nIndex > -1) {
      _index = _n.length - _nIndex;
      return scientificNotationToString(`${_numA[0]}.${_numA[1].slice(0, _index)}`);
    } else {
      return 0;
    }

    // return scientificNotationToString(`${_numA[0]}.${_numA[1].slice(0, _idx + decimal)}`)
  } else {
    return _numA[0];
  }
};
// /**
//  * 保留小数点后有效位数的方法
//  *
//  * @param {源数据} v
//  * @param {有效位数} decimal
//  * @param {是否千分位} isToThousands
//  * @returns
//  */

// export const toFix6 = (v, decimal = 2) => {
//   if (!Number(v)) return '0'
//   v = Number(v).toString().replace(/,/g, '')
//   if (!Number(v) || Number(v) < 1e-18) {
//     return new Big(0).toFixed(decimal).toString()
//   }
//   if (Number(v) >= 1) {
//     return Number(new Big(v)
//       .round(decimal, 0)
//       .toFixed(decimal))
//       .toString()
//   }
//   let _numA = scientificNotationToString(v).split('.')
//   let _idx = 0
//   if (_numA[1]) {
//     let _numAr = _numA[1].split('')
//     for (let i = 0; i < _numAr.length; i++) {
//       let _num = _numAr[i]
//       if (Number(_num) > 0) {
//         _idx = i
//         break
//       }
//     }
//     return scientificNotationToString(`${_numA[0]}.${_numA[1].slice(0, _idx + decimal)}`)
//   }
// }
// /**
//  * 保留小数点后有效位数的方法
//  *
//  * @param {源数据} v
//  * @param {有效位数} decimal
//  * @param {是否千分位} isToThousands
//  * @returns
//  */

// export const toFix6 = (v, decimal = 4, isToThousands = false) => {
//   if (!Number(v)) return '0'
//   v = Number(v).toString().replace(/,/g, '')
//   if (!Number(v) || Number(v) < 1e-18) {
//     return new Big(0).toFixed(decimal).toString()
//   }
//   if (Number(v) >= 1) {
//     if (isToThousands) {
//       return toThousands(
//         new Big(v)
//           .round(decimal, 0)
//           .toFixed(decimal)
//           .toString()
//       )
//     } else {
//       return Number(new Big(v)
//         .round(decimal, 0)
//         .toFixed(decimal))
//         .toString()
//     }
//   }
//   let _numA = scientificNotationToString(v).split('.')
//   let _idx = 0
//   if (_numA[1]) {
//     let _numAr = _numA[1].split('')
//     for (let i = 0; i < _numAr.length; i++) {
//       let _num = _numAr[i]
//       if (Number(_num) > 0) {
//         _idx = i
//         break
//       }
//     }
//     if (isToThousands) {
//       return toThousands(scientificNotationToString(`${_numA[0]}.${_numA[1].slice(0, _idx + decimal)}`))
//     } else {
//       return scientificNotationToString(`${_numA[0]}.${_numA[1].slice(0, _idx + decimal)}`)
//     }
//   }
// }

export const formatMillions = (v) => {
  if (!Number(v)) return "0";
  return new Big(v || 0).div(1e6).toFixed(3).toString();
};

/**
 * 大数格式化
 * @param {*} v
 * @param {*} withUnits 是否带单位 默认 true
 * @desc 根据数据长度按照K/M/B的格式进行展示，分别对应千/百万/十亿的位置，小数点后保留3位，不足按实际位数保留，
 * @returns
 */
export const formatBigNumber = (v, withUnits = true, decimal = 3) => {
  if (!Number(v)) return "0";

  if (new Big(v).gte(1e12)) {
    return `${new Big(v || 0).div(1e12).toFixed(decimal).toString()}${withUnits ? "T" : ""}`;
  } else if (new Big(v).gte(1e9)) {
    return `${new Big(v || 0).div(1e9).toFixed(decimal).toString()}${withUnits ? "B" : ""}`;
  } else if (new Big(v).gte(1e6)) {
    return `${new Big(v || 0).div(1e6).toFixed(decimal).toString()}${withUnits ? "M" : ""}`;
  } else if (new Big(v).gte(1e3)) {
    return `${new Big(v || 0).div(1e3).toFixed(decimal).toString()}${withUnits ? "K" : ""}`;
  }

  return v;
};

/**
 * 大数格式化
 * @param {*} v
 * @desc 根据数据长度按照K/M/B的格式进行展示，分别对应千/百万/十亿的位置，小数点后保留3位，不足按实际位数保留，
 * @returns
 */
export const formatBigNumberSymbol = (v) => {
  if (!Number(v)) return "";

  if (new Big(v).gte(1e12)) {
    return `T`;
  } else if (new Big(v).gte(1e9)) {
    return `B`;
  } else if (new Big(v).gte(1e6)) {
    return `M`;
  } else if (new Big(v).gte(1e3)) {
    return `K`;
  }

  return "";
};

/**
 * 现货法币价格格式化
 * @param {*} v
 * @desc  
 *   v>1  保留两位数字 
 *   v<1  换算后的汇率价格展示规则:
          当计算出的值，为0.00XXXXX，即0后面的两位小数都是0时，取小数点后6位
          e.g. 
          0.0038xxxxx => 0.0038xx
          0.0000583xxxx => 0.000058
          当计算后，小数点后两位中任意一位不为0，则取小数点后两位
          e.g. 
          0.015xxxxxx => 0.01
          多余部分均舍去，不做进位处理
  * @returns 
 */
export const formatSpotCurrency2FiatValue = (v) => {
  if (!Number(v)) return "0.00";

  if (Number(v) > 1) return toFix6(v, 2);

  v = Number(v).toString().replace(/,/g, "");

  let _numA = scientificNotationToString(v).split(".");

  if (_numA[1]) {
    let _numAr = _numA[1].split("");

    let _idx = _numAr?.findIndex((el) => Number(el) > 0);

    let res = _numA[1].slice(0, _idx < 2 ? 2 : 6);

    return `${_numA[0]}.${res}`;
  }

  return v;
};
