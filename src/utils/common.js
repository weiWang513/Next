import {
  placeOrder,
  adjustMarginRate,
  conditionOrderPlace,
  condActiveQuery,
  conditionCancels,
  cancelCondOrder
} from "../services/api/contract";
import { uuid } from "./utils";
import { message } from "@ccfoxweb/uikit";
import { toFix6, slice6, formatByPriceTick, isNumber, formatPrice } from "./filters";
import Cookies from "js-cookie";
import React from "react";
import { i18n } from "next-i18next";
// let orderUuid = uuid()
// let ajustMarginUuid = uuid()
// import I18n from '../locales/i18n'
// import history from '../history'
import { _shouldRestful, _trackEvent } from "./tools";
// import { updateCondiOrderUuid, updateCondiRestfulTimes, updateConditions } from '../store/actions/SocketAction'
import store from "../store/store";
import {
  updateCondiRestfulTimes,
  updateConditionOrders,
  updateConditionResf
} from "../store/modules/assetsSlice";
const Big = require("big.js");

/**
 * @description 涨跌色标注
 * @author wangwei
 * @param {
 * gearingxie 杠杆
 * contractId 合约ID
 * side： 买卖方向 买1，卖-1
 * type：价格类型 1（限价），3（市价）
 * quantity：数量
 * positionEffect：开平方向 开仓1，平仓2
 * orderSubType：0（默认值），1（被动委托），2（最近价触发条件委托），3（指数触发条件委托），4（标记价触发条件委托）
 * stopPrice：触发价格
 * price：委托价格
 * modeType 仓位模式 1全仓2逐仓
 * successMsg 下单成功回调参数
 * callback 成功回调
 * fail 失败回调
 * } param
 */
export const place = (param, callback, fail, successMsg) => {
  // 是否隐藏弹框
  // if (JSON.stringify(this.hideDialog) === '["0"]') {
  //   localStorage.setItem('hideDialog', true)
  // }
  // 控制按钮点击一次
  // this.orderMask = true
  // this.btnDisable = true

  let placeUuid = uuid();

  // 判断全仓还是逐仓
  let isAllPositions = param.modeType;
  // let marginRate = param.modeType === 2 ? Number(new Big(1).div(param.gearingxie).toString()).toFixed(10) : 0
  // let marginRate = new Big(1).div(param.gearingxie).toString().slice(0, 8);
  let marginRate = new Big(1)
    .div(param.gearingxie || 0.01)
    .round(6)
    .toString();
  let qs = {
    contractId: param.contractId,
    side: param.side,
    orderType: param.type === 1 ? 1 : 3,
    price: param.type === 1 ? param.price : "",
    quantity: param.quantity,
    positionEffect: param.positionEffect, // 开仓1，平仓2
    marginType: param.positionEffect === 1 ? isAllPositions : 1, // positionEffect=1时，全仓1，逐仓2；positionEffect=2时，传1
    // marginRate: param.positionEffect === 1 ? (isAllPositions === 2 ? marginRate : '') : 0, // positionEffect=1时，如果margintype=2(this.isAllPositions全仓还是逐仓)则需要填；positionEffect=2时，传0
    marginRate: marginRate, // 保证金率（1/margin_rate=杠杠倍数），1、全仓时值>=0，0：取合约配置值，2、逐仓>0
    orderSubType: param.orderSubType || 0, // 1 被动委托，0代表不勾选
    clientOrderId: param.clientOrderId
  };
  if (param.stopPrice) {
    qs.triggerPrice = param.stopPrice;
  }
  if (param.Passive) {
    qs.orderSubType = 1;
  }
  if (param.orderSubType > 1) {
    let _qs = { ...qs };
    _qs.triggerType = _qs.orderSubType;
    _qs.orderPrice = _qs.price;
    _qs.conditionOrderType = param.conditionOrderType || 0;
    _qs.uuid = param.uuid;
    _qs.hasReady = param.hasReady;
    _qs.hasCancel = param.hasCancel;
    // if (param.positionEffect === 2) {
    //   // 撤销相同类型所有订单
    //   _qs.hasCancel = true
    // }
    delete _qs.orderSubType;
    delete _qs.price;
    // store.dispatch(updateCondiOrderUuid(placeUuid))
    conditionOrderPlace({
      params: _qs,
      headers: { unique: placeUuid }
    }).then((res) => {
      if (res.data.code === 0) {
        restfulConditionOrders();
        if (callback) callback(successMsg);
      }
    });
  } else {
    placeOrder({
      params: qs,
      headers: { unique: placeUuid }
    })
      .then((response) => {
        // changeOrderUuid()
        placeUuid = uuid();
        let res = response.data;
        // this.btnDisable = false
        console.log(res, "wangwei下单");
        if (res.code === 0) {
          _shouldRestful();
          // postOrderRestful()

          // this._profitAndLoss(side, type)

          // this.orderMask = false
          // this.$message({
          //   message: this.$t('OrderedSuccessfully'),
          //   type: 'success'
          // })
          // this.resetForm()
          console.log("成功----------wangwei-");
          if (callback) callback(successMsg);
        } else if (res.code === 1031) {
          console.log("失败----------wangwei-");
          if (fail) fail();

          // 仓位模式不同
          let my = {
            contractId: param.contractId,
            // initMarginRate: isAllPositions === 1 ? '0' : marginRate, // 如果是全仓。先将逐仓改为X1
            initMarginRate: marginRate, // 如果是全仓。先将逐仓改为X1
            marginType: isAllPositions,
            posiSide: store.getState().place.posiMode ? 0 : param.side
          };

          adjustMarginRate({
            params: my,
            headers: { unique: placeUuid }
          })
            .then((response) => {
              let res = response.data;
              // console.log(res, "改变仓位模式");
              // changeAjustMarginUuid()
              placeUuid = uuid();
              if (res.code === 0) {
                // this.orderMask = false
                placeOrder({
                  params: qs,
                  headers: { unique: placeUuid }
                })
                  .then((response) => {
                    // changeOrderUuid()
                    placeUuid = uuid();
                    let res = response.data;
                    // console.log(res,'改变margintype后，下单')
                    if (res.code === 0) {
                      // postOrderRestful()
                      _shouldRestful();

                      // this._profitAndLoss(side, type)

                      // this.$message({
                      //   message: this.$t('OrderedSuccessfully'),
                      //   type: 'success'
                      // })
                      // this.resetForm()
                      console.log("成功----------wangwei-");
                      if (callback) callback(successMsg);
                    } else {
                      // 帮用户切换杠杆成功，但是下单不成功，切回去杠杆
                      let temp = {
                        contractId: param.contractId,
                        // initMarginRate: isAllPositions === 2 ? '0' : marginRate, // 如果是全仓。先将逐仓改为X1
                        initMarginRate: marginRate, // 如果是全仓。先将逐仓改为X1
                        marginType: isAllPositions === 2 ? 1 : 2,
                        posiSide: store.getState().place.posiMode ? 0 : param.side
                      };
                      adjustMarginRate({
                        params: temp,
                        headers: { unique: placeUuid }
                      })
                        .then((res) => {
                          // changeAjustMarginUuid()
                          placeUuid = uuid();
                          console.log(res);
                        })
                        .catch(() => {
                          // changeAjustMarginUuid()
                          placeUuid = uuid();
                        });
                      // this.$message({ message: res.msg, type: "warning" });
                    }
                  })
                  .catch((err) => {
                    // changeOrderUuid()
                    placeUuid = uuid();
                    console.log(err, "wangwei");
                    console.log("失败----------wangwei-");
                  });
              } else {
                console.log("失败----------wangwei-");
                // this.orderMask = false
                // this.$message({ message: res.msg, type: "warning" });
              }
            })
            .catch(() => {
              // changeAjustMarginUuid()
              placeUuid = uuid();
            });
        } else {
          console.log("失败----------wangwei-");
          if (fail) fail();
          // this.orderMask = false
          // this.$message({ message: res.msg, type: "warning" });
        }
      })
      .catch((err) => {
        // changeOrderUuid()
        placeUuid = uuid();
        console.log("失败----------wangwei-");
        console.log(err, "wangwei");
      });
  }
};
export const restfulConditionOrders = () => {
  // if (store.getState().assets.condiRestfulTimes > 2) {
  //   store.dispatch(updateCondiRestfulTimes(0));
  //   return;
  // }
  setTimeout(() => {
    if (store.getState().assets.conditionResf) {
      return;
    }
    if (store.getState().app.isLogin) {
      condActiveQuery().then((res) => {
        if (res.data.code === 0) {
          store.dispatch(updateConditionOrders(res.data.data));
          store.dispatch(updateConditionResf(false));
        }
      });
    }
  }, 4000);
};

export const getSimpleText45 = (html) => {
  if (!html) return "";

  var re1 = new RegExp("<.+?>", "g"); //匹配html标签的正则表达式，"g"是搜索匹配多个符合的内容
  var msg = html.replace(re1, ""); //执行替换成空字符

  return msg.length > 45 ? msg.slice(0, 45) + "..." : msg;
};

export const getInjectInfo = (type) => {
  if (typeof type !== "string") return null;
  if (process.env.REACT_APP_INJECT_COOKIE === "true") {
    return Cookies.get(type);
  } else {
    return localStorage.getItem(type);
  }
};

export const setInjectInfo = (type, value) => {
  if (typeof type !== "string") return null;
  if (process.env.REACT_APP_INJECT_COOKIE === "true") {
    Cookies.set(type, value);
  } else {
    localStorage.setItem(type, value);
  }
};

export const removeInjectInfo = (type, value) => {
  if (typeof type !== "string") return null;
  if (process.env.REACT_APP_INJECT_COOKIE === "true") {
    Cookies.remove(type, value);
  } else {
    localStorage.removeItem(type, value);
  }
};

export const savePlaceParams = (key, value) => {
  let paramsObj = getInjectInfo("placeParams") ? JSON.parse(getInjectInfo("placeParams")) : {};
  paramsObj[key] = value;
  setInjectInfo("placeParams", JSON.stringify(paramsObj));
};

export const setupWebViewJavascriptBridge = (callback) => {
  console.log(callback, "jsBridge---setupWebViewJavascriptBridge");
  /* eslint-disable */
  // Android使用
  if (window.WebViewJavascriptBridge) {
    return callback(WebViewJavascriptBridge);
  }
  document.addEventListener(
    "WebViewJavascriptBridgeReady",
    function () {
      callback(WebViewJavascriptBridge);
    },
    false
  );

  // iOS使用
  if (window.WVJBCallbacks) {
    return window.WVJBCallbacks.push(callback);
  }
  window.WVJBCallbacks = [callback];
  var WVJBIframe = document.createElement("iframe");
  WVJBIframe.style.display = "none";
  WVJBIframe.src = "https://__bridge_loaded__";
  document.documentElement.appendChild(WVJBIframe);
  setTimeout(function () {
    document.documentElement.removeChild(WVJBIframe);
  }, 0);
};

export const send = (method, params) => {
  console.log('JS calling handler "testObjcCallback"', method, params);
  setupWebViewJavascriptBridge((bridge) => {
    bridge.callHandler(method, params, function (response) {
      console.log("JS got response", response);
    });
  });
};

export const get = (method, callHandler) => {
  setupWebViewJavascriptBridge((bridge) => {
    let u = navigator.userAgent;
    let isAndroid = u.indexOf("Android") > -1 || u.indexOf("Adr") > -1;
    if (isAndroid) bridge.init();
    bridge.registerHandler(method, (data) => {
      console.log(data, "jsBridge---get");
      callHandler(data);
    });
  });
};

export const getParameterByName = (name) => {
  name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
  var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
  //nicaiwocaibucai
  if (results && results[1]) {
    process.env.REACT_APP_INJECT_COOKIE === "true"
      ? setInjectInfo("_authorization", decodeURIComponent(results && results[1]))
      : setInjectInfo("_authorization", decodeURIComponent(results && results[1]));
  }

  return results == null ? "" : decodeURIComponent(results[1]);
};
/**
 * 预期强平价格
 * @param {买卖方向} side
 * @param {价格} price
 * @param {单量行情} futureQuot
 * @param {可用余额} available
 * @param {当前合约} contractItem
 * @param {保证金梯度} varietyMarginAll
 * @param {当前持仓} posListProps
 * @param {价格类型} priceType
 * @param {最大杠杆} crossLever
 * @param {数量} quantity
 * @param {成本} cost
 * @param {仓位模式} modeType
 * @param {杠杆} leverType
 */
export const futureFlatPrice = (
  side,
  price,
  futureQuot,
  available,
  contractItem,
  varietyMarginAlls,
  posListProps,
  priceType,
  crossLever,
  quantity,
  cost,
  modeType,
  leverType
) => {
  if (true) return "--";
  // if (!this.closeDialog) return '--'
  // type,contractSide,margintype（全仓)
  let type = priceType < 5 ? (priceType % 2 ? 1 : 2) : 2; // this.dialogType // 1限价2市价
  let finalPrice; // 最终结果
  // 最低维持保证金率: 如果用户的持仓列表里，有同合约的持仓（仓位模式不一样都无所谓，只要合约相同即可），就取   maintainMarginRate ，如果没有同合约的，则取该合约对应的 variety里最小的maintarinMarginRate（通常是第一条）
  let maintainMarginRate;
  let contractSide = contractItem.contractSide;
  // let contractType = this.contractType
  let contractUnit = contractItem.contractUnit;
  // let side = side // 买1；卖2
  let cangModel;
  let quancangGanggan = crossLever; // leverTypes[leverTypes.length - 1].value
  // let quantity = quantity // side > 0 ? quantityBuy : quantitySell

  // console.log(this.futureGuaranteeGradsList[0],'this.futureGuaranteeGradsList[0]')
  // maintarinMarginRate最低维持保证金率: 如果用户的持仓列表里，有同合约的持仓（仓位模式不一样都无所谓，只要合约相同即可），就取   maintainMarginRate ，如果没有同合约的，则取该合约对应的 variety里最小的maintainMarginRate（通常是第一条）。
  let varietyMarginAll = varietyMarginAlls[contractItem.contractId];
  if (varietyMarginAll && varietyMarginAll[0]) {
    let temp =
      posListProps.find((el) => el.contractId === contractItem.contractId) || varietyMarginAll[0];
    maintainMarginRate = temp.maintainMarginRate || temp.maintainRate;
  }
  if (varietyMarginAll && varietyMarginAll[0]) {
    let v = toFix6(new Big(1).div(varietyMarginAll[0].initRate));
  }
  if (quancangGanggan && maintainMarginRate) {
    // 数据准备

    let referencePrice = type === 1 || type === 3 ? price : futureQuot.lastPrice; // 参考价
    // console.log((type === 1 ||  type === 3), 'wangwei=====referencePrice');
    if (referencePrice === "0" || quantity === 0) return "--";
    if (!maintainMarginRate) return "--";

    // 可用资金

    let avail = available;

    // 委托价值 * 下单杠杠倍数的倒数=成本
    let res1 = cost; // this.side === 1 ? costBuy : costSell
    // 可用资金+委托价值 * 下单杠杠倍数的倒数=可用资金+成本
    let res11 = new Big(avail).plus(res1);
    // 最低维持保证金率 * 参考价
    let res2 = new Big(referencePrice).times(maintainMarginRate);
    //  合约单位 * abs(下单数量)
    let res3 = new Big(Math.abs(Number(quantity.toString()))).times(contractUnit).toString();
    // abs(下单数量)* 合约单位 * 参考价
    let res33 = new Big(Math.abs(Number(quantity.toString())))
      .times(contractUnit)
      .times(referencePrice);
    // ( 1 - 下单数量对方向 * 最低维持保证金率)
    let res4 = new Big(1).minus(new Big(side).times(maintainMarginRate));
    // 下单数量对方向 *  参考价
    let res5 = new Big(side).times(referencePrice);

    // console.log(referencePrice,'参考价')
    // console.log(this.limitCost,'限价价成本')
    // console.log(this.marketCost,'市价成本')
    // console.log(contractUnit,'合约单位')
    // console.log(maintainMarginRate,'最低维持保证金率')
    // console.log(avail,'可用资金')
    // console.log(res33,'res33')
    // console.log(res3,'res3')
    // console.log(toFix6(res1),'res1')
    // console.log(res4,'res4')
    // console.log(maintainMarginRate,'maintainMarginRate')

    if (res3 === "0") return "--";

    cangModel =
      modeType === 1
        ? 0 // leverTypes[leverTypes.length - 1].value
        : leverType;
    // cangModel = leverType

    // 11 or 12 contractSide or contractType(type)
    if (contractSide === 1) {
      // 全仓
      if (cangModel === 0) {
        // console.log("quancang1");
        finalPrice = new Big(referencePrice).minus(
          new Big(res11).div(res3).minus(res2).times(side)
        );
      } else {
        // console.log("zhucang1");
        finalPrice = new Big(referencePrice).minus(new Big(res1).div(res3).minus(res2).times(side));
      }
    }

    // 21 or 22 contractSide or contractType(type)
    if (contractSide === 2) {
      // 全仓
      if (cangModel === 0) {
        // console.log("quancang2");
        finalPrice = new Big(res33).div(new Big(res3).times(res4).plus(new Big(res5).times(res11)));
      } else {
        // console.log("zhucang2");
        finalPrice = new Big(res33).div(new Big(res3).times(res4).plus(new Big(res5).times(res1)));
      }
    }
  } else {
    finalPrice = 0;
  }
  console.log(finalPrice, "finalPrice");
  return Math.max(0, finalPrice);
};

/**
 * 单价
 * @param {买卖方向} side
 * @param {当前合约} contractItem
 * @param {单量行情} futureQuot
 * @param {价格} propsPrice
 * @param {最大杠杆} crossLever
 * @param {仓位模式} modeType
 * @param {杠杆} leverType
 * @param {价格类型} priceType
 * @param {最大可开标志} allin
 */
export const singleCost = (
  side,
  contractItem,
  futureQuot,
  propsPrice,
  crossLever,
  modeType,
  leverType,
  priceType,
  allin
) => {
  if (!contractItem) {
    return false;
  }
  // if (!this.countType) {
  //   return 1
  // }
  // 用户最大杠杆倍数
  const lastLever = crossLever; // leverTypes[leverTypes.length - 1].value
  // const lastLever = '100x'
  // 委托价格 市价取对手一价
  // futureQuot.lastPrice = Number(futureQuot.lastPrice)
  // let price = allin
  //   ? new Big(futureQuot.lastPrice || 1)
  //   : priceType === 3
  //   ? new Big(
  //       Number(
  //         getFirstPrice(side, futureQuot)
  //           ? getFirstPrice(side, futureQuot)
  //           : futureQuot.lastPrice
  //       ) || 1
  //     )
  //   : new Big(Number(Number(propsPrice) ? propsPrice : 1));
  // let price = allin
  //   ? new Big(futureQuot.lastPrice || 1)
  //   : priceType === 3
  //   ? new Big(
  //       Number(
  //         getFirstPrice(side, futureQuot)
  //           ? getFirstPrice(side, futureQuot)
  //           : futureQuot.lastPrice
  //       ) || 1
  //     )
  //   : new Big(Number(Number(propsPrice) ? propsPrice : 1));
  let price =
    priceType === 3
      ? new Big(
          Number(
            getFirstPrice(side, futureQuot) ? getFirstPrice(side, futureQuot) : futureQuot.lastPrice
          ) || 1
        )
      : new Big(Number(Number(propsPrice) ? propsPrice : 1));
  // 合约单位
  let unit = new Big(contractItem.contractUnit || 0.01);
  // 杠杆 全仓取最大杠杆倍数
  // let lever = modeType === 1 ? new Big(Number(lastLever)) : new Big(Number(leverType))
  let lever = new Big(Number(leverType));
  // contract_side =1,  一张合约的成本 =  ( 委托价格 * 合约单位  )  / 杠杆倍数  +   合约单位 * max（  委托方向 *（委托价 - 标记价格，0） )
  // contract_side =2, 一张合约的成本 =  ( 1 / 委托价格 * 合约单位  )  / 杠杆倍数  + 合约单位 * max（  委托方向 *（ 1 / 标记价格 - 1/ 委托价） ,0）
  // 市价用对手价
  let singleCost =
    contractItem.contractSide === 1
      ? price.times(unit).div(lever) // .plus(unit.times(addMargin(price, side, contractItem, futureQuot)))
      : unit.div(price.times(lever)); //.plus(unit.times(addMargin(price, side, contractItem, futureQuot)))
  return singleCost;
};

/**
 * 计算额外保证金
 * @param {委托价} a
 * @param {*委托方向} side
 * @param {当前合约} contractItem
 * @param {行情} futureQuot
 */

export const addMargin = (a, side, contractItem, futureQuot) => {
  if (!contractItem) {
    return false;
  }
  let _left = 0;
  let _price = a;
  let _side = new Big(side);
  let clearPrice = new Big(Number(futureQuot.clearPrice || 1));
  let n1 = new Big(1);
  if (contractItem.contractSide === 1) {
    _left = _side.times(_price.minus(clearPrice));
  } else {
    _left = _side.times(n1.div(clearPrice).minus(n1.div(_price)));
  }
  return Number(_left.toString()) > 0 ? Number(_left.toString()) : 0;
};

/**
 *
 * @param {反向} side
 * @param {行情} futureQuot
 */
export const getFirstPrice = (side, futureQuot) => {
  return side > 0 ? futureQuot.buyPrice : futureQuot.sellPrice;
};

// 保证金梯度
/**
 *
 * @param {当前合约} contractItem
 * @param {保证金梯度} varietyMarginAll
 * @param {杠杆} leverType
 */
export const queryVariety = (contractItem, varietyMarginAll) => {
  if (!contractItem) {
    return false;
  }
  if (!varietyMarginAll[0]) return false;

  let item = varietyMarginAll[contractItem.contractId];
  let varietyItem;

  let posi = 0;
  if (item) {
    let list = item;
    varietyItem = list.find((el) => Number(el.posiQty) > posi).initRate;
  } else {
    let list = varietyMarginAll[0];

    varietyItem = list.find(
      (el) => el.varietyId === contractItem.varietyId && Number(el.posiQty) > posi
    )
      ? list.find((el) => el.varietyId === contractItem.varietyId && Number(el.posiQty) > posi)
          .initRate
      : 0.01;
  }
  let maxLever = new Big(1)
    .div(varietyItem || 0.01)
    .round()
    .toString();

  let leverTypes = [
    // { label: '1x', value: 1 },
    // { label: '2x', value: 2 },
    // { label: '3x', value: 3 },
    { label: "5x", value: 5 },
    { label: "10x", value: 10 },
    { label: "20x", value: 20 },
    {
      label: (
        <div className="leverRed" key="50x">
          50x
        </div>
      ),
      value: 50
    },
    {
      label: (
        <div className="leverRed" key="100x">
          100x
        </div>
      ),
      value: 100
    }
  ];
  leverTypes = [
    ...leverTypes.filter((el) => el.value < maxLever),
    {
      label:
        maxLever >= 50 ? (
          <div className="leverRed" key="maxLever">
            {maxLever}x
          </div>
        ) : (
          `${maxLever}x`
        ),
      value: maxLever
    }
  ];
  // this.setState({
  //   leverTypes: leverTypes,
  //   crossLever: maxLever,
  // })
  return {
    leverTypes: leverTypes,
    crossLever: maxLever
  };
};

/**
 * 委托价值
 * @param {买入数量} quantity
 * @param {价格类型} priceType
 * @param {当前合约} contractItem
 * @param {价格} price
 * @param {行情} futureQuot
 */
export const calcCommissionValueFn = (quantity, priceType, contractItem, price, futureQuot) => {
  if (!contractItem) {
    return false;
  }
  let commissionValue = 0;
  const cCount = new Big(Number(quantity));
  const cUnit = contractItem.contractUnit ? new Big(contractItem.contractUnit) : new Big(0); // 合约单位
  const cPrice =
    priceType === 1 ? new Big(Number(price || 0)) : new Big(Number(futureQuot.lastPrice || 0)); // 价格
  if (contractItem.contractSide === 1) {
    // 正向合约
    commissionValue = cCount.times(cUnit).times(cPrice);
  } else {
    // 反向合约
    if (cPrice.toString() !== "0") {
      commissionValue = cCount.times(cUnit).div(cPrice);
    } else {
      commissionValue = new Big(0);
    }
  }
  return commissionValue;
  // this.setState({ commissionValue: commissionValue })
  // this.cost(v, commissionValue, modeType, leverType)
};

/**
 *  placeholder 计算价值
 * @param {数量/金额} v
 * @param {价格类型} priceType
 * @param {价格} price
 * @param {行情} futureQuot
 * @param {按张按金额} countType
 * @param {当前合约} contractItem
 */
export const calcPlaceHolderValue = (v, priceType, price, futureQuot, countType, contractItem) => {
  const cPrice =
    priceType % 2 === 1 ? new Big(Number(price || 1)) : new Big(Number(futureQuot.lastPrice || 1)); // 价格
  let _placeHolderCost = 0;
  if (countType === 1) {
    _placeHolderCost = slice6(new Big(Number(v) || 0).times(cPrice).toString());
  } else {
    // _placeHolderCost = contractItem
    //   ? contractItem.contractSide === 1
    //     ? new Big(Number(v) || 0).times(contractItem.contractUnit).times(cPrice) // .div(cLeverage || 1)
    //     : new Big(Number(v) || 0)
    //         .div(cPrice || 1)
    //         .times(contractItem.contractUnit) // .div(cLeverage || 1)
    //   : 0
  }
  return _placeHolderCost;
};

// calcMaxOrderLimit() {
//   if (!this.props.contractItem || !this.props.contractItem.contractUnit) return 0

//   const cPrice =
//     priceType % 2 === 1
//       ? new Big(Number(this.props.price || 1))
//       : new Big(Number(this.props.futureQuot.lastPrice || 1))

//   let qty = 0
//   if (this.props.countType === 0) {
//     qty = this.props.contractItem.orderLimit.toString()
//   } else {
//     qty =
//       this.props.contractItem.contractSide === 1
//         ? new Big(Number(this.props.contractItem.orderLimit) || 0)
//             .times(this.props.contractItem.contractUnit)
//             .times(cPrice)
//             .toString()
//         : new Big(Number(this.props.contractItem.orderLimit) || 0)
//             .div(cPrice)
//             .times(this.props.contractItem.contractUnit)
//             .toString()
//   }

//   return Math.floor(qty)
// }

/**
 * 获取触发标志
 * @param {单量行情} futureQuot
 * @param {触发价} stopPrice
 * @param {触发类型} stopType
 */
export const getTriggerSymbol = (futureQuot, stopPrice, stopType) => {
  let lastPrice = futureQuot.lastPrice;
  let indexPrice = futureQuot.indexPrice;
  let clearPrice = futureQuot.clearPrice;
  switch (stopType) {
    case 2:
      return Number(lastPrice) <= Number(stopPrice)
        ? // ? `最新价≥${stopPrice}`
          `${i18n.t("StopLast")}≥${stopPrice}`
        : Number(lastPrice) >= Number(stopPrice)
        ? // ? `最新价≤${stopPrice}`
          `${i18n.t("StopLast")}≤${stopPrice}`
        : "";
    case 3:
      return Number(indexPrice) < Number(stopPrice)
        ? // ? `指数价≥${stopPrice}`
          `${i18n.t("StopIndex")}≥${stopPrice}`
        : Number(indexPrice) > Number(stopPrice)
        ? // ? `指数价≤${stopPrice}`
          `${i18n.t("StopIndex")}≤${stopPrice}`
        : "";
    case 4:
      return Number(clearPrice) < Number(stopPrice)
        ? // ? `标记价≥${stopPrice}`
          `${i18n.t("StopMark")}≥${stopPrice}`
        : Number(clearPrice) > Number(stopPrice)
        ? // ? `标记价≤${stopPrice}`
          `${i18n.t("StopMark")}≤${stopPrice}`
        : "";

    default:
      return "";
  }
};
/**
 * 计算下单弹框数据
 * @param {买卖方向}} side
 * @param {价格} price
 * @param {行情} futureQuot
 * @param {可用余额} available
 * @param {当前合约} contractItem
 * @param {保证金梯度} varietyMarginAll
 * @param {持仓列表} posListProps
 * @param {价格类型} priceType
 * @param {最大杠杆} crossLever
 * @param {数量} quantity
 * @param {成本} cost
 * @param {仓位模式} modeType
 * @param {杠杆} leverType
 * @param {合约Id} contractId
 * @param {条件单类型} stopType
 */
export const calcPlaceModalData = (
  side,
  price,
  futureQuot,
  available,
  contractItem,
  varietyMarginAll,
  posListProps,
  priceType,
  crossLever,
  quantity,
  cost,
  modeType,
  leverType,
  contractId,
  stopType,
  stopPrice
) => {
  let FlatPrice = formatByPriceTick(
    futureFlatPrice(
      side,
      price,
      futureQuot,
      available,
      contractItem,
      varietyMarginAll,
      posListProps,
      priceType,
      crossLever,
      quantity,
      cost,
      modeType,
      leverType
    ),
    contractId
  );
  // let calcRiskRate = calcRiskRate()
  let type = priceType < 5 ? (priceType % 2 ? 1 : 2) : 2;
  let condition = priceType < 5 && priceType > 2 ? 1 : 0;
  let conditionSymbol = getTriggerSymbol(futureQuot, stopPrice, stopType);
  let _placeData = {
    symbol: contractItem.symbol,
    OrderPrice: type === 1 ? price : 0,
    OrderNum: quantity, // side > 0 ? quantityBuy : quantitySell,
    cost: cost, /// side > 0 ? toFix6(costBuy) : toFix6(costSell),
    // LeverageMultiple:
    //   modeType === 1
    //     ? crossLever // leverTypes[leverTypes.length - 1].value
    //     : leverType,
    LeverageMultiple: leverType,
    futureFlatPrice: FlatPrice,
    side: side,
    condition: condition,
    StopCondition: conditionSymbol,
    contractSide: contractItem.contractSide,
    currencyName: contractItem.currencyName,
    commodityName: contractItem.commodityName,
    type: type
  };
  return {
    placeData: _placeData,
    placeModal: true
  };
};

// 下单委托价 高于 {标记价格*（1+0.5/杠杆倍数）}的买单 或 低于 {最新价*（1-0.5/杠杆倍数）} 时，会有以下提醒
// 如果是市价下单， 下单委托价=对手价
/**
 * orderNoticeCalc 下单提醒
 * @param {*} side
 * @param {*} futureQuot
 * @param {*} price
 * @param {*} lever
 * @param {*} showPlaceModal
 */
export const orderNoticeCalc = (side, futureQuot, price, lever, showPlaceModal, handelPlace) => {
  let clearPrice = new Big(futureQuot.clearPrice || 1);
  let lastPrice = new Big(futureQuot.lastPrice || 1);
  let comparePriceH = Number(clearPrice.times(new Big(1).plus(new Big(0.5).div(lever))).toString());
  let comparePriceL = Number(lastPrice.times(new Big(1).minus(new Big(0.5).div(lever))).toString());

  if ((side > 0 && price > comparePriceH) || (side < 0 && price < comparePriceL)) {
    console.log(
      "placeOrder",
      side,
      comparePriceL,
      comparePriceH,
      side > 0 && price > comparePriceH,
      side < 0 && price < comparePriceL
    );
    // Modal.alert(
    //   i18n.t('RiskCommission'),
    //   `${i18n.t('RiskDescriptionA')}
    //     ${i18n.t('RiskDescriptionB')}
    //     ${i18n.t('RiskDescriptionC')}`,
    //   [
    //     {
    //       text: i18n.t('Cancel'),
    //       onPress: () => console.log('cancel'),
    //       style: 'cancel'
    //     },
    //     {
    //       text: i18n.t('Confirm'),
    //       onPress: () => {
    //         showPlaceModal(side)
    //         // handlePlace(side)
    //       }
    //     }
    //   ]
    // )
    showPlaceModal(side);
    // confirm({
    //   title: i18n.t('RiskCommission'),
    //   content: `${i18n.t('RiskDescriptionA')}
    //     ${i18n.t('RiskDescriptionB')}
    //     ${i18n.t('RiskDescriptionC')}`,
    //   onOk() {
    //     showPlaceModal(side)
    //   },
    //   onCancel() {},
    // })
  }
  // else if (side < 0 && price < comparePriceL) {
  //   // Modal.alert(
  //   //   i18n.t('RiskCommission'),
  //   //   `${i18n.t('RiskDescriptionA')}
  //   //     ${i18n.t('RiskDescriptionB')}
  //   //     ${i18n.t('RiskDescriptionC')}`,
  //   //   [
  //   //     {
  //   //       text: i18n.t('Cancel'),
  //   //       onPress: () => console.log('cancel'),
  //   //       style: 'cancel'
  //   //     },
  //   //     {
  //   //       text: i18n.t('Confirm'),
  //   //       onPress: () => {
  //   //         // handlePlace(side)
  //   //         showPlaceModal(side)
  //   //       }
  //   //     }
  //   //   ]
  //   // )
  //   confirm({
  //     title: i18n.t('RiskCommission'),
  //     // icon: <ExclamationCircleOutlined />,
  //     content: `${i18n.t('RiskDescriptionA')}
  //       ${i18n.t('RiskDescriptionB')}
  //       ${i18n.t('RiskDescriptionC')}`,
  //     onOk() {
  //       showPlaceModal(side)
  //     },
  //     onCancel() {},
  //   })
  // }
  else {
    // handlePlace(side)
    handelPlace(side);
  }
};

/**
 * 价格截取格式化
 * @param {需要格式化的数字} v
 * @param {最小价格单位} priceTick
 */
export const priceFilter = (v, priceTick) => {
  let _lth = priceTick < 1 ? String(priceTick).split(".")[1].length : 0;
  return Number(new Big(Number(v) || 0).round(_lth, 0).toString());
};
/**
 * 止盈止损保存
 * @param {当前持仓} holdPosiItem
 * @param {止损输入} inputLoss
 * @param {止损类型} lossStopType
 * @param {止损价格类型、默认限价} lossPriceType
 * @param {止盈输入} inputProfit
 * @param {止盈类型} profitStopType
 * @param {止盈价格类型} profitPriceType
 * @param {当前止盈价格} stopProfitPrice
 * @param {止损switch} checkedLoss
 * @param {止损撤单uuid} lossCancelUuid
 * @param {修改止损撤单uuid} changeLossCancelUuid
 * @param {止损下单回调} stopLossCb
 * @param {止盈switch} checkedProfit
 * @param {止盈撤单uuid} profitCancelUuid
 * @param {修改止盈撤单uuid} changeProfitCancelUuid
 * @param {止盈下单回调} stopProfitCb
 * @param {撤单成功回调} cancelSuccess
 */
export const save = (
  holdPosiItem,
  inputLoss,
  lossStopType,
  lossPriceType,
  inputProfit,
  profitStopType,
  profitPriceType,
  stopProfitPrice,
  checkedLoss,
  lossCancelUuid,
  changeLossCancelUuid,
  stopLossCb,
  checkedProfit,
  profitCancelUuid,
  changeProfitCancelUuid,
  stopProfitCb,
  cancelSuccess,
  isProfitEdited,
  isLossEdited,
  profitFlag,
  lossFlag
) => {
  let params = {
    modeType: holdPosiItem.marginType,
    // gearingxie:
    //   holdPosiItem.marginType === 1 ? 0 : Number(new Big(1).div(Number(holdPosiItem.initMarginRate)).toString()),
    gearingxie: Number(new Big(1).div(Number(holdPosiItem.initMarginRate)).toString()),
    contractId: holdPosiItem.contractId,
    side: holdPosiItem.side > 0 ? -1 : 1,
    // type: 3, // 限价
    // quantity: Math.abs(Number(holdPosiItem.quantity)),
    quantity: 999999,
    positionEffect: 2,
    orderSubType: 4, // 默认标记价触发
    hasCancel: true
    // price: 0
  };
  if (checkedLoss && checkedProfit) {
    params.uuid = uuid();
  }
  let stopLossParams = {
    ...params,
    ...{
      stopPrice: inputLoss,
      orderSubType: lossStopType,
      type: lossPriceType, // 限价
      price:
        lossPriceType === 1
          ? inputLoss // 委托价为止损价
          : 0,
      conditionOrderType: lossFlag
    }
  };
  let stopProfitParams = {
    ...params,
    ...{
      stopPrice: inputProfit,
      orderSubType: profitStopType,
      type: profitPriceType, // 限价
      price:
        profitPriceType === 1
          ? inputProfit // 委托价为止盈价
          : 0,
      conditionOrderType: profitFlag
    }
  };
  if (isLossEdited) {
    if (holdPosiItem.stopLossId) {
      // if (
      //   Number(inputLoss) !== Number(holdPosiItem.stopLossPrice) ||
      //   !checkedLoss ||
      //   Number(lossStopType) !== Number(holdPosiItem.lossStopType)
      // ) {
      const params = {
        conditionOrderId: holdPosiItem.stopLossId
      };
      cancelCondOrder({
        params,
        headers: { unique: lossCancelUuid }
      })
        .then((res) => {
          changeLossCancelUuid();
          // if (res.code === 0) {
          console.log(res, "-----wangwei--res--cancleorder");
          if (checkedLoss) {
            place(stopLossParams, stopLossCb, () => {}, false);
          } else {
            message.success(i18n.t("CancelledSucceed"));
            cancelSuccess();
            // restfulConditionOrders();
          }
          // }
        })
        .catch((err) => {
          changeLossCancelUuid();
          console.log(err, "-----wangwei----order");
        });
      // }
    } else {
      if (checkedLoss) {
        place(stopLossParams, stopLossCb, () => {}, false);
      }
    }
  }
  if (isProfitEdited) {
    if (holdPosiItem.stopProfitId) {
      // if (
      //   Number(inputProfit) !== Number(holdPosiItem.stopProfitPrice) ||
      //   !checkedProfit ||
      //   Number(stopProfitPrice) !== Number(holdPosiItem.stopProfitPrice)
      // ) {
      const params = {
        conditionOrderId: holdPosiItem.stopProfitId
      };
      cancelCondOrder({
        params,
        headers: { unique: profitCancelUuid }
      })
        .then((res) => {
          changeProfitCancelUuid();
          // if (res.code === 0) {
          console.log(res, "-----wangwei--res--cancleorder");
          if (checkedProfit) {
            place(stopProfitParams, stopProfitCb, () => {}, false);
          } else {
            message.success(i18n.t("CancelledSucceed"));
            cancelSuccess();
            // restfulConditionOrders();
          }
          // }
        })
        .catch((err) => {
          changeProfitCancelUuid();
          console.log(err, "-----wangwei----order");
        });
      // }
    } else {
      if (checkedProfit) {
        place(stopProfitParams, stopProfitCb, () => {}, false);
      }
    }
  }
};
// export const _goBack = url => {
//   if (process.env.REACT_APP_JSBRIDGE === 'true') {
//     send('h5_back')
//   } else {
//     if (url) {
//       history.push(`${process.env.REACT_APP_BASENAME}${a}`)
//     } else {
//       history.goBack()
//     }
//   }
// }
/**
 * 计算预计亏损
 * @param {止损switch} checkedLoss
 * @param {止损价格输入} inputLoss
 * @param {当前持仓} holdPosiItem
 */
export const featureLoss = (checkedLoss, inputLoss, holdPosiItem, quantity) => {
  if (
    !checkedLoss ||
    !isNumber(inputLoss) ||
    !inputLoss ||
    !isNumber(inputLoss) ||
    !Number(inputLoss)
  ) {
    return 0;
  }
  let pl = 0;
  if (holdPosiItem.contractSide === 1) {
    pl = new Big(Math.abs(quantity))
      .times(holdPosiItem.side)
      .times(new Big(inputLoss).sub(holdPosiItem.openPrice))
      .times(holdPosiItem.contractUnit);
  } else {
    pl = new Big(Math.abs(quantity))
      .times(holdPosiItem.side)
      .times(new Big(1).div(holdPosiItem.openPrice).sub(new Big(1).div(inputLoss)))
      .times(holdPosiItem.contractUnit);
  }

  return Number(pl).toFixed(10);
};

/**
 * 计算预计盈利
 * @param {止盈switch} checkedProfit
 * @param {止盈价格输入} inputProfit
 * @param {当前持仓} holdPosiItem
 */
export const featureProfit = (checkedProfit, inputProfit, holdPosiItem, quantity) => {
  if (
    !checkedProfit ||
    !isNumber(inputProfit) ||
    !inputProfit ||
    !isNumber(holdPosiItem.openPrice) ||
    !Number(inputProfit)
  ) {
    return 0;
  }
  let pl = 0;
  if (holdPosiItem.contractSide === 1) {
    pl = new Big(Math.abs(quantity || 0))
      .times(holdPosiItem.side)
      .times(new Big(inputProfit).sub(holdPosiItem.openPrice))
      .times(holdPosiItem.contractUnit);
  } else {
    pl = new Big(Math.abs(quantity || 0))
      .times(holdPosiItem.side)
      .times(new Big(1).div(holdPosiItem.openPrice).sub(new Big(1).div(inputProfit)))
      .times(holdPosiItem.contractUnit);
  }

  return Number(pl).toFixed(10);
};

/**
 * 止盈价止损价计算
 * @param {百分比} percent
 * @param {止盈/止损} type
 * @param {持仓} holdPosiItem
 * @param {最大杠杆} crossLever
 * @param {止盈输入} _inputProfit
 * @param {止损输入} _inputLoss
 * @param {最小价格单位} priceTick
 */
export const chosePercent = (
  percent,
  type,
  holdPosiItem,
  crossLever,
  _inputProfit,
  _inputLoss,
  priceTick
) => {
  // contract_side =1,正向合约：
  // 止盈：触发价格 = 开仓价格 +（百分比*开仓价格）/（下单方向*杠杆倍数）
  // 止损：触发价格 = 开仓价格 - （百分比*开仓价格）/（下单方向*杠杆倍数）

  // contract_side =2,反向合约：
  // 止盈：触发价格 =  1 / { 1 / 开仓价格 -（百分比 / 开仓价格）/ （下单方向 * 杠杆倍数）}
  // 止损：触发价格 = 1 / { （ 1 / 开仓价格 +（百分比 / 开仓价格）/ （下单方向*杠杆倍数）}
  let gearingxie = new Big(1).div(holdPosiItem?.initMarginRate).round(0, 0).toString();
  // 止盈
  if (type === "profit") {
    // 正向
    if (holdPosiItem.contractSide === 1) {
      let inputProfit = new Big(holdPosiItem.openPrice)
        .plus(
          new Big(percent)
            .times(holdPosiItem.openPrice)
            .div(new Big(holdPosiItem.side).times(gearingxie))
        )
        .toString();
      console.log("ztopia profit", inputProfit);
      return {
        inputProfit: formatPrice(inputProfit, _inputProfit, priceTick)
      };
    } else {
      let inputProfit = Number(
        new Big(1).div(
          new Big(1)
            .div(holdPosiItem.openPrice)
            .sub(
              new Big(percent)
                .div(holdPosiItem.openPrice)
                .div(new Big(holdPosiItem.side).times(gearingxie))
            )
        )
      ).toString();
      return {
        inputProfit: formatPrice(inputProfit, _inputProfit, priceTick)
      };
    }
  } else {
    // 正向
    if (holdPosiItem.contractSide === 1) {
      let inputLoss = Number(
        new Big(holdPosiItem.openPrice).sub(
          new Big(percent)
            .times(holdPosiItem.openPrice)
            .div(new Big(holdPosiItem.side).times(gearingxie))
        )
      ).toString();
      return {
        inputLoss: formatPrice(inputLoss, _inputLoss, priceTick)
      };
    } else {
      let inputLoss = Number(
        new Big(1).div(
          new Big(1)
            .div(holdPosiItem.openPrice)
            .plus(
              new Big(percent)
                .div(holdPosiItem.openPrice)
                .div(new Big(holdPosiItem.side).times(gearingxie))
            )
        )
      ).toString();
      return {
        inputLoss: formatPrice(inputLoss, _inputLoss, priceTick)
      };
    }
  }
};
/**
 * 成本计算
 * @param {价值} commissionValue
 * @param {仓位模式} modeType
 * @param {杠杆} leverType
 */
export const costFn = (commissionValue, modeType, leverType, crossLever) => {
  let cost = 0;
  // let cLeverage = modeType === 1 ? new Big(crossLever) : new Big(leverType)
  let cLeverage = new Big(leverType);
  cost = new Big(commissionValue).div(cLeverage) || 0;
  return cost.toString();
};

export const transFromUsdt = (v, futureQuot) => {
  if (Number(v)) {
    return new Big(v).div(futureQuot.lastPrice || 1).toString();
  }
};
export const transToUsdt = (v, futureQuot) => {
  if (Number(v)) {
    return new Big(v).times(futureQuot.lastPrice || 1).toString();
  }
};
/**
 * 止盈止损撤单
 * @param {当前持仓} posListProps
 * @param {持仓上一状态} prevPosi
 * @param {当前委托} curDelegateInfo
 */
// export const cancelConditionOrders = (posListProps, prevPosi, curDelegateInfo) => {
//   if (!prevPosi || !posListProps) {
//     return false
//   }
//   let newContractIdArr = posListProps.map(el => {
//     return el.contractId
//   })
//   let oldContractIdArr = prevPosi.map(el => {
//     return el.contractId
//   })
//   if (newContractIdArr.toString() === oldContractIdArr.toString()) {
//     return false
//   }
//   let closePosiArr = oldContractIdArr.filter(el => newContractIdArr.indexOf(el) < 0)
//   if (!closePosiArr.length || !curDelegateInfo.length) {
//     return false
//   }
//   closePosiArr.forEach(el => {
//     let conditionOrders = curDelegateInfo.filter(
//       item => item.contractId === el && item.positionEffect === 2 && item.status === 1
//     )
//     if (conditionOrders.length) {
//       let conditionOrderIds = conditionOrders.map(ele => {
//         return ele.conditionOrderId
//       })
//       conditionCancels({
//         params: { conditionOrderIdList: conditionOrderIds },
//         headers: { unique: uuid() },
//       })
//         .then(res => {
//           if (res.data.code === 0) {
//             restfulConditionOrders()
//           }
//         })
//         .catch(() => {})
//     }
//   })
// }
export const cancelConditionOrders = (posListProps, prevPosi, curDelegateInfo) => {
  if (!prevPosi || !posListProps) {
    return false;
  }
  let newContractIdArr = posListProps
    .filter((el) => el.posiSide === 0)
    .map((el) => {
      return el.contractId;
    });
  let oldContractIdArr = prevPosi
    .filter((el) => el.posiSide === 0)
    .map((el) => {
      return el.contractId;
    });
  let newContractIdArrOpen = posListProps
    .filter((el) => el.posiSide === 1)
    .map((el) => {
      return el.contractId;
    });
  let oldContractIdArrOpen = prevPosi
    .filter((el) => el.posiSide === 1)
    .map((el) => {
      return el.contractId;
    });
  let newContractIdArrClose = posListProps
    .filter((el) => el.posiSide === -1)
    .map((el) => {
      return el.contractId;
    });
  let oldContractIdArrClose = prevPosi
    .filter((el) => el.posiSide === -1)
    .map((el) => {
      return el.contractId;
    });
  if (
    newContractIdArr.toString() === oldContractIdArr.toString() &&
    newContractIdArrOpen.toString() === oldContractIdArrOpen.toString() &&
    newContractIdArrClose.toString() === oldContractIdArrClose.toString()
  ) {
    return false;
  }
  let closePosiArr = oldContractIdArr.filter((el) => newContractIdArr.indexOf(el) < 0);
  let closePosiArrOpen = oldContractIdArrOpen.filter((el) => newContractIdArrOpen.indexOf(el) < 0);
  let closePosiArrClose = oldContractIdArrClose.filter(
    (el) => newContractIdArrClose.indexOf(el) < 0
  );
  if (!curDelegateInfo.length) {
    return false;
  }
  if (closePosiArr.length) {
    closePosiArr.forEach((el) => {
      let conditionOrders = curDelegateInfo.filter(
        (item) => item.contractId === el && item.positionEffect === 2 && item.status === 1
      );
      if (conditionOrders.length) {
        let conditionOrderIds = conditionOrders.map((ele) => {
          return ele.conditionOrderId;
        });
        conditionCancels({
          params: { conditionOrderIdList: conditionOrderIds, posiCheck: true },
          headers: { unique: uuid() }
        })
          .then((res) => {
            if (res.data.code === 0) {
              _trackEvent(data, true, true);
              restfulConditionOrders();
            }
          })
          .catch(() => {});
      }
    });
  }
  if (closePosiArrOpen.length) {
    closePosiArrOpen.forEach((el) => {
      let conditionOrders = curDelegateInfo.filter(
        (item) =>
          item.contractId === el && item.positionEffect === 2 && item.side < 0 && item.status === 1
      );
      if (conditionOrders.length) {
        let conditionOrderIds = conditionOrders.map((ele) => {
          return ele.conditionOrderId;
        });
        conditionCancels({
          params: { conditionOrderIdList: conditionOrderIds, posiCheck: true },
          headers: { unique: uuid() }
        })
          .then((res) => {
            if (res.data.code === 0) {
              _trackEvent(data, true, true);
              restfulConditionOrders();
            }
          })
          .catch(() => {});
      }
    });
  }
  if (closePosiArrClose.length) {
    closePosiArrClose.forEach((el) => {
      let conditionOrders = curDelegateInfo.filter(
        (item) =>
          item.contractId === el && item.positionEffect === 2 && item.side > 0 && item.status === 1
      );
      if (conditionOrders.length) {
        let conditionOrderIds = conditionOrders.map((ele) => {
          return ele.conditionOrderId;
        });
        conditionCancels({
          params: { conditionOrderIdList: conditionOrderIds, posiCheck: true },
          headers: { unique: uuid() }
        })
          .then((res) => {
            if (res.data.code === 0) {
              _trackEvent(data, true, true);
              restfulConditionOrders();
            }
          })
          .catch(() => {});
      }
    });
  }
};

/**
 * 下单张数计算
 * @param {金额} percentAmount
 * @param {最大可开标志} allIn
 */
export const calcQuantityFn = (
  percentAmount,
  allIn,
  side,
  contractItem,
  futureQuot,
  price,
  crossLever,
  modeType,
  leverType,
  priceType,
  countType,
  updateCount
) => {
  // 张数
  let _qty = 0;
  // 计算双向张数
  const _singleCost = singleCost(
    side,
    contractItem,
    futureQuot,
    price,
    crossLever,
    modeType,
    leverType,
    priceType,
    allIn
  );
  let _obj = {
    allInQuantity: 0,
    allInValue: 0,
    _count: 0,
    quantity: 0
  };
  if (priceType === 1 && !price) {
    return _obj;
  }
  if (percentAmount) {
    let countAmount = new Big(percentAmount);
    _qty = Number(countAmount.div(Number(_singleCost) || 1).toString());
  }
  if (allIn) {
    if (Math.floor(_qty) > 0) {
      _obj.allInQuantity = Math.floor(_qty);
    } else {
      _obj.allInQuantity = 0;
    }
    if (contractItem.contractSide === 1) {
      if (Math.floor(_qty) > 0) {
        let _allinV = new Big(_qty).times(contractItem.contractUnit);
        _obj.allInValue = toFix6(_allinV);
      } else {
        _obj.allInValue = 0;
      }
    } else {
      if (Math.floor(_qty) > 0) {
        let _allinV = new Big(_qty).times(contractItem.contractUnit).div(futureQuot.lastPrice || 1);
        _obj.allInValue = toFix6(_allinV);
      } else {
        _obj.allInValue = 0;
      }
    }
    return _obj;
  }
  _obj.quantity = Math.floor(_qty);
  // 赋值
  if (countType) {
    // 按金额
    if (_qty < 1) {
      if (updateCount) {
        _obj._count = "";
      }
    } else {
      // let lever = modeType === 1 ? crossLever : leverType
      let lever = leverType;
      if (contractItem.contractSide === 1) {
        _obj._count = toFix6(transFromUsdt(new Big(percentAmount).times(lever), futureQuot));
      } else {
        _obj._count = toFix6(new Big(percentAmount).times(lever).toString());
      }
    }
  } else {
    // 按张
    _obj._count = String(Math.floor(_qty) || "");
    // }
  }
  return _obj;
  // 计算价值
  // this.calcCommissionValue(_qty, side)
  // this.commissionValue(side, Math.floor(_qty)) // , Math.floor(_qtysell)
};

export const calcRiskRate = (posiItem, contractList, accountList, posList) => {
  //   对于某币种
  // 分子=账户余额-委托冻结保证金-全部逐仓持仓冻结保证金+∑全部全仓持仓的浮动盈亏-∑所有全仓持仓的维持保证金
  // 分母=∑全部全仓持仓的初始保证金
  // console.log(contractItem, accountList, posList, 'calcRiskRate')
  let contractItem = contractList.find((el) => el.contractId === posiItem.contractId);
  if (!contractItem?.currencyId || !accountList.length || !posList.length) {
    return false;
  }
  let currencyItem = accountList.find((el) => el.currencyId === contractItem?.currencyId);
  // contractItem.contractSide === 1
  //   ? accountList.find((el) => el.currencyId === contractItem.currencyId)
  //   : accountList.find((el) => el.currencyId === contractItem.commodityId)
  if (!currencyItem) {
    return false;
  }
  let isolatePosiArr = posList.filter((el) => {
    let _contractItem = contractList.find((ele) => ele.contractId === el.contractId);
    return el.marginType === 2 && currencyItem.currencyId === _contractItem.currencyId;
  });
  let crossPosiArr = posList.filter((el) => {
    let _contractItem = contractList.find((ele) => ele.contractId === el.contractId);
    return el.marginType === 1 && currencyItem.currencyId === _contractItem.currencyId;
  });
  // ∑全部全仓持仓的浮动盈亏
  let crossPnl = 0;
  // ∑所有全仓持仓的维持保证金
  let crossMaintainMargin = 0;
  // 全部逐仓持仓冻结保证金
  let isolateFrozenMargin = 0;
  // 账户余额
  // let available = currencyItem.available
  let available = currencyItem.totalBalance;
  // 委托冻结保证金
  let frozenForTrade = currencyItem.frozenForTrade;
  // b: 分母
  let b = 0;
  crossPosiArr.map((el) => {
    b = new Big(b).plus(el.initMargin || 0);
    crossPnl = new Big(crossPnl).plus(el.unrealizedProfitLossS || 0);
    crossMaintainMargin = new Big(crossMaintainMargin).plus(el.minMargin || 0);
  });
  isolatePosiArr.map((el) => {
    isolateFrozenMargin = new Big(isolateFrozenMargin)
      .plus(el.initMargin || 0)
      .plus(el.extraMargin || 0);
  });
  // a: 分子
  let a = new Big(available || 0)
    .minus(frozenForTrade || 0)
    .minus(isolateFrozenMargin)
    .plus(crossPnl)
    .minus(crossMaintainMargin);
  let _riskRate = b > 0 ? Number(new Big(a).div(b).times(100).toString()) : 0;
  // console.log(
  //   available.toString(),
  //   frozenForTrade.toString(),
  //   isolateFrozenMargin.toString(),
  //   crossPnl.toString(),
  //   crossMaintainMargin.toString(),
  //   a.toString(),
  //   b.toString(),
  //   _riskRate,
  //   'calcRiskRate'
  // )
  return _riskRate.toFixed(2);
};

/**
 * @name 全仓模式下强平价格计算
 * @param {*} posi
 */

export const crossLiqudationPrice = (posiItem, contractList, accountList, posList) => {
  // 账户余额-委托冻结保证金-全部逐仓持仓冻结保证金+∑全部全仓持仓的浮动盈亏-∑所有全仓持仓的维持保证金=0
  // ∑全部全仓持仓的浮动盈亏=委托冻结保证金-账户余额+全部逐仓持仓冻结保证金+∑所有全仓持仓的维持保证金

  let contractItem = contractList.find((el) => el.contractId === posiItem.contractId);
  if (!contractItem && !accountList.length && !posList.length) {
    return false;
  }
  if (!posiItem.quantity) return false;
  let currencyItem = accountList.find((el) => el.currencyId === contractItem.currencyId);

  if (!currencyItem) {
    return false;
  }
  let isolatePosiArr = posList.filter((el) => {
    let _contractItem = contractList.find((ele) => ele.contractId === el.contractId);
    return el.marginType === 2 && currencyItem.currencyId === _contractItem.currencyId;
  });
  let crossPosiArr = posList.filter((el) => {
    let _contractItem = contractList.find((ele) => ele.contractId === el.contractId);
    return el.marginType === 1 && currencyItem.currencyId === _contractItem.currencyId;
  });
  // 除了本合约外∑全部全仓持仓的浮动盈亏
  let crossPnl = 0;
  // ∑所有全仓持仓的维持保证金
  let crossMaintainMargin = 0;
  // 全部逐仓持仓冻结保证金
  let isolateFrozenMargin = 0;
  // 账户余额
  let totalBalance = currencyItem.totalBalance;
  // 委托冻结保证金
  let frozenForTrade = currencyItem.frozenForTrade;

  isolatePosiArr.map((el) => {
    isolateFrozenMargin = new Big(isolateFrozenMargin)
      .plus(el.initMargin || 0)
      .plus(el.extraMargin || 0);
  });
  //最小保证金 minMargin=  openAmt  *  maintainMarginRate
  crossPosiArr.map((el) => {
    crossMaintainMargin = new Big(crossMaintainMargin).plus(el.minMargin || 0);
    if (el.contractId !== posiItem.contractId) {
      crossPnl = new Big(crossPnl).plus(el.unrealizedProfitLossS || 0);
    }
  });
  // 本合约盈亏=委托冻结保证金-账户余额+全部逐仓持仓冻结保证金+∑所有全仓持仓的维持保证金-除了本合约外∑全部全仓持仓的浮动盈亏
  let _unrealizedProfitLoss = new Big(frozenForTrade)
    .sub(totalBalance)
    .plus(isolateFrozenMargin)
    .plus(crossMaintainMargin)
    .sub(crossPnl);

  let len = posList.filter(
    (el) => el.contractId === posiItem.contractId && el.marginType === 1
  ).length;

  // 未实现盈亏
  // * contract_side==1   未实现盈亏=持仓数量*合约单位*(el.lastPrice-开仓价)
  // * contract_side==2   未实现盈亏=持仓数量*合约单位*(1/开仓价-1/el.lastPrice)
  if (contractItem.contractSide === 1) {
    //考虑多空双开
    if (len < 2) {
      return new Big(_unrealizedProfitLoss)
        .div(posiItem.quantity)
        .div(contractItem.contractUnit)
        .plus(posiItem.openPrice)
        .toString();
    } else {
      let posi2 = posList.find(
        (el) => el.posiSide !== posiItem.posiSide && el.contractId === posiItem.contractId
      );
      let _quantity = new Big(posiItem.quantity).plus(posi2.quantity);

      if (Math.abs(posi2.quantity) === Math.abs(posiItem.quantity)) {
        let basicPrice = posi2.quantity > 0 ? posi2.openPrice : posiItem.openPrice;
        return new Big(basicPrice).times(112).toString();
      } else {
        return (
          new Big(_unrealizedProfitLoss)
            .plus(
              new Big(contractItem.contractUnit).times(
                new Big(posiItem.quantity)
                  .times(posiItem.openPrice)
                  .plus(new Big(posi2.quantity).times(posi2.openPrice))
              )
            )
            .div(new Big(contractItem.contractUnit).times(_quantity))
            // .abs()
            .toString()
        );
      }
    }
  } else {
    if (len < 2) {
      return new Big(posiItem.openPrice)
        .times(posiItem.quantity)
        .times(posiItem.contractUnit)
        .div(
          new Big(posiItem.quantity)
            .times(contractItem.contractUnit)
            .sub(new Big(posiItem.openPrice).times(_unrealizedProfitLoss))
        )
        .toString();
    } else {
      let posi2 = posList.find(
        (el) => el.posiSide !== posiItem.posiSide && el.contractId === posiItem.contractId
      );

      try {
        if (Math.abs(posi2.quantity) === Math.abs(posiItem.quantity)) {
          let basicPrice = posi2.quantity > 0 ? posi2.openPrice : posiItem.openPrice;
          return new Big(basicPrice).div(1112).toString();
        } else {
          // return new Big(posiItem.openPrice)
          //   .times(posi2.openPrice)
          //   .times(contractItem.contractUnit)
          //   .times(new Big(posiItem.quantity).plus(posi2.quantity))
          //   .div(
          //     new Big(contractItem.contractUnit)
          //       .times(new Big(posiItem.quantity).times(posi2.openPrice).plus(new Big(posi2.quantity).times(posiItem.openPrice)))
          //       .sub(new Big(posiItem.openPrice).times(posi2.openPrice).times(contractItem.contractUnit))
          //   )
          //   .toString()
          return new Big(posiItem.quantity)
            .plus(posi2.quantity)
            .div(
              new Big(posiItem.quantity)
                .div(posiItem.openPrice)
                .plus(new Big(posi2.quantity).div(posi2.openPrice))
                .sub(new Big(_unrealizedProfitLoss).div(contractItem.contractUnit))
            )
            .toString();
        }
      } catch (error) {
        return "0";
      }
    }
  }
};

export const calcIsolatedRiskRate = (posi) => {
  return posi && posi.curMargin && posi.minMargin
    ? new Big(posi.curMargin).minus(posi.minMargin).div(posi.minMargin).times(100).toString()
    : 0;
};

export const getNeedAddMargin = (posiItem, lever) => {
  // console.log('getNeedAddMargin', posiItem)
  if (!posiItem || !lever) return "--";
  const selectMarginRate = new Big(1).div(new Big(lever));
  const tempA = selectMarginRate.div(new Big(posiItem.initMarginRate));
  const tempB = tempA.minus(new Big(1));
  const tempC = tempB.times(new Big(posiItem.initMargin));
  return toFix6(tempC.toString());
};

export const getDecimal = (contractItem = store.getState().contract.contractItem, contractId) => {
  if (contractId) {
    let contractItem = store
      .getState()
      .contract.allContractList?.find((e) => e.contractId === contractId);
    return contractItem?.contractSide === 1 ? 2 : 6;
  }
  return contractItem?.contractSide === 1 ? 2 : 6;
};
