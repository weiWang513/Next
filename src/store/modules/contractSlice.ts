import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { queryCommonData, queryCurrency } from "../../services/api/contract";
import type { AppState } from "../store";

import { contractInitialState } from "./sliceInterface";
import { updateBar, trimStr } from "../../utils/math";

export const initialState: contractInitialState = {
  contractList: [],
  contractBasicList: [],
  allContractList: [],
  coinList: [],
  exchangeList: [],
  indictorList: [],
  currencyList: [],
  snapshot: {},
  contractId: 0,
  contractItem: {},
  favoritesListShow: true,
  orderConfirm: true,
  favoritesList: [],
  varietyMarginAll: {},
  futureLastestTickPrice: {},
  futureTick: [],
  hideOther: false,
  futureKline: [],
  resolution: "",
  _subs: [], // kline推送
  chartFull: false,
  tickToKline: { lines: [] },
  notice: {},
  contractListShow: false
};

export const getContractList: any = createAsyncThunk("contract/queryCommonData", async () => {
  const response = await queryCommonData();
  return response;
});

export const getCurrencyList: any = createAsyncThunk("contract/queryCurrency", async () => {
  const response = await queryCurrency();
  return response;
});

export const slice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    setContractList(state, { payload }) {
      state.contractList = payload;
    },
    setAllContractList(state, { payload }) {
      state.allContractList = payload;
    },
    setVarietyMarginAll(state, { payload }) {
      state.varietyMarginAll = payload;
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
      state.snapshot = payload;
    },
    updateContractItem(state, { payload }) {
      state.contractItem = payload;
    },
    updateContractId(state, { payload }) {
      state.contractId = payload;
      state.futureTick = [];
    },
    updateFavoritesList(state, { payload }) {
      state.favoritesList = payload;
    },
    updateFavoritesListShow(state, { payload }) {
      state.favoritesListShow = payload;
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
    updateNotice(state, { payload }) {
      state.notice = payload;
    },
    updateContractListShow(state, { payload }) {
      state.contractListShow = payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(getContractList.fulfilled, (state, { payload }) => {
      if (payload?.data?.code === 0) {
        state.contractList =
          payload?.data?.data?.contracts?.filter((el) => el.contractStatus !== 4) || [];
        state.contractBasicList =
          payload?.data?.data?.contracts?.filter((el) => el.contractStatus !== 4) || [];
        state.coinList = payload?.data?.data?.coins || [];
        state.exchangeList = payload?.data?.data?.exchanges || [];
      }
    });
    builder.addCase(getContractList.rejected, (state, action) => {
      if (action.payload) {
      } else {
      }
    });
    builder.addCase(getCurrencyList.fulfilled, (state, { payload }) => {
      if (payload?.data) {
        let data = payload?.data?.result;
        state.currencyList = data;
      }
    });
  }
});

export const {
  setContractList,
  setAllContractList,
  updateIndictorList,
  updateExchangeList,
  updateCoinList,
  updateSnapshot,
  updateContractId,
  updateContractItem,
  updateFavoritesListShow,
  updateOrderConfirm,
  updateFavoritesList,
  setVarietyMarginAll,
  updateFutureLastestTickPrice,
  updateFutureTick,
  updateHideOther,
  changeResolution,
  changeChartFull,
  updateSUBSPUSH,
  updateFutureKline,
  updateKLINEWS,
  updateNotice,
  updateContractListShow
} = slice.actions;

export const selectContractList = (state: AppState) => state?.contract?.contractList;

export const selectAllContractList = (state: AppState) => state?.contract?.allContractList;

export const selectIndictorList = (state: AppState) => state?.contract?.indictorList;

export const selectContractId = (state: AppState) => state?.contract?.contractId;

export default slice.reducer;
