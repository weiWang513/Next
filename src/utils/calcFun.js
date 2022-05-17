const Big = require("big.js");
import { dateFormat2 } from "./filters";
import {
  floatAdd,
  floatSub,
  floatMul,
  floatDiv,
  getFloat,
  subStringNum,
  arraySum,
  depthSum,
  toRateFilter,
  toPrecision2,
  timestampToTime,
  saveSix,
  createChannelString,
  trimStr,
  updateBar,
  toNonExponential,
} from "./math";
/**
 * 持仓推送处理
 * @param {合约列表} market_listState
 * @param {持仓列表} posList
 * @param {资产数据} accountArr
 * @param {当前合约} propsContractItem
 * @param {委托对象} curDelegateInfo
 * @param {是否隐藏其他} hideOther
 */
export const calcPosiArr = (
  market_listState,
  posList,
  accountArr,
  accountList,
  propsContractItem,
  curDelegateInfo,
  hideOther
) => {
  let arr = posList.filter((el) => Number(el.posiQty) !== 0);
  let _arr = JSON.parse(JSON.stringify(arr));
  if (_arr && _arr.length > 0) {
    _arr.forEach((el) => {
      let contractItem = market_listState.find(
        (item) => el.contractId === item.contractId
      );
      if (!contractItem || !contractItem.lastPrice) return false;

      // 获取currencyId
      el.currencyId = contractItem ? contractItem.currencyId : "";
      // 获取commodityId
      el.commodityId = contractItem ? contractItem.commodityId : "";
      // 获取持仓合约symbol
      el.symbol = contractItem.symbol;
      // 获取持仓合约side
      el.contractSide = contractItem.contractSide;
      // 获取持仓合约priceTick
      el.priceTick = contractItem.priceTick;
      // 获取持仓合约lotSize
      el.lotSize = contractItem.lotSize;
      // 币种symbol
      el.currencySymbol = contractItem.currencyName;
      // 获取持仓合约单位
      el.contractUnit = contractItem ? contractItem.contractUnit : "0.01";
      // 获取合约最新价
      el.lastPrice = contractItem ? contractItem.lastPrice : "0";
      // 获取合约标记价格 clearPrice
      el.clearPrice = contractItem ? contractItem.clearPrice : "0";
      // 获取持仓方向  持仓数大于0时，持仓方向=1，持仓数量小于0时，持仓方向=-1
      el.side = el.posiQty > 0 ? 1 : -1;
      // 计算价值   价值=持仓数量*el.lastPrice
      el.quantity = Number(el.posiQty);
      el.absQuantity = Math.abs(el.quantity);
      el.varietyId = contractItem.varietyId;

      if (contractItem.contractSide === 1) {
        el.value = floatMul(
          floatMul(Math.abs(el.quantity), el.contractUnit),
          el.lastPrice
        );
      } else {
        el.value = floatDiv(
          floatMul(Math.abs(el.quantity), el.contractUnit),
          el.lastPrice
        );
      }

      // 计算开仓价格   开仓价格=开仓金额/持仓量/合约单位
      el.openPrice =
        contractItem.contractSide === 1
          ? new Big(el.openAmt)
              .div(
                new Big(Math.abs(Number(el.quantity))).times(el.contractUnit)
              )
              .toString()
          : new Big(Math.abs(Number(el.quantity)))
              .times(el.contractUnit)
              .div(el.openAmt)
              .toString();

      // 计算保证金
      el.margin = floatAdd(el.initMargin, el.extraMargin);
      // el.margin = toFix6(floatAdd(el.initMargin, el.extraMargin))
      // 判断仓位模式
      if (el.marginType === 2) {
        el.posiMode = Math.ceil(Number(floatDiv(1, el.initMarginRate)));
      }
      // 计算可平数量  posiQty-frozenCloseQty
      el.fairQty =
        Number(el.quantity) > 0
          ? floatSub(el.quantity, el.frozenCloseQty)
          : floatAdd(el.quantity, el.frozenCloseQty);
      /***
       * @name 未实现盈亏
       * el.posiQty > 0?1:2    对应contract_side=1或者2
       * contract_side==1   未实现盈亏=持仓数量*合约单位*(el.lastPrice-开仓价)
       * contract_side==2   未实现盈亏=持仓数量*合约单位*(1/开仓价-1/el.lastPrice)
       */
      // el.lastPrice-开仓价
      let unrealizedStrA =
        floatSub(el.lastPrice, el.openPrice) !== 0
          ? floatSub(el.lastPrice, el.openPrice)
          : "0";
      // 持仓数量*合约单位
      let unrealizedStrB = floatMul(el.quantity, el.contractUnit);
      // 1/开仓价-1/el.lastPrice
      // let unrealizedStrC = floatSub(floatDiv(1, el.openPrice), floatDiv(1, el.lastPrice))
      let unrealizedStrC = new Big(1)
        .div(el.openPrice)
        .sub(new Big(1).div(el.lastPrice))
        .toFixed(16);
      // console.log(el.openPrice, el.lastPrice, unrealizedStrC, 'unrealizedStrC')

      // 最终值
      el.unrealizedProfitLoss =
        contractItem.contractSide === 1
          ? floatMul(unrealizedStrA, unrealizedStrB)
            ? floatMul(unrealizedStrA, unrealizedStrB)
            : 0
          : new Big(unrealizedStrB).times(unrealizedStrC).toFixed(16)
          ? new Big(unrealizedStrB).times(unrealizedStrC).toFixed(16)
          : 0;
      console.log(
        "posiHandel",
        unrealizedStrA,
        unrealizedStrB,
        unrealizedStrC,
        el.unrealizedProfitLoss
      );
      /***
       * @name 未实现盈亏（计算保证金比率和强平价格时使用）
       */
      // el.clearPrice-开仓价
      let unrealizedStrAs =
        floatSub(el.clearPrice, el.openPrice) !== 0
          ? floatSub(el.clearPrice, el.openPrice)
          : "0";
      // 持仓数量*合约单位
      let unrealizedStrBs = floatMul(el.quantity, el.contractUnit);
      // 1/开仓价-1/el.clearPrice
      let unrealizedStrCs = new Big(1)
        .div(el.openPrice)
        .sub(new Big(1).div(el.clearPrice || 1))
        .toFixed(16);

      // 最终值
      el.unrealizedProfitLossS =
        contractItem.contractSide === 1
          ? floatMul(unrealizedStrAs, unrealizedStrBs)
            ? floatMul(unrealizedStrAs, unrealizedStrBs)
            : 0
          : new Big(unrealizedStrBs).times(unrealizedStrCs).toFixed(16)
          ? new Big(unrealizedStrBs).times(unrealizedStrCs).toFixed(16)
          : 0;

      // 如果未实现盈亏保留两位有效数字后小数位大于6位，则保留6位小数
      // if (el.unrealizedProfitLoss.toString().indexOf('e') >= 0) {
      //   let unrealizedProfitLossTemp = Number(el.unrealizedProfitLoss).toFixed(8)
      //   el.unrealizedProfitLoss = toFix6(unrealizedProfitLossTemp)
      // }

      // 计算回报率  回报率=未实现盈亏/floatAdd(el.initMargin, el.extraMargin)
      let returnRateStr = el.initMargin;
      el.returnRate = floatDiv(el.unrealizedProfitLoss, returnRateStr)
        ? toRateFilter(floatDiv(el.unrealizedProfitLoss, returnRateStr))
        : 0.0;
      //当前保证金   =   保证金 +  浮动盈亏
      let marginAccount = accountList
        ? accountList.find((el) => el.currencyId === contractItem.currencyId)
        : "";

      if (!marginAccount) return false;

      el.curMargin =
        el.marginType === 1
          ? floatAdd(
              floatAdd(el.margin, el.unrealizedProfitLoss),
              floatSub(
                floatSub(marginAccount.totalBalance, marginAccount.initMargin),
                marginAccount.frozenForTrade
              )
            )
          : floatAdd(el.margin, el.unrealizedProfitLoss);
      //最小保证金 =  openAmt  *  维持保证金率
      let minMargin = floatMul(el.openAmt, el.maintainMarginRate).toString();
      if (minMargin.indexOf("e") > -1) {
        let a = minMargin.split("e");
        let b = a[0].split(".");

        el.minMargin = b[0] + "." + b[1].slice(0, 2) + "e" + a[1];
      } else {
        el.minMargin = minMargin;
        // el.minMargin = toFix6(minMargin)
      }
    });
  } else {
    // state.availInfo.unrealizedProfitLoss = 0
    // state.availInfo.leverLevel = 0
  }
  let accountObj = accountArr
    ? connectPosiMargin(propsContractItem, accountArr, _arr)
    : {};

  // this.setState({ posList: arr })

  _arr = filterProfitLossOrder(_arr, curDelegateInfo, hideOther);
  if (hideOther) {
    // this.setState({
    //   posListProps: arr.filter((el) => el.contractId === contractId),
    // })
    _arr = _arr.filter((el) => el.contractId === propsContractItem.contractId);
  }
  //  else {
  //   this.setState({ posListProps: arr })
  // }
  // this.setState({
  //   posListProps: arr,
  //   accountList: accountObj.accountList,
  //   available: accountObj.available,
  //   marginAvail: accountObj.marginAvail,
  // })
  return {
    posListProps: _arr,
    accountList: accountObj.accountList,
    available: accountObj.available,
    marginAvail: accountObj.marginAvail,
  };
};
/**
 * 过滤止盈止损
 * @param {持仓列表} posListProps
 * @param {当前委托} curDelegateInfo
 * @param {隐藏其他} hideOther
 * @param {当前合约Id} contractId
 */
export const filterProfitLossOrder = (
  posListProps,
  curDelegateInfo,
  hideOther,
  contractId
) => {
  let _posListProps = [];
  posListProps.forEach((el) => {
    takeProfit(el, curDelegateInfo);
    stopLoss(el, curDelegateInfo);
    _posListProps.push(el);
  });
  // if (this.state.hideOther) {
  //   this.setState({
  //     posListProps: _posListProps.filter((el) => el.contractId === this.props.contractId),
  //   })
  // } else {
  //   this.setState({ posListProps: _posListProps })
  // }
  return _posListProps;
  // this.setState({ posListProps: _posListProps })
};

/**
 * 关联仓位保证金、计算资产
 * @param {当前合约} contractItem
 * @param {资产列表} accountList
 * @param {持仓列表} posList
 */
export const connectPosiMargin = (contractItem, accountList, posList) => {
  // if (!this.state.contractItem) {
  if (!contractItem) {
    return false;
  }
  // accountList 是 this.state.accountListTemp
  if (accountList.length === 0) {
    // this.setState({
    //   accountList: [],
    //   available: 0,
    //   marginAvail: 0
    // })
    return {
      accountList: [],
      available: 0,
      marginAvail: 0,
    };
    // return false
  }
  let _accountList = JSON.parse(JSON.stringify(accountList));
  _accountList.map((el) => {
    // min(0, 仓位类型为全仓,并且currentId相同的持仓记录的 未实现盈亏 求和”)
    let allQuan = 0;

    if (posList.length !== 0) {
      posList.forEach((item) => {
        if (item.marginType === 1 && item.currencyId === el.currencyId) {
          allQuan = floatAdd(allQuan, item.unrealizedProfitLoss);
        }
      });
    }

    allQuan = Math.min(0, allQuan);

    // 可用余额 totalBalance-frozenForTrade-initMargin + min(0, 仓位类型为全仓的持仓记录的 未实现盈亏 求和”)。
    el.available = Number(
      floatAdd(
        allQuan,
        floatSub(el.totalBalance, floatAdd(el.frozenForTrade, el.initMargin))
      )
    ).toFixed(10);

    // 计算当前合约保证金的保证金余额  保证金余额= totalBalance-frozenForTrade
    el.marginBalance = floatSub(el.totalBalance, el.frozenForTrade);

    // 找出持仓列表里currencyId与当前合约相同的元素，存进数组
    let currencyList = posList.filter(
      (ela) => el.currencyId === ela.currencyId
    );
    if (currencyList.length === 0) {
      el.unrealizedProfitLoss = 0;
      el.leverLevel = 0;
      return false;
    }

    // 计算当前合约保证金的未实现盈亏   持仓列表里,所有保证金的 currencyId与当前页面合约相同的， 未实现盈亏求和
    let unrealizedArr = [];
    let valueArr = [];
    currencyList.forEach((elb) => {
      unrealizedArr.push(elb.unrealizedProfitLoss);
      valueArr.push(elb.value);
    });
    el.unrealizedProfitLoss = arraySum(unrealizedArr);

    // 计算当前合约保证金的整体杠杆水平  持仓列表里，所有保证金的 currencyId与当前页面合约相同的， 合约价值求和 ，然后除以（钱包余额+未实现盈亏）
    el.leverLevel = floatDiv(
      arraySum(valueArr),
      floatAdd(el.totalBalance, el.unrealizedProfitLoss)
    );
  });
  let account = _accountList.find(
    (el) => el.currencyId === contractItem.currencyId
  );
  let available = account ? account.available : 0;
  let frozenForTrade = account ? account.frozenForTrade : 0;
  let totalBalance = account ? account.totalBalance : 0;
  let marginAvail = new Big(Number(totalBalance))
    .minus(new Big(Number(frozenForTrade)))
    .toString();
  // console.log(accountList,'accountList ztopia')
  return {
    accountList: _accountList,
    available: available,
    marginAvail: marginAvail,
  };
};
/**
 * 持仓止盈处理
 * @param {持仓} item
 * @param {委托列表} curDelegateInfo
 */
export const takeProfit = (item, curDelegateInfo) => {
  if (item.side > 0) {
    let shortList = curDelegateInfo
      .filter(
        (el) =>
          el.side < 0 &&
          el.status === 1 &&
          el.positionEffect === 2 &&
          el.conditionOrderType !== 0 &&
          Number(el.triggerPrice) > Number(item.openPrice) &&
          el.contractId === item.contractId
      )
      .sort((x, y) => Number(x.triggerPrice) - Number(y.triggerPrice));
    // this.stopProfitId = shortList.length ? shortList[0].orderId : ''
    item.stopProfitId = shortList.length ? shortList[0].conditionOrderId : "";
    item.stopProfitPrice = shortList.length ? shortList[0].triggerPrice : "";
    item.profitStopType = shortList.length ? shortList[0].triggerType : "";
    item.profitPriceType = shortList.length ? shortList[0].orderType : "";
    item.profitList = shortList;
    // return shortList.length ? shortList[0].triggerPrice : '-'
  } else {
    let shortList = curDelegateInfo
      .filter(
        (el) =>
          el.side > 0 &&
          el.status === 1 &&
          el.positionEffect === 2 &&
          el.conditionOrderType !== 0 &&
          Number(el.triggerPrice) < Number(item.openPrice) &&
          el.contractId === item.contractId
      )
      .sort((x, y) => Number(y.triggerPrice) - Number(x.triggerPrice));
    // this.stopProfitId = shortList.length ? shortList[0].conditionOrderId : ''
    // return shortList.length ? shortList[0].triggerPrice : '-'
    // if (shortList.length && shortList[0].triggerPrice && shortList[0].conditionOrderId) {
    item.stopProfitId = shortList.length ? shortList[0].conditionOrderId : "";
    item.stopProfitPrice = shortList.length ? shortList[0].triggerPrice : "";
    item.profitStopType = shortList.length ? shortList[0].orderSubType : "";
    item.profitPriceType = shortList.length ? shortList[0].orderType : "";
    item.profitList = shortList;

    // }
  }
};
/**
 * 持仓止损处理
 * @param {持仓} item
 * @param {委托列表} curDelegateInfo
 */
export const stopLoss = (item, curDelegateInfo) => {
  if (item.side > 0) {
    let shortList = curDelegateInfo
      .filter(
        (el) =>
          el.side < 0 &&
          el.status === 1 &&
          el.positionEffect === 2 &&
          el.conditionOrderType !== 0 &&
          Number(el.triggerPrice) <= Number(item.openPrice) &&
          el.contractId === item.contractId
      )
      .sort((x, y) => Number(y.triggerPrice) - Number(x.triggerPrice));
    // this.stopLossId = shortList.length ? shortList[0].conditionOrderId : ''
    // return shortList.length ? shortList[0].triggerPrice : '-'
    item.stopLossId = shortList.length ? shortList[0].conditionOrderId : "";
    item.stopLossPrice = shortList.length ? shortList[0].triggerPrice : "";
    item.lossStopType = shortList.length ? shortList[0].orderSubType : "";
    item.lossPriceType = shortList.length ? shortList[0].orderType : "";
    item.lossList = shortList;
  } else {
    let shortList = curDelegateInfo
      .filter(
        (el) =>
          el.side > 0 &&
          el.status === 1 &&
          el.positionEffect === 2 &&
          el.conditionOrderType !== 0 &&
          Number(el.triggerPrice) >= Number(item.openPrice) &&
          el.contractId === item.contractId
      )
      .sort((x, y) => Number(x.triggerPrice) - Number(y.triggerPrice));
    // this.stopLossId = shortList.length ? shortList[0].conditionOrderId : ''
    // return shortList.length ? shortList[0].triggerPrice : '-'
    // if (shortList.length && shortList[0].triggerPrice && shortList[0].conditionOrderId) {
    item.stopLossId = shortList.length ? shortList[0].conditionOrderId : "";
    item.stopLossPrice = shortList.length ? shortList[0].triggerPrice : "";
    item.lossStopType = shortList.length ? shortList[0].orderSubType : "";
    item.lossPriceType = shortList.length ? shortList[0].orderType : "";
    item.lossList = shortList;
    // }
  }
};

// ws 当前委托3004
/**
 * 更新委托列表
 * @param {3004推送data(单量)} data
 * @param {当前委托列表} curDelegateInfo
 * @param {合约列表} market_listState
 * @param {合约Id} contractId
 * @param {隐藏其他} hideOther
 */
export const updateCurDelegateList = (
  data,
  curDelegateInfo,
  market_listState,
  contractId,
  hideOther
) => {
  let obj = data;
  let _curDelegateInfo = JSON.parse(JSON.stringify(curDelegateInfo));
  // 过滤掉leftQuantity为"0"的元素,并且清空当前委托
  // if (obj.leftQuantity === "0") return false;
  if (obj.leftQuantity === "0") {
    let itemIndex = _curDelegateInfo.list.findIndex((el) => {
      return el.orderId === obj.orderId;
    });
    if (itemIndex >= 0) {
      // state._curDelegateInfo.list = [];
      _curDelegateInfo.list = _curDelegateInfo.list.filter(
        (item) => item.orderId !== obj.orderId
      );
    }
    if (obj.contractId === contractId) {
      let curItemIndex = _curDelegateInfo.curList.findIndex((el) => {
        return el.orderId === obj.orderId;
      });
      if (curItemIndex >= 0) {
        // state._curDelegateInfo.curList = [];
        _curDelegateInfo.curList = _curDelegateInfo.curList.filter(
          (item) => item.orderId !== obj.orderId
        );
      }
    }
    if (hideOther) {
      _curDelegateInfo.OpenOrders = _curDelegateInfo.curList.filter(
        (el) =>
          el.orderSubType < 2 || (el.orderSubType > 1 && el.orderStatus < 11)
      );
      _curDelegateInfo.conOrders = _curDelegateInfo.curList.filter(
        (el) => el.orderSubType > 1 && el.orderStatus > 10
      );
    } else {
      _curDelegateInfo.OpenOrders = _curDelegateInfo.list.filter(
        (el) =>
          el.orderSubType < 2 || (el.orderSubType > 1 && el.orderStatus < 11)
      );
      _curDelegateInfo.conOrders = _curDelegateInfo.list.filter(
        (el) => el.orderSubType > 1 && el.orderStatus > 10
      );
    }
    // if (_curDelegateInfo.conOrders.length) {
    //   let posListProps = []
    //   this.state.posListProps.forEach(el=>{
    //     this.takeProfit(el, _curDelegateInfo)
    //     this.stopLoss(el, _curDelegateInfo)
    //     posListProps.push(el)
    //   })
    //   this.setState({ posListProps: posListProps })
    // }
    // this.setState({ _curDelegateInfo: { ..._curDelegateInfo } })
    // return false
  } else {
    let contractItem = market_listState.find((el) => {
      return obj.contractId === el.contractId;
    });
    if (!contractItem) return;
    obj["symbol"] = contractItem ? contractItem.symbol : "";
    // 计算成交数量
    obj["dealAmt"] = floatSub(obj.quantity, obj.leftQuantity);
    // 计算委托价值
    let valueStr = floatMul(obj.price, obj.quantity);
    obj["value"] = floatMul(valueStr, obj.contractUnit);

    // 仓位模式判断
    if (obj.marginType === 2) {
      obj["posiMode"] = getFloat(floatDiv(1, obj.initMarginRate), 2);
    }
    // 判断状态  1.未成交 2.部分成交
    obj["state"] = 0;
    if (obj.quantity === obj.leftQuantity) {
      obj.state = 1;
    } else if (obj.leftQuantity > 0 && obj.leftQuantity < obj.quantity) {
      obj.state = 2;
    }
    // 格式化时间
    obj["time"] = dateFormat2(obj.placeTimestamp / 1000);
    // 杠杆
    if (Number(obj.initMarginRate)) {
      obj["lever"] = `${Math.ceil(
        Number(new Big(1).div(new Big(Number(obj.initMarginRate))).toString())
      )}x`;
    }
    // 成交价格
    obj["transVal"] =
      contractItem.contractSide === 1
        ? floatDiv(
            obj.matchAmt,
            floatMul(obj.matchQty, contractItem.contractUnit)
          )
        : floatDiv(
            floatMul(obj.matchQty, contractItem.contractUnit),
            obj.matchAmt
          );
    // 替换掉当前委托列表里面orderId相同的元素
    let itemIndex = _curDelegateInfo.list.findIndex((el) => {
      return el.orderId === obj.orderId;
    });
    if (itemIndex >= 0) {
      _curDelegateInfo.list.splice(itemIndex, 1, obj);
    } else {
      _curDelegateInfo.list.push(obj);
    }

    if (obj.contractId === contractId) {
      let curItemIndex = _curDelegateInfo.curList.findIndex((el) => {
        return el.orderId === obj.orderId;
      });
      if (curItemIndex >= 0) {
        _curDelegateInfo.curList.splice(curItemIndex, 1, obj);
      } else {
        _curDelegateInfo.curList.push(obj);
      }
    }
    if (hideOther) {
      _curDelegateInfo.OpenOrders = _curDelegateInfo.list.filter(
        (el) => el.orderSubType < 2 && el.contractId === contractId
      );
      _curDelegateInfo.conOrders = _curDelegateInfo.list.filter(
        (el) => el.orderSubType > 1 && el.contractId === contractId
      );
    } else {
      _curDelegateInfo.OpenOrders = _curDelegateInfo.list.filter(
        (el) => el.orderSubType < 2
      );
      _curDelegateInfo.conOrders = _curDelegateInfo.list.filter(
        (el) => el.orderSubType > 1
      );
    }
  }

  _curDelegateInfo.OpenOrders.sort((a, b) => {
    return b.placeTimestamp - a.placeTimestamp;
  });

  // if (curDelegateInfo.conOrders.length) {
  //   let posListProps = []
  //   this.state.posListProps.forEach(el=>{
  //     this.takeProfit(el, curDelegateInfo)
  //     this.stopLoss(el, curDelegateInfo)
  //     posListProps.push(el)
  //   })
  //   this.setState({ posListProps: posListProps })
  // }
  // this.setState({ curDelegateInfo: { ...curDelegateInfo } })
  return { ..._curDelegateInfo };
  // this.filterProfitLossOrder(this.state.posListProps, curDelegateInfo)
};
/**
 *资产推送
 * @param {3002推送数据} message
 * @param {资产数据列表} accountListTemp
 * @param {持仓列表} posList
 */

export const updateAssetsInfo = (
  message,
  accountListTemp,
  posList,
  market_listState,
  accountList,
  propsContractItem,
  curDelegateInfo,
  hideOther
) => {
  // console.log(message, '3002 ztopia 单条推送')
  if (!accountListTemp.length) {
    // this.setState({
    //   accountListTemp: [...accountListTemp, message],
    // })
    return { accountListTemp: [message] };
  }

  let accountListItem = accountListTemp.find(
    (el) => el.currencyId === message.currencyId
  );
  if (!accountListItem) {
    // this.setState({
    //   accountListTemp: [...accountListTemp, message],
    // })

    return { accountListTemp: [...accountListTemp, message] };
  }
  // if (message.lastId > accountListLastId) {
  // this.setState({ accountListLastId: message.lastId })

  let item = accountListTemp.find((el) => el.currencyId === message.currencyId);
  let index = accountListTemp.findIndex(
    (el) => el.currencyId === message.currencyId
  );

  let accountArr = JSON.parse(JSON.stringify(accountListTemp));

  item
    ? accountArr.forEach((el) => {
        if (el.currencyId === message.currencyId) {
          accountArr.splice(index, 1, message);
        }
      })
    : accountArr.push(message);

  //委托撤单更新委托保证金
  let posiArr = calcPosiArr(
    market_listState,
    posList,
    accountArr,
    accountList,
    propsContractItem,
    curDelegateInfo,
    hideOther
  );
  // this.setState({ accountListTemp: accountArr })
  let returnObj = {
    posiArr: posiArr.posListProps,
    accountList: posiArr.accountList,
    available: posiArr.available,
    marginAvail: posiArr.marginAvail,
    accountListTemp: accountArr,
  };
  // console.log(posiArr, returnObj, 'posiArr=============posiArr')
  return returnObj;
  // }
};

export const sort = (prop) => {
  return function (obj1, obj2) {
    var val1 = obj1[prop];
    var val2 = obj2[prop];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 < val2) {
      return -1;
    } else if (val1 > val2) {
      return 1;
    } else {
      return 0;
    }
  };
};

// const push = history.push
// const replace = history.replace
// const beforeEachEnter = (to, next) => {
//   // do something...
//   console.log(to)

//   next(to)
// }

// history.push = to => {
//   beforeEachEnter(to, push)
// }

// history.replace = to => {
//   beforeEachEnter(to, replace)
// }

// 订单深度
export const addProperty = (v) => {
  if (v) {
    const newA = [];
    v.map((item, index) => {
      if (index) {
        // console.log(item[1], newA[index - 1][2], 'v[index - 1][2]')
        newA.push([...item, Number(item[1]) + Number(newA[index - 1][2])]);
      } else {
        newA.push([...item, item[1]]);
      }
    });
    return newA;
  }
};

// 合并订单薄数组
export const mergeDeepthArr = (v, t, b) => {
  let _v = JSON.parse(JSON.stringify(v));
  const arr = [];
  const retArr = [];
  if (!_v.length) {
    return [];
  }
  _v.map((item, index) => {
    if (b) {
      item[0] = new Big(Math.floor(Number(new Big(item[0]).div(t))))
        .times(t)
        .toString();
    } else {
      item[0] = new Big(Math.ceil(new Big(new Big(item[0]).div(t))))
        .times(t)
        .toString();
    }
  });
  _v.forEach((item) => {
    const arrIn = _v.filter((ele) => ele[0] === item[0]);
    if (arrIn[0] && !arr.some((ele) => ele[0][0] === arrIn[0][0])) {
      // console.log(arr)
      arr.push(arrIn);
    }
  });
  arr.forEach((item) => {
    const countArr = [];
    if (item[0][1]) {
      item.forEach((ele) => {
        countArr.push(ele[1]);
      });
      const totle = countArr.reduce(
        (prev, cur) => new Big(prev).plus(cur).toString(),
        0
      );
      item[0][1] = totle;
    }
    retArr.push(item[0]);
  });
  return retArr;
};

// 深度控制数组 、deepth
export const deepthControl = (bids, asks, deepth) => {
  // const deepth = this.deepthIndex

  bids = addProperty(mergeDeepthArr([...bids], deepth, 1));
  asks = addProperty(mergeDeepthArr([...asks], deepth));
  return { bids: bids, asks: asks };
};

export const repalceProperty = (v) => {
  v.forEach((item, index) => {
    let num = item.splice(1, 1); // 单个数量
    item.push(...num);
  });
};
const widths = (v) => {
  return [...v].sort((a, b) => Number(b[1]) - Number(a[1]))?.[0]?.[1];
};
export const handleSnapshotDepth = (bidsAsks, deepthIndex, priceTick) => {
  if (!bidsAsks?.bids) {
    return {
      bids: [],
      asks: [],
      asksMax: 1,
      bidsMax: 1,
    };
  }
  let obj = { bids: [], asks: [], asksMax: 1, bidsMax: 1 };
  let bids = bidsAsks.bids;
  let asks = bidsAsks.asks;
  if (deepthIndex > priceTick) {
    obj = deepthControl(bids, asks, deepthIndex);
  } else {
    obj.bids = addProperty(bids); // .reverse())
    obj.asks = addProperty(asks); // .reverse()
    // obj.bids = bids
    // obj.asks = asks
  }
  // obj.bids = obj.bids.slice(0, 14)
  // obj.asks = obj.asks.slice(0, 14)
  obj.asksMax = widths(obj.asks);
  obj.bidsMax = widths(obj.bids);
  return obj;
};

/**
 * @name 订单簿增量
 * @param {*} list bids or asks list
 * @param {*} item add item
 * @param {*} item.eventType 1-新增，2-更新，3-删除
 * @param {*} item.mdEntryType 0-买盘；1-卖盘
 */
export const insertDepth = (list, item) => {
  console.log(list, "insertDepth");
  let arr = item.mdEntryType === 0 ? list.reverse() : list;
  let price = Number(item.price);
  let volume = Number(item.volume);
  let newItem = [price, volume];

  if (item.eventType === 3) {
    let findIndex = arr.findIndex((el) => price === Number(el[0]));
    if (findIndex !== -1) {
      arr.splice(findIndex, 1);
    }
  } else {
    let findIndex = arr.findIndex((el) => price <= Number(el[0]));
    if (findIndex === -1) {
      arr.push(newItem);
    } else {
      let findIndexSub = arr.findIndex((el) => price === Number(el[0]));
      if (findIndexSub === -1) {
        arr.splice(findIndex, 0, newItem);
      } else {
        arr.splice(findIndexSub, 1, newItem);
      }
    }
  }

  return item.mdEntryType === 0 ? arr.reverse() : arr;
};
