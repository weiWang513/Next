// import { queryPosi, queryMarginInfo, queryActiveOrder } from '../api/contractService'
// import { updateCurDelegateList } from './utils'

import store from "../store/store";
import dayjs from "dayjs";

import { restfulConditionOrders } from "./common";
import {
  updateAccountList,
  updateAccountListTemp,
  updateAvailable,
  updateCurDelegateInfo,
  updateMarginAvail,
  updatePosListProps,
  updateUpdateHoldPosi
} from "../store/modules/assetsSlice";
import { queryActiveOrder, queryMarginInfo, queryPosi } from "../services/api/contract";
import { useAppDispatch } from "../store/hook";
import { calcPosiArr, updateCurDelegateList } from "./calcFun";

const Big = require("big.js");
// match 拉取
export const _shouldRestful = () => {
  store.dispatch(updateUpdateHoldPosi(true));
  restfulConditionOrders();
  setTimeout(() => {
    return (() => {
      console.log(
        store.getState().assets.updateHoldPosi,
        "store.getState().SocketReducer.updateHoldPosi"
      );
      if (!store.getState().assets.updateHoldPosi) {
        return false;
      }
      if (store.getState().app.isLogin) {
        //获取保证金账户
        queryMarginInfo().then((response) => {
          if (!store.getState().assets.updateHoldPosi) {
            return false;
          }
          if (response.data.code === 0) {
            store.dispatch(updateAccountListTemp(response.data.data));
            //订单restful拉取
            queryPosi().then((res) => {
              if (!store.getState().assets.updateHoldPosi) {
                return false;
              }
              if (res.data.code === 0) {
                posiHandel(
                  res.data.data,
                  store.getState().contract.contractList,
                  response.data.data
                );
              }
            });
          }
        });
        getActiveOrder();
      }
    })();
  }, 4000);
};

// _shouldRestful()

export const posiHandel = (
  posiList,
  contractList,
  accountListTemp = store.getState().assets.accountListTemp
) => {
  let _posiList = calcPosiArr(
    contractList,
    posiList,
    accountListTemp,
    store.getState().assets.accountList,
    store.getState().contract.contractItem,
    store.getState().assets.conditionOrders
  );
  console.log("posiHandel", _posiList);
  // _posiList && _posiList.posListProps && store.dispatch(updatePosListProps(_posiList.posListProps));
  store.dispatch(updatePosListProps(_posiList?.posListProps || {}));
  // _posiList && _posiList.accountList && store.dispatch(updateAccountList(_posiList.accountList));
  store.dispatch(updateAccountList(_posiList?.accountList || []));
  // _posiList && _posiList.available && store.dispatch(updateAvailable(_posiList.available))
  store.dispatch(updateAvailable(_posiList?.available || "0"));
  // _posiList && _posiList.marginAvail && store.dispatch(updateMarginAvail(_posiList.marginAvail));
  store.dispatch(updateMarginAvail(_posiList?.marginAvail || "0"));
};

// 拉取当前委托
export const getActiveOrder = () => {
  queryActiveOrder().then((res) => {
    if (res.data.code === 0) {
      if (!res.data.data.length) {
        store.dispatch(
          updateCurDelegateInfo({
            // 当前委托信息
            list: [], // 当前委托列表
            curList: [], //  当前合约的当前委托列表
            OpenOrders: [],
            conOrders: []
          })
        );
        return false;
      }
      res.data.data.forEach((el) => {
        let _el = JSON.parse(JSON.stringify(el));
        _el.quantity = el.orderQty;
        _el.price = el.orderPrice;
        _el.placeTimestamp = el.orderTime;
        _el.leftQuantity = new Big(el.orderQty).minus(el.matchQty).toString();
        // updateCurDelegateInfo(_el)
        let _list = updateCurDelegateList(
          _el,
          store.getState().assets.curDelegateInfo,
          store.getState().contract.contractList,
          store.getState().contract.contractId
        );
        console.log(
          _el,
          _list,
          store.getState().assets.curDelegateInfo,
          store.getState().contract.contractList,
          "updateCurDelegateList"
        );
        if (_list && _list?.list.length) {
          store.dispatch(updateCurDelegateInfo(_list));
        }
      });
    }
  });
};

//
/**
 *  一键反手平仓价值计算
 * @param { 当前持仓 } posi
 * @param { 当前持仓对应合约 } contractItem
 * @param { 买一价 } bidPrice
 */
export const posiReverseVCalc = (posi, contractItem, quantity) => {
  const _initMargin = posi?.initMargin; // new Big(posi?.openPrice || 0).times(quantity).times(contractItem?.contractUnit || 0).times(posi?.initMarginRate)
  const _Pnl = posi?.unrealizedProfitLoss; // new Big(posi?.side).times(new Big(posi?.lastPrice || 0).minus(posi?.openPrice || 0)).times(contractItem?.contractUnit || 0).times(quantity || 0)
  // const _Margin = new Big(posi?.initMargin || 0).plus(posi?.extraMargin || 0).plus(posi?.unrealizedProfitLoss || 0)
  let _MFee = "";

  if (contractItem?.contractSide === 1) {
    _MFee = new Big(posi?.absQuantity || 0)
      .times(contractItem?.contractUnit || 0)
      .times(posi?.lastPrice || 0)
      .times(contractItem?.makerFeeRatio || 0);
  } else {
    _MFee = new Big(posi?.absQuantity || 0)
      .times(contractItem?.contractUnit || 0)
      .times(new Big(1).div(posi?.lastPrice || 1))
      .times(contractItem?.makerFeeRatio || 0);
  }
  console.log("_initMargin", _initMargin.toString(), _Pnl.toString(), _MFee.toString());
  console.log("posiReverseVCalc", quantity, posi?.absQuantity, _initMargin, _Pnl, _MFee);
  let _margin = new Big(quantity || 0)
    .div(posi?.absQuantity)
    .times(new Big(_initMargin || 0).plus(_Pnl).plus(_MFee))
    .toString();
  // if (contractItem.contractSide === 1) {
  //   _margin = _initMargin.plus(_Pnl).minus(_MFee).toString()
  // } else {
  //   _margin = _initMargin.plus(_Pnl).minus(_MFee).div(posi?.lastPrice || 1).toString()
  // }
  return _margin;
};
/**
 *  一键反手张数计算
 *  正向合约: 计可开合约张数= 平仓后可用余额 / (合约单位∗当前卖一价∗(初始保证金率+Taker手续费率))
 *  反向合约: 计可开合约张数= (平仓后可用余额∗当前卖一价) / 合约单位(初始保证金率+Taker手续费率)
 * @param { 当前持仓 } posi
 * @param { 当前持仓对应合约 } contractItem
 * @param { 买一价 } bidPrice
 * @param { 卖一价 } askPrice
 */
export const posiReverseQCalc = (posi, contractItem, quantity) => {
  // const _Margin = new Big(posi?.initMargin || 0).plus(posi?.extraMargin || 0).plus(posi?.unrealizedProfitLoss || 0)
  // const _TFee = new Big(quantity || 0).times(contractItem?.contractUnit || 0).times(posi?.lastPrice || 0).times(contractItem?.takerFeeRatio || 0)
  const _Margin = posiReverseVCalc(posi, contractItem, quantity);

  const _DU = new Big(contractItem?.contractUnit)
    .times(posi?.lastPrice)
    .times(new Big(posi?.initMarginRate).plus(contractItem?.takerFeeRatio));
  const _DC = new Big(contractItem?.contractUnit).times(
    new Big(posi?.initMarginRate).plus(contractItem?.takerFeeRatio)
  );

  let _reverseQ = 0;

  if (contractItem?.contractSide === 1) {
    _reverseQ = new Big(_Margin || 0)
      .div(_DU || 1)
      .round(0, 0)
      .toString();
  } else {
    _reverseQ = new Big(_Margin || 0).times(posi?.lastPrice).div(_DC).round(0, 0).toString();
  }
  console.log("_initMargin", posi, _Margin.toString(), _reverseQ);
  return _reverseQ;
};

/**
 * 条件单撤单追踪
 * @param {*} conditionOrderIds
 * @param {*} uid
 * @param {*} check
 * @param {*} isPassivity
 */
export const _trackEvent = (conditionOrderIds, check, isPassivity) => {
  let conditionCanceObj = {
    conditionOrderId: conditionOrderIds, // [orderId]
    uid: store.getState().app.uid, // inviteCode
    check: check, // postionCheck
    isPassivity: isPassivity // passivity or initiative
  };
  console.log("window._czc", window._czc, conditionCanceObj);
  window._czc &&
    window._czc.push([
      "_trackEvent",
      "contract_conditionOrder",
      "contract_conditionOrder_cancel",
      JSON.stringify(conditionCanceObj),
      dayjs().valueOf().toString()
    ]);
};

export const getImageBase64 = image => {
  const canvas = document.createElement('canvas')
  canvas.width = image.width
  canvas.height = image.height
  const ctx = canvas.getContext('2d')
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)
  const extension = image.src.substring(image.src.lastIndexOf('.') + 1).toLowerCase()
  console.log('extension', image, extension)
  return canvas.toDataURL(`image/${extension}`, 1)
}

export const downloadImage = (url, downloadName) => {
  const Link = document.createElement('a')
  Link.setAttribute('download', downloadName)
  const image = new Image()
  image.src = `${url}`
  image.setAttribute('crossorigin', 'Anonymous')
  image.onload = () => {
    Link.href = getImageBase64(image)
    Link.click()
  }
}
