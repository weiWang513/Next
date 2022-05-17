import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { assetsInitialState } from "./sliceInterface";
export const initialState: assetsInitialState = {
  posListProps: [],
  curDelegateInfo: {
    // 当前委托信息
    list: [], // 当前委托列表
    curList: [], //  当前合约的当前委托列表
    OpenOrders: [],
    conOrders: []
  },
  accountList: [],
  accountListTemp: [],
  accountListLastId: 0,
  available: 0,
  marginAvail: 0,
  updateHoldPosi: true,
  energyList: [],
  conditionOrders: [],
  condiRestfulTimes: 0,
  condiOrderUuid: 0,
  conditionResf: false,
  posiReverseQty: "",
  posiReversePriceType: 3,
  posiReversePrice: ""
};

export const slice = createSlice({
  name: "assets",
  initialState,
  reducers: {
    resetData(state) {
      state.posListProps = [];
      state.curDelegateInfo = {
        // 当前委托信息
        list: [], // 当前委托列表
        curList: [], //  当前合约的当前委托列表
        OpenOrders: [],
        conOrders: []
      };
      state.accountList = [];
      state.accountListTemp = [];
      state.accountListLastId = 0;
      state.available = 0;
      state.marginAvail = 0;
      state.updateHoldPosi = true;
      state.energyList = [];
      state.conditionOrders = [];
      state.condiRestfulTimes = 0;
      state.condiOrderUuid = 0;
      state.conditionResf = false;
      state.posiReverseQty = "";
      state.posiReversePriceType = 3;
      state.posiReversePrice = "";
    },
    updateEnergyList(state, { payload }) {
      state.energyList = payload || [];
    },
    updateCondiRestfulTimes(state, { payload }) {
      state.condiRestfulTimes = payload;
    },
    updateCondiOrderUuid(state, { payload }) {
      state.condiOrderUuid = payload;
    },
    updateUpdateHoldPosi(state, { payload }) {
      state.updateHoldPosi = payload;
    },
    updateConditionOrders(state, { payload }) {
      state.conditionOrders = payload || [];
    },
    updatePosListProps(state, { payload }) {
      state.posListProps = payload || [];
    },
    updateCurDelegateInfo(state, { payload }) {
      state.curDelegateInfo = payload || {
        // 当前委托信息
        list: [], // 当前委托列表
        curList: [], //  当前合约的当前委托列表
        OpenOrders: [],
        conOrders: []
      };
    },
    updateAccountList(state, { payload }) {
      state.accountList = payload || [];
    },
    updateAccountListTemp(state, { payload }) {
      state.accountListTemp = payload || [];
    },
    updateAccountListLastId(state, { payload }) {
      state.accountListLastId = payload;
    },
    updateAvailable(state, { payload }) {
      state.available = payload;
    },
    updateMarginAvail(state, { payload }) {
      state.marginAvail = payload;
    },
    updateConditionResf(state, { payload }) {
      state.conditionResf = payload;
    },
    updatePosiReverseQty(state, { payload }) {
      state.posiReverseQty = payload;
    },
    updatePosiReversePriceType(state, { payload }) {
      state.posiReversePriceType = payload;
    },
    updatePosiReversePrice(state, { payload }) {
      state.posiReversePrice = payload;
    }
  }
});

export const {
  resetData,
  updatePosListProps,
  updateCurDelegateInfo,
  updateAccountList,
  updateAccountListTemp,
  updateAccountListLastId,
  updateAvailable,
  updateMarginAvail,
  updateUpdateHoldPosi,
  updateConditionOrders,
  updateEnergyList,
  updateCondiRestfulTimes,
  updateCondiOrderUuid,
  updateConditionResf,
  updatePosiReverseQty,
  updatePosiReversePriceType,
  updatePosiReversePrice
} = slice.actions;

export default slice.reducer;
