import historyProvider from "./historyProvider";
import store from "../../../../../store/store";
import { updateSUBSPUSH } from "../../../../../store/modules/contractSlice";
import { resovleTVData } from "../../../../../hooks/useSocketIO";
import { scientificNotationToString } from "../../../../../utils/filters";

const supportedResolutions = [
  "1",
  "3",
  "5",
  "15",
  "30",
  "60",
  "120",
  "240",
  "360",
  "720",
  "1D",
  "1W"
];

const config = {
  supported_resolutions: supportedResolutions
};

const priceTick = () => {
  const contractId = store.getState().spot.spotId;
  const contractItem = store.getState().spot.currentSpot;
  const priceTick = String(Number(contractItem?.priceTick));
  let precision, length;
  if (contractId && priceTick) {
    length = scientificNotationToString(Number(priceTick) || "0")?.split(".")[1]?.length || 2;

    precision = Math.pow(10, length);
  } else {
    precision = 100;
  }
  return precision;
};

export default {
  onReady: (cb) => {
    console.log("=====onReady running");
    setTimeout(() => cb(config), 0);
  },
  searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
    console.log("====Search Symbols running");
  },
  resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
    // expects a symbolInfo object in response
    // console.log('resolveSymbol:',{symbolName})
    // var split_data = symbolName.split(/[:/]/)
    // console.log({split_data})
    var symbol_stub = {
      name: symbolName,
      description: "",
      // type: 'crypto',
      session: "24x7",
      timezone: "Asia/Shanghai",
      ticker: symbolName,
      exchange: "",
      minmov: 1,
      pricescale: priceTick(),
      has_intraday: true,
      intraday_multipliers: supportedResolutions,
      supported_resolution: supportedResolutions,
      volume_precision: 8,
      data_status: "streaming",
      has_weekly_and_monthly: true
    };

    // if (split_data[2].match(/USD|EUR|JPY|AUD|GBP|KRW|CNY/)) {
    // 	symbol_stub.pricescale = 100
    // }
    setTimeout(function () {
      onSymbolResolvedCallback(symbol_stub);
    }, 0);

    // onResolveErrorCallback('Not feeling it today')
  },
  getBars: function (
    symbolInfo,
    resolution,
    from,
    to,
    onHistoryCallback,
    onErrorCallback,
    firstDataRequest
  ) {
    // console.log('function args',arguments)
    // console.log(`Requesting bars between ${new Date(from * 1000).toISOString()} and ${new Date(to * 1000).toISOString()}`)
    historyProvider
      .getBars(symbolInfo, resolution, from, to, firstDataRequest)
      .then((bars) => {
        if (bars.length) {
          onHistoryCallback(bars, { noData: false });
        } else {
          onHistoryCallback(bars, { noData: true });
        }
      })
      .catch((err) => {
        console.log({ err });
        onErrorCallback(err);
      });
  },
  subscribeBars: (
    symbolInfo,
    resolution,
    onRealtimeCallback,
    subscribeUID,
    onResetCacheNeededCallback
  ) => {
    const channelString = symbolInfo;

    var newSub = {
      channelString,
      subscribeUID,
      resolution,
      symbolInfo,
      lastBar: historyProvider.history[symbolInfo.name]
        ? historyProvider.history[symbolInfo.name].lastBar
        : {},
      listener: onRealtimeCallback
    };

    // let _sub = store.getState().contract._sub;
    // let a = state._subs;
    // a = [];
    // a.push(action.value);

    // store.dispatch(updateSUBSPUSH(newSub));
    window._subs = [newSub];

    // tickToKline
    // 切换分辨率后给 tickToKline 赋值，快速更新tick
    let barItem = newSub.lastBar;
    let newItem = [
      barItem.time,
      barItem.open,
      barItem.high,
      barItem.low,
      barItem.close,
      barItem.volume
    ];
    resovleTVData({ lines: [newItem] });
  },
  unsubscribeBars: (subscriberUID) => {},
  calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
    //optional
    // while optional, this makes sure we request 24 hours of minute data at a time
    // CryptoCompare's minute data endpoint will throw an error if we request data beyond 7 days in the past, and return no data
    return resolution < 60 ? { resolutionBack: "D", intervalBack: "1" } : undefined;
  },
  getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    //optional
  },
  getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
    //optional
  },
  getServerTime: (cb) => {}
};
