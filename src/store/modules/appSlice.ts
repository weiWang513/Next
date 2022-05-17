import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface InitialState {
  appStatus: "idle" | "loading" | "fulfilled" | "failed";
  isLogin: boolean;
  userHabit: {
    // 涨跌色，0：绿涨红跌,1：红涨绿跌，
    upDownColor: string;
    // 汇率（货币）、计价方式，默认"USD"
    currency: string;
    // 'first：限价，second：市价，third：条件单'，默认"second"
    placeIndex: string;
    // '杠杆倍数'，默认"10"
    lever: string;
    // 按金额下单状态 0:张 1:金额，默认0
    countType: number;
    // 1:隐藏 2:显示，默认1
    hideSmall: number;
    // 当前语言，默认"zh_CN"
    locale: string;
  };
  socketStatus: boolean;
  realTime: number;
  versionObj: Object;
  userInfo: any;
  certInfo: any;
  showFavor: boolean;
  placeConfirm: boolean;
  userLoginInfo: any;
  uid: any;
  fromPath: string;
}

export const initialState: InitialState = {
  appStatus: "idle",
  isLogin: false,
  userHabit: {
    upDownColor: "0", // 1001：涨跌色，0：绿涨红跌,1：红涨绿跌，
    currency: "USD", // 1003：计价方式,
    placeIndex: "second", // 1004：'first：限价，second：市价，third：条件单'
    lever: "10", // 1005：'杠杆倍数'
    countType: 0, // 1006 按金额下单状态 0:张 1:金额
    hideSmall: 1, // 1008 1:隐藏 2:显示
    locale: "", // 当前语言
  },
  socketStatus: false,
  realTime: 0,
  versionObj: {},
  userInfo: {},
  certInfo: {},
  showFavor: true,
  placeConfirm: false,
  userLoginInfo: {},
  uid: '',
  fromPath: '/'
};

export const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppStatus(state, action) {
      state.appStatus = "fulfilled";
    },
    setVersionObj(state, action) {
      state.versionObj = action.payload;
    },
    setIsLogin(state, action) {
      // console.log("setIsLogin", action.payload);
      state.isLogin = action.payload;
    },
    updateSocketStatus(state, action) {
      console.log(action, "socketStatus");
      state.socketStatus = action.payload;
    },
    updateRealTime(state, action) {
      state.realTime = action.payload;
    },
    updateUid(state, action) {
      state.uid = action.payload;
    },
    setLocale(state, { payload }) {
      console.log("setLocale", payload);
      state.userHabit.locale = payload || "en_US";
    },
    setCurrency(state, { payload }) {
      state.userHabit.currency = payload || "USD";
    },
    setUpDownColor(state, { payload }) {
      state.userHabit.upDownColor = payload || "0";
    },
    setUserInfo(state, action) {
      state.userInfo = action.payload;
    },
    setCertInfo(state, action) {
      state.certInfo = action.payload;
    },
    setShowFavor(state, action) {
      state.showFavor = action.payload;
    },
    setPlaceConfirm(state, action) {
      state.placeConfirm = action.payload;
    },
    setUserLoginInfo(state, action) {
      state.userLoginInfo = action.payload;
    },
    setFromPath(state, action) {
      state.fromPath = action.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const {
  setAppStatus,
  setIsLogin,
  updateSocketStatus,
  updateRealTime,
  setLocale,
  setCurrency,
  setUpDownColor,
  setVersionObj,
  setUserInfo,
  setCertInfo,
  setShowFavor,
  setPlaceConfirm,
  setUserLoginInfo,
  updateUid,
  setFromPath
} = slice.actions;

export const selectAppStatus = (state) => state.app.appStatus;
export const selectIsLogin = (state) => state.app.isLogin;
export const selectUserHabit = (state) => state.app.userHabit;
export const selectUserInfo = (state) => state.app.userInfo;
export const selectCertInfo = (state) => state.app.certInfo;
export const selectSocketStatus = (state) => state.app.socketStatus;
export const selectShowFavor = (state) => state.app.showFavor;
export const selectPlaceConfirm = (state) => state.app.placeConfirm;
export const selectSocketStatusr = (state) => state.app.socketStatus;
export const selectUserLoginInfo = (state) => state.app.userLoginInfo;

export default slice.reducer;
