import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { queryCommonData, queryCurrency } from "../../services/api/spot";
import { parseSpotTradePairList } from "../../services/parser/spot/parserSpotList";
import { AppState } from "../store";

import { spotInitialState } from "./sliceInterface";

export const initialState: spotInitialState = {
  spotList: [],
  allSpotList: [], // init list ; not update
  currentSpot: {},
  coinList: [],
  exchangeList: [],
  spotId: 0,
  snapshot: null,
  prevSnapshot: null,
  visibleSpotList: false,
  orderBook: {
    deepthIndex: 0.5,
    bidsAsksOrigin: {},
    preBidsAsksOrigin: {},
    bidsAsksForDepth: {},
    bidsAsks: {
      bids: [],
      asks: [],
      bidsMax: 0,
      asksMax: 0
    },
    entrustControlType: 0
  },

  favoritesList: [],
  orderConfirm: true,

  accountList: [],
  indictorList: [],
  currencyList: [],

  futureLastestTickPrice: {},
  futureTick: [],
  futureKline: [],
  hideOther: false,
  resolution: "",
  _subs: [], // kline推送
  chartFull: false,
  tickToKline: { lines: [] },
  curOrder: [],
  orderPrice: "",
  orderQty: ""
};

export const getSpotContractList: any = createAsyncThunk("cash/queryCommonData", async () => {
  const response = await queryCommonData();
  return response;
});

export const getSpotCurrencyList: any = createAsyncThunk("cash/queryCurrency", async () => {
  const response = await queryCurrency();
  return response;
});

export const slice = createSlice({
  name: "spot",
  initialState,
  reducers: {
    setSpotList(state, { payload }) {
      state.spotList = payload;
    },
    setAccountList(state, { payload }) {
      state.accountList = payload;
    },
    updateIndictorList(state, { payload }) {
      state.indictorList = payload;
    },
    updateHideOther(state, { payload }) {
      state.hideOther = payload;
    },
    updateFutureLastestTickPrice(state, { payload }) {
      state.futureLastestTickPrice = payload;
    },
    updateFutureTick(state, { payload }) {
      state.futureTick = payload;
    },
    updateExchangeList(state, { payload }) {
      state.exchangeList = payload;
    },
    updateCoinList(state, { payload }) {
      state.coinList = payload;
    },
    updateSnapshot(state, { payload }) {
      state.prevSnapshot = state.snapshot || payload;
      state.snapshot = payload;
    },
    updateCurrentSpot(state, { payload }) {
      state.currentSpot = payload;
    },
    updateSpotId(state, { payload }) {
      if (state.spotId !== payload) {
        state.spotId = payload;

        state.futureTick = [];
        state.orderBook = {
          deepthIndex: 0.5,
          bidsAsksOrigin: {},
          preBidsAsksOrigin: {},
          bidsAsksForDepth: {},
          bidsAsks: {
            bids: [],
            asks: [],
            bidsMax: 0,
            asksMax: 0
          },
          entrustControlType: 0
        };

        state.snapshot = null;
        state.prevSnapshot = null;
      }
    },
    updateFavoritesList(state, { payload }) {
      state.favoritesList = payload;
    },
    updateOrderConfirm(state, { payload }) {
      state.orderConfirm = payload;
    },
    changeResolution(state, { payload }) {
      state.resolution = payload;
      state.tickToKline = {
        lines: []
      };
    },
    changeChartFull(state, { payload }) {
      state.chartFull = payload;
    },
    updateSUBSPUSH(state, { payload }) {
      state._subs = [{ ...payload }];
    },
    updateFutureKline(state, { payload }) {
      state.futureKline = payload;
    },
    updateKLINEWS(state, { payload }) {
      let data = payload;
      state.tickToKline = {
        lines: [data.lines[data.lines.length - 1]]
      };
    },
    toggleSpotListVisible(state, { payload }) {
      state.visibleSpotList = payload;
    },
    updateDeepthIndex(state, { payload }) {
      state.orderBook.deepthIndex = payload;
    },
    updateBidsAsksOrigin(state, { payload }) {
      state.orderBook.preBidsAsksOrigin = state.orderBook.bidsAsksOrigin || payload;
      state.orderBook.bidsAsksOrigin = payload;
    },
    updateBidsAsksForDepth(state, { payload }) {
      state.orderBook.bidsAsksForDepth = payload;
    },
    updateBidsAsks(state, { payload }) {
      state.orderBook.bidsAsks = payload;
    },
    setEntrustControlType(state, { payload }) {
      state.orderBook.entrustControlType = payload;
    },
    updateCurOrder(state, { payload }) {
      state.curOrder = payload;
    },
    updateOrderPrice(state, { payload }) {
      state.orderPrice = payload;
    },
    updateOrderQty(state, { payload }) {
      state.orderQty = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getSpotContractList.fulfilled, (state, { payload }) => {
      if (payload?.data?.code === 0) {
        state.spotList = parseSpotTradePairList(payload?.data?.data?.contracts || []);
        state.coinList = payload?.data?.data?.coins || [];
        state.exchangeList = payload?.data?.data?.exchanges || [];
        state.allSpotList = parseSpotTradePairList(payload?.data?.data?.contracts || [], true); // filter contractid<26
      }
    });
    builder.addCase(getSpotCurrencyList.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        let data = payload?.data?.result;
        state.currencyList = data;
      }
    });
  }
});

export const {
  setSpotList,
  setAccountList,
  updateIndictorList,
  updateExchangeList,
  updateCoinList,
  updateSnapshot,
  updateSpotId,
  updateCurrentSpot,
  updateOrderConfirm,
  updateFavoritesList,
  updateFutureLastestTickPrice,
  updateFutureTick,
  updateHideOther,
  changeResolution,
  changeChartFull,
  updateSUBSPUSH,
  updateFutureKline,
  updateKLINEWS,
  toggleSpotListVisible,
  updateDeepthIndex,
  updateBidsAsksOrigin,
  updateBidsAsks,
  setEntrustControlType,
  updateBidsAsksForDepth,
  updateCurOrder,
  updateOrderPrice,
  updateOrderQty
} = slice.actions;

export const selectSpotList = (state: AppState) => state.spot?.spotList;
export const selectCurrentSpot = (state: AppState) => state.spot?.currentSpot;
export const selectSpotSnapshot = (state: AppState) => state.spot?.snapshot;
export const selectPrevSpotSnapshot = (state: AppState) => state.spot?.prevSnapshot;
export const selectCoinList = (state: AppState) => state.spot?.coinList;
export const selectExchangeList = (state: AppState) => state.spot?.exchangeList;

export const selectVisibleSpotList = (state: AppState) => state.spot?.visibleSpotList;

export const selectIndictorList = (state: AppState) => state?.spot?.indictorList;
export const selectSpotId = (state: AppState) => state?.spot?.spotId;
export const selectBidsAsksOrigin = (state: AppState) => state?.spot?.orderBook?.bidsAsksOrigin;
export const selectPreBidsAsksOrigin = (state: AppState) =>
  state?.spot?.orderBook?.preBidsAsksOrigin;

export default slice.reducer;
