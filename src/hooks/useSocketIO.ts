/**
   * 权限类型	接口数据类型	topic	类型	描述	需要验签
      读取	推送类接口	match	SUB	获取持仓-推送	是
      读取	推送类接口	future_kline	SUB	获取K线-推送	否
      读取	推送类接口	match	SUB	获取减仓队列-推送	是
      读取	推送类接口	match	SUB	获取历史委托-推送	是
      读取	推送类接口	coin_price	SUB	获取币种价格-推送	否
      读取	推送类接口	future_market_stat	SUB	获取市场统计-推送	否
      读取	推送类接口	match	SUB	获取当前委托-推送	是
      读取	推送类接口	match	SUB	获取成交-推送	是
      读取	推送类接口	future_all_indicator	SUB	获取全量行情数据-推送	否
      读取	推送类接口	exchange	SUB	获取法币汇率-推送	否
      读取	推送类接口	realtime	SUB	获取系统时间-推送	否
      读取	推送类接口	future_snapshot_depth	SUB	获取行情快照买卖档位-推送	否
      读取	推送类接口	future_snapshot_indicator	SUB	获取行情快照基础数据-推送	否
      读取	推送类接口	match	SUB	获取资产-推送	是
      读取	推送类接口	future_tick	SUB	获取逐笔成交-推送	是
      读取	推送类接口	notice	SUB	获取通知-推送	否
 */

import React, { useCallback, useRef } from "react";
import io from "socket.io-client";
import { futureAllIndicatorToMarketList } from "../utils/DataParser";
import { updateSocketStatus, updateRealTime } from "../store/modules/appSlice";
import {
  updateIndictorList,
  updateExchangeList,
  updateCoinList,
  updateSnapshot,
  updateFutureTick,
  updateFutureLastestTickPrice,
  setContractList,
  updateFutureKline,
  updateKLINEWS,
  updateNotice
} from "../store/modules/contractSlice";
import {
  setSpotList,
  updateFutureTick as updateSpotFutureTick,
  updateExchangeList as updateSpotExchangeList,
  updateCoinList as updateSpotCoinList,
  updateSnapshot as updateSpotSnapshot,
  updateBidsAsks as updateSpotBidsAsks,
  updateBidsAsksOrigin as updateSpotBidsAsksOrigin,
  updateBidsAsksForDepth as updateSpotBidsAsksForDepth,
  updateFutureKline as updateSpotFutureKline,
  updateKLINEWS as updateSpotKLINEWS,
  updateFutureLastestTickPrice as updateSpotFutureLastestTickPrice
} from "../store/modules/spotSlice";
import { futureSnapshotIndicator } from "../utils/dataHelper";
import { useAppDispatch, useAppSelector } from "../store/hook";
import store from "../store/store";
import _ from "lodash";
import {
  updateBidsAsks,
  updateBidsAsksOrigin,
  updateBidsAsksForDepth
} from "../store/modules/orderBooks";
import { handleSnapshotDepth, updateAssetsInfo, updateCurDelegateList } from "../utils/calcFun";
import { posiHandel } from "../utils/tools";
import {
  updateAccountList,
  updateAccountListTemp,
  updateAvailable,
  updateConditionOrders,
  updateConditionResf,
  updateCurDelegateInfo,
  updateEnergyList,
  updateMarginAvail,
  updatePosListProps,
  updateUpdateHoldPosi
} from "../store/modules/assetsSlice";
import { setAccountList, updateCurOrder } from "../store/modules/spotSlice";
import { getInjectInfo } from "../functions/info";
import { updateBar, trimStr } from "../utils/math";
import { parseSpotList, parseSnapshot } from "../utils/wsParser";
import { wsReplace } from "../utils/utils";

export const resovleTVData = (data, tradePairSymbol?: string) => {
  // @ts-ignore
  let _subs = window._subs;
  let contractItem = store.getState().contract.contractItem;

  if (!_subs?.length) return;

  let symbol = tradePairSymbol || contractItem?.symbol;
  const sub = _subs.find((e) => {
    const str = trimStr(e.channelString.name);
    const str2 = trimStr(symbol);
    return str === str2;
  });

  if (!sub || !data.lines.length) return;

  [data.lines[data.lines.length - 1]].forEach((el) => {
    if (sub.lastBar && el[0] >= sub.lastBar.time) {
      const _lastBar = updateBar(el, sub);
      // send the most recent bar back to TV's realtimeUpdate callback
      sub.listener(_lastBar);

      // update our own record of lastBar
      // sub.lastBar = _lastBar;
      // store.dispatch(updateSUBSPUSH({ ...sub, lastBar: _lastBar })); // for tradingview

      // @ts-ignore
      window._subs = [{ ...sub, lastBar: _lastBar }];
      // 合约
      store.dispatch(updateKLINEWS(data)); // for tradingview
      // 现货
      store.dispatch(updateSpotKLINEWS(data)); // for tradingview
    }
  });
};

const useSocketIO = (type) => {
  const socket = useRef(null);
  const wsUrl = wsReplace(type);
  const socketURL = useRef(wsUrl);

  const dispatch = useAppDispatch();

  const initFutureTopics = [
    {
      topic: "future_all_indicator"
    },
    {
      topic: "exchange"
    },
    {
      topic: "coin_price"
    },
    {
      topic: "realtime"
    }
  ];
  const initSpotTopics = [
    {
      topic: "cash_all_indicator"
    },
    {
      topic: "exchange"
    },
    {
      topic: "coin_price"
    },
    {
      topic: "realtime"
    }
  ];

  const initTopics = type === "spot" ? initSpotTopics : initFutureTopics;

  const initSocket = () => {
    socket.current = io(socketURL.current, {
      jsonp: false,
      transports: ["websocket"]
    });

    socket.current.on("connect", () => {
      console.log("socket connect");
      subscribe(initTopics);
      dispatch(updateSocketStatus(true));
    });

    socket.current.on("future_all_indicator", (data) => {
      let indictorList = data?.map((el) => futureSnapshotIndicator(el));
      dispatch(updateIndictorList(indictorList));
      console.log("posiHandel");
      const marketData = futureAllIndicatorToMarketList(
        store.getState().contract.contractList,
        indictorList,
        store.getState().contract.exchangeList,
        store.getState().app.userHabit.currency,
        store.getState().contract.coinList
      );
      dispatch(setContractList(marketData));

      posiHandel(store.getState().assets.posListProps, marketData);
    });

    // 现货列表
    socket.current.on("cash_all_indicator", (data) => {
      const currentSpotList: SpotTradePair[] = store.getState().spot.spotList;
      const newSpotList: any[] = parseSpotList(data);
      // 合并数据
      const mergedSpotList = currentSpotList.map((item: SpotTradePair) => {
        const newItem = newSpotList.find((i: any) => i.id === item.id);
        return {
          ...item,
          ...newItem
        };
      });
      dispatch(setSpotList(mergedSpotList));
    });

    socket.current.on("future_snapshot_indicator", (data) => {
      dispatch(updateSnapshot(futureSnapshotIndicator(data).result));
    });
    // socket.current.on(
    //   "future_snapshot_indicator",
    //   _.throttle((data) => {
    //     dispatch(updateSnapshot(futureSnapshotIndicator(data).result));
    //   }, 500)
    // );

    // 现货-单量行情
    socket.current.on("cash_snapshot_indicator", (data) => {
      dispatch(updateSpotSnapshot(parseSnapshot(data)));
    });

    // 合约-深度
    socket.current.on("future_snapshot_depth", (data) => {
      if (data && store.getState().contract.contractId === data.contractId) {
        dispatch(updateBidsAsksOrigin(data));
        dispatch(
          updateBidsAsksForDepth(
            handleSnapshotDepth(
              { bids: data.bids.slice(0, 30), asks: data.asks.slice(0, 30) },
              // { bids: data.bids, asks: data.asks },
              0,
              store.getState().contract.contractItem?.priceTick
            )
          )
        );
        dispatch(
          updateBidsAsks(
            handleSnapshotDepth(
              { bids: data.bids, asks: data.asks },
              // { bids: data.bids.slice(0, 30), asks: data.asks.slice(0, 30) },
              store.getState().orderBooks.deepthIndex,
              store.getState().contract.contractItem?.priceTick
            )
          )
        );
      }
    });

    // 现货-深度
    socket.current.on("cash_snapshot_depth", (data) => {
      if (data && store.getState().spot.spotId === data.contractId) {
        dispatch(updateSpotBidsAsksOrigin(data));
        dispatch(
          updateSpotBidsAsksForDepth(
            handleSnapshotDepth(
              { bids: data.bids.slice(0, 30), asks: data.asks.slice(0, 30) },
              0,
              store.getState().spot.currentSpot?.priceTick
            )
          )
        );
        dispatch(
          updateSpotBidsAsks(
            handleSnapshotDepth(
              { bids: data.bids, asks: data.asks },
              // { bids: data.bids.slice(0, 30), asks: data.asks.slice(0, 30) },
              store.getState().spot.orderBook.deepthIndex,
              store.getState().spot.currentSpot?.priceTick
            )
          )
        );
      }
    });

    socket.current.on("exchange", (data) => {
      // 合约、现货分开更新
      dispatch(updateExchangeList(data));
      dispatch(updateSpotExchangeList(data));
    });

    socket.current.on("coin_price", (data) => {
      // 合约、现货分开更新
      dispatch(updateCoinList(data));
      dispatch(updateSpotCoinList(data));
    });

    socket.current.on("future_kline", (data) => {
      store.dispatch(updateFutureKline(data)); // for klinechart
      // store.dispatch(updateKLINEWS(data)); // for tradingview
      resovleTVData(data); // for tradingview
    });

    // 现货K线
    socket.current.on("cash_kline", (data) => {
      store.dispatch(updateSpotFutureKline(data)); // for klinechart
      resovleTVData(data, store.getState().spot?.currentSpot?.symbol); // for tradingview
    });

    socket.current.on("future_tick", (data) => {
      if (data !== null) {
        let _tread = data.trades;
        let futureTick = [];
        if (Array.isArray(_tread[0])) {
          futureTick = _tread;
        } else {
          if (store.getState().contract.futureTick.length < 50) {
            futureTick = [_tread, ...store.getState().contract.futureTick];
          } else {
            futureTick = [_tread, ...store.getState().contract.futureTick.slice(0, 49)];
          }
        }
        dispatch(updateFutureLastestTickPrice(data));

        dispatch(updateFutureTick(futureTick));

        //tickToKline
        if (
          store.getState().contract.tickToKline.lines.length > 0 &&
          data.contractId === store.getState().contract.contractId
        ) {
          //   {
          //     "lines": [
          //         [
          //             1638779820000,
          //             "47896.5",
          //             "47913.5",
          //             "47843.5",
          //             "47941.5",
          //             11539
          //         ]
          //     ]
          // }

          let originItem = store.getState().contract.tickToKline.lines?.[0];

          if (!originItem) return;
          let newItem = [];
          originItem.forEach((el, index) => {
            if (index === 4) {
              newItem[index] = data.trades[1];
            } else if (index === 5) {
              newItem[index] = Number(data.trades[2]) + Number(el);
            } else {
              newItem[index] = el;
            }
          });

          let tickForKline = { lines: [newItem] };

          resovleTVData(tickForKline);
        }
      }
    });

    // 现货-最新成交列表
    socket.current.on("cash_tick", (data) => {
      // console.log("cash_tick", data);
      if (data !== null) {
        let _tread = data.trades;
        let futureTick = [];
        if (Array.isArray(_tread[0])) {
          futureTick = _tread;
        } else {
          if (store.getState().spot.futureTick.length < 50) {
            futureTick = [_tread, ...store.getState().spot.futureTick];
          } else {
            futureTick = [_tread, ...store.getState().spot.futureTick.slice(0, 49)];
          }
        }
        dispatch(updateSpotFutureLastestTickPrice(data));

        dispatch(updateSpotFutureTick(futureTick));

        //tickToKline
        if (
          store.getState().spot.tickToKline.lines.length > 0 &&
          data.contractId === store.getState().spot.spotId
        ) {
          //   {
          //     "lines": [
          //         [
          //             1638779820000,
          //             "47896.5",
          //             "47913.5",
          //             "47843.5",
          //             "47941.5",
          //             11539
          //         ]
          //     ]
          // }

          let originItem = store.getState().spot.tickToKline.lines?.[0];

          if (!originItem) return;
          let newItem = [];
          originItem.forEach((el, index) => {
            if (index === 4) {
              newItem[index] = data.trades[1];
            } else if (index === 5) {
              newItem[index] = Number(data.trades[2]) + Number(el);
            } else {
              newItem[index] = el;
            }
          });

          let tickForKline = { lines: [newItem] };

          resovleTVData(tickForKline, store.getState().spot?.currentSpot?.symbol);
        }
      }
    });

    // 期货
    socket.current.on("match", (data) => {
      // console.log("======match======", data, data.messageType);
      dispatch(updateUpdateHoldPosi(false));
      switch (data.messageType) {
        case 3002:
          let accountObj = updateAssetsInfo(
            data,
            store.getState().assets.accountListTemp,
            store.getState().assets.posListProps,
            store.getState().contract.contractList,
            store.getState().assets.accountList,
            store.getState().contract.contractItem,
            store.getState().assets.conditionOrders,
            false
          );
          // accountObj &&
          //   accountObj.accountListTemp &&
          //   dispatch(updateAccountListTemp(accountObj.accountListTemp));
          dispatch(updateAccountListTemp(accountObj?.accountListTemp || []));
          // accountObj && accountObj.posiArr && dispatch(updatePosListProps(accountObj.posiArr));
          dispatch(updatePosListProps(accountObj?.posiArr || []));
          // accountObj &&
          //   accountObj.accountList &&
          //   dispatch(updateAccountList(accountObj.accountList));
          dispatch(updateAccountList(accountObj?.accountList || []));
          // accountObj && accountObj.available && dispatch(updateAvailable(accountObj.available));
          dispatch(updateAvailable(accountObj?.available || "0"));
          // accountObj &&
          //   accountObj.marginAvail &&
          //   dispatch(updateMarginAvail(accountObj?.marginAvail || "0"));
          dispatch(updateMarginAvail(accountObj?.marginAvail || "0"));

          // let accountObj = updateAssetsInfo(
          //   data,
          //   store.getState().SocketReducer.accountListTemp,
          //   store.getState().SocketReducer.accountListLastId,
          //   store.getState().SocketReducer.posListProps
          // )
          // store.dispatch(updateAccountListTemp(accountObj.accountListTemp))
          // store.dispatch(updateAccountListLastId(accountObj.accountListLastId))
          // console.log(accountObj, 'accountObj')
          // store.dispatch(updateAccountListTemp(data))
          break;
        case 3004:
          let _obj = updateCurDelegateList(
            data,
            store.getState().assets.curDelegateInfo,
            store.getState().contract.contractList,
            store.getState().contract.contractId,
            false
          );
          if (_obj) {
            dispatch(updateCurDelegateInfo(_obj));
          }
          // store.dispatch(updateCurDelegateInfo(data))
          break;
        case 3006:
          // store.dispatch(updateAccountListTemp(data))
          break;
        case 3010:
          // store.dispatch(updateAccountListTemp(data))
          break;
        case 3012:
          // console.log(store.getState().contractReducer, 'store.getState().contractReducer')
          // let _posiList = calcPosiArr(
          //   store.getState().contractReducer.contractList,
          //   data.posis,
          //   store.getState().SocketReducer.accountListTemp,
          //   store.getState().SocketReducer.accountList,
          //   store.getState().contractReducer.contractItem
          // )
          // console.log(_posiList, '_posiList')
          // store.dispatch(updatePosListProps(data))
          posiHandel(data.posis, store.getState().contract.contractList);
          break;
        case 3014:
          dispatch(updateEnergyList(data.ranks));
          break;

        default:
          break;
      }
    });

    // 现货
    socket.current.on("cash_match", (data) => {
      // console.log("cash_match", data);
      switch (data.messageType) {
        // 资产信息
        case 3002:
          let accountArr = [...store.getState().spot.accountList];
          let accountIndex = -1;
          if (accountArr.length > 0) {
            accountIndex = accountArr.findIndex((item) => item.currencyId === data.currencyId);
          }
          if (accountIndex > -1) {
            accountArr.splice(accountIndex, 1, data);
          } else {
            accountArr.push(data);
          }
          dispatch(setAccountList(accountArr));
          break;
        // 当前委托
        case 3004:
          let curOrderArr = [...store.getState().spot.curOrder];
          let curOrderIndex = -1;
          if (curOrderArr.length > 0) {
            curOrderIndex = curOrderArr.findIndex((item) => item.orderId === data.orderId);
          }
          if (curOrderIndex > -1) {
            if (data.leftQuantity > 0) {
              curOrderArr.splice(curOrderIndex, 1, data);
            } else {
              curOrderArr.splice(curOrderIndex, 1);
            }
          } else {
            if (data.leftQuantity > 0) {
              curOrderArr.unshift(data);
            }
          }
          dispatch(updateCurOrder(curOrderArr));
          break;
        // 历史委托
        case 3006:
          break;
        // 成交
        case 3010:
          break;
      }
    });

    socket.current.on("condition_order", (data) => {
      dispatch(updateConditionResf(true));
      // console.log(data, "condition_order");
      let _list = JSON.parse(JSON.stringify(store.getState().assets.conditionOrders));
      if (data.status && data.status !== 1 && data.status !== 5) {
        let index = _list.findIndex((el) => el.conditionOrderId === data.conditionOrderId);
        if (index > -1) {
          _list.splice(index, 1);
          dispatch(updateConditionOrders(_list));
        }
      } else {
        if (
          !store
            .getState()
            .assets.conditionOrders.find((el) => el.conditionOrderId === data.conditionOrderId)
        ) {
          dispatch(updateConditionOrders([data, ...store.getState().assets.conditionOrders]));
        } else {
          let index = _list.findIndex((el) => el.conditionOrderId === data.conditionOrderId);
          _list.splice(index, 1, data);
          dispatch(updateConditionOrders(_list));
        }
      }
      posiHandel(store.getState().assets?.posListProps, store.getState().contract.contractList);
    });

    socket.current.on("notice", (data) => {
      if (data !== null) {
        let notice = data[0];
        dispatch(updateNotice(notice));
      }
    });

    socket.current.on("realtime", (data) => {
      let timeSlice = data?.timeSlice; // microsecond
      timeSlice && dispatch(updateRealTime(Math.floor(timeSlice / 1000))); //store millisecond
    });

    socket.current.on("disconnect", () => {
      //   subscribe(store.getState().SocketReducer.currentTopicsState);
      console.log("socket disconnected");
      dispatch(updateSocketStatus(false));
    });

    socket.current.on("connect_error", (error) => {
      dispatch(updateSocketStatus(false));
    });

    socket.current.on("connect_timeout", (timeout) => {
      dispatch(updateSocketStatus(false));
    });

    socket.current.on("error", (error) => {
      dispatch(updateSocketStatus(false));
    });

    return socket.current;
  };

  const reSubscribe = (topics) => {
    topics ? subscribe(topics) : subscribe(initTopics);
  };

  const authSubscribe = () => {
    if (socket.current) {
      let token = getInjectInfo("_authorization");
      token &&
        socket.current.emit("auth", {
          header: {
            type: 1001
          },
          body: {
            token: token
          }
        });
    }
  };

  /**
   * @description subscribe
   * @param topic
   * @memberof SocketIO
   */
  const subscribe = (topic) => {
    if (socket.current) {
      socket.current.emit("subscribe", {
        header: {
          type: 1003
        },
        body: {
          topics: topic
        }
      });
    }
  };

  // 断开socket
  const disconnect = () => {
    if (socket?.current?.connected) {
      socket.current.disconnect();
    }
    // socket.current = null;
  };

  // 重连socket
  const reconnect = () => {
    if (socket?.current?.disconnected) {
      socket.current.open();
      //   socket.current.connect(socketURL.current, {
      //     jsonp: false,
      //     transports: ["websocket"],
      //   });
    }
  };

  return {
    initSocket,
    reSubscribe,
    disconnect,
    reconnect,
    authSubscribe
  };
};

export default useSocketIO;
