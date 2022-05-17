import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { tradingVolume, tradingData } from "../../services/api/home";

interface InitialState {
  tradingVolume: TradingVolume;
}

interface TradingVolume {
  tradingUserCount?: number;
  tradingVolume24h?: [];
  ventureFund?: number;
  currencyTradingVolume24h?:[]
  contractTradingVolume24h?:[]
  openInterest?:[]
}

export const initialState: InitialState = {
  tradingVolume: {},
};

export const getTradingVolume: any = createAsyncThunk(
  "home/tradingVolume",
  async () => {
    const response = await tradingVolume();
    return response;
  }
);

export const slice = createSlice({
  name: "home",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getTradingVolume.fulfilled, (state, { payload }) => {
      if (payload?.data?.code === 0) {
        let data = payload.data.data;
        state.tradingVolume = data;
      }
    });
    builder.addCase(getTradingVolume.rejected, (state, action) => {
      if (action.payload) {
      } else {
      }
    });
  },
});

export const {} = slice.actions;

export default slice.reducer;
