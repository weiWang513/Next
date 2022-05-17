import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// import { tradingVolume, tradingData } from "../../services/api/home";
import { placeInitialState } from "./sliceInterface";

export const initialState: placeInitialState = {
  price: "", // 价格
  count: "", // 数量
  stopPrice: "", // 条件单价格
  stopPriceType: 2, // 条件单价格
  side: 1, // 方向
  priceTypeTab: 1, // 价格类型 1 限价 3 市价 4 条件单
  priceType: 1, // 价格类型 1 限价 3 市价
  modeType: 1, // 仓位类型 1 全仓 2 逐仓
  lever: 20, // 杠杆
  maxLever: 100,
  leverTypes: [1, 2, 3, 5, 10, 20, 50, 100], // 杠杆数组
  stopType: 0, // 条件单类型
  qtyBuy: 0, // 数量-买方向
  qtySell: 0, // 数量-卖方向
  commissionValueBuy: 0, // 价值-买方向
  commissionValueSell: 0, // 价值-卖方向
  costBuy: 0, // 成本-买方向
  costSell: 0, // 成本-卖方向
  crossLever: 0, // 最大杠杆
  allInQuantityBuy: 0, // 最大可开数量 买方向
  allInQuantitySell: 0, // 最大可开数量 卖方向
  allInValueBuy: 0, // 最大可开价值 买方向
  allInValueSell: 0, // 最大可开价值 卖方向
  setSP: false, // 设置止盈
  setSL: false, // 设置止损
  profitInput: "", // 止盈价格
  lossInput: "", // 止损价格
  profitStopType: 2, // 止盈类型
  lossStopType: 2, // 止损类型
  Passive: false, // 被动委托
  countType: 0, // 数量-金额标志
  positionEffect: 1, // 是否平仓标志
  closeFlag: false, // 触发后平仓
  percent: 0, //
  posiMode: 0,
};

// export const getTradingVolume: any = createAsyncThunk(
//   "home/tradingVolume",
//   async () => {
//     const response = await tradingVolume();
//     return response;
//   }
// );

export const slice = createSlice({
  name: "home",
  initialState,
  reducers: {
    updatePrice(state, { payload }) {
      state.price = payload;
    },
    updatePercent(state, { payload }) {
      state.percent = payload;
    },
    updateMaxLever(state, { payload }) {
      state.maxLever = payload;
    },
    updateCloseFlag(state, { payload }) {
      state.closeFlag = payload;
    },
    updateCount(state, { payload }) {
      state.count = payload;
    },
    updateStopPrice(state, { payload }) {
      state.stopPrice = payload;
    },
    updateStopPriceType(state, { payload }) {
      state.stopPriceType = payload;
    },
    updateSide(state, { payload }) {
      state.side = payload;
    },
    updatePriceType(state, { payload }) {
      state.priceType = payload;
    },
    updatePriceTypeTab(state, { payload }) {
      state.priceTypeTab = payload;
    },
    updateModeType(state, { payload }) {
      state.modeType = payload;
    },
    updateLever(state, { payload }) {
      state.lever = payload;
    },
    updateLeverTypes(state, { payload }) {
      state.leverTypes = payload;
    },
    updateStopType(state, { payload }) {
      state.stopType = payload;
    },
    updateQtyBuy(state, { payload }) {
      state.qtyBuy = payload;
    },
    updateQtySell(state, { payload }) {
      state.qtySell = payload;
    },
    updateCommissionValueBuy(state, { payload }) {
      state.commissionValueBuy = payload;
    },
    updateCommissionValueSell(state, { payload }) {
      state.commissionValueSell = payload;
    },
    updateCostBuy(state, { payload }) {
      state.costBuy = payload;
    },
    updateCostSell(state, { payload }) {
      state.costSell = payload;
    },
    updateCrossLever(state, { payload }) {
      state.crossLever = payload;
    },
    updateAllInQuantityBuy(state, { payload }) {
      state.allInQuantityBuy = payload;
    },
    updateAllInQuantitySell(state, { payload }) {
      state.allInQuantitySell = payload;
    },
    updateAllInValueBuy(state, { payload }) {
      state.allInValueBuy = payload;
    },
    updateAllInValueSell(state, { payload }) {
      state.allInValueSell = payload;
    },
    updateSetSP(state, { payload }) {
      state.setSP = payload;
    },
    updateSetSL(state, { payload }) {
      state.setSL = payload;
    },
    updateProfitInput(state, { payload }) {
      state.profitInput = payload;
    },
    updateLossInput(state, { payload }) {
      state.lossInput = payload;
    },
    updateProfitStopType(state, { payload }) {
      state.profitStopType = payload;
    },
    updateLossStopType(state, { payload }) {
      state.lossStopType = payload;
    },
    updatePassive(state, { payload }) {
      state.Passive = payload;
    },
    updateCountType(state, { payload }) {
      state.countType = payload;
    },
    updatePositionEffect(state, { payload }) {
      state.positionEffect = payload;
    },
    updatePosiMode(state, { payload }) {
      state.posiMode = payload;
    },
    initPlaceData(state) {
      console.log("initPlaceData");
      state.price = ""; // 价格
      state.count = ""; // 数量
      state.stopPrice = ""; // 条件单价格
      state.stopType = 0; // 条件单类型
      state.qtyBuy = 0; // 数量-买方向
      state.qtySell = 0; // 数量-卖方向
      state.commissionValueBuy = 0; // 价值-买方向
      state.commissionValueSell = 0; // 价值-卖方向
      state.costBuy = 0; // 成本-买方向
      state.costSell = 0; // 成本-卖方向
      state.allInQuantityBuy = 0; // 最大可开数量 买方向
      state.allInQuantitySell = 0; // 最大可开数量 卖方向
      state.allInValueBuy = 0; // 最大可开价值 买方向
      state.allInValueSell = 0; // 最大可开价值 卖方向
      state.setSP = false; // 设置止盈
      state.setSL = false; // 设置止损
      state.profitInput = ""; // 止盈价格
      state.lossInput = ""; // 止损价格
      state.profitStopType = 2; // 止盈类型
      state.lossStopType = 2; // 止损类型
      state.Passive = false; // 被动委托
      state.positionEffect = 1; // 是否平仓标志
      state.closeFlag = false; // 触发后平仓
      state.percent = 0; //
    },
  },
  // extraReducers: (builder) => {
  //   builder.addCase(getTradingVolume.fulfilled, (state, { payload }) => {
  //     if (payload?.data?.code === 0) {
  //       let data = payload.data.data;
  //       state.tradingVolume = data;
  //     }
  //   });
  //   builder.addCase(getTradingVolume.rejected, (state, action) => {
  //     if (action.payload) {
  //     } else {
  //     }
  //   });
  // },
});

export const {
  updatePrice,
  updateMaxLever,
  updateCloseFlag,
  updateCount,
  updateStopPrice,
  updateStopPriceType,
  updateSide,
  updatePriceType,
  updatePriceTypeTab,
  updateModeType,
  updateLever,
  updateLeverTypes,
  updateStopType,
  updateQtyBuy,
  updateQtySell,
  updateCommissionValueBuy,
  updateCommissionValueSell,
  updateCostBuy,
  updateCostSell,
  updateCrossLever,
  updateAllInQuantityBuy,
  updateAllInQuantitySell,
  updateAllInValueBuy,
  updateAllInValueSell,
  updateSetSP,
  updateSetSL,
  updateProfitInput,
  updateLossInput,
  updateProfitStopType,
  updateLossStopType,
  updatePassive,
  updateCountType,
  updatePositionEffect,
  updatePercent,
  updatePosiMode,
  initPlaceData,
} = slice.actions;

export default slice.reducer;
