import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DEFAULT_LANG,
  STATUS_FAILED,
  STATUS_FULFILLED,
  STATUS_IDLE,
  STATUS_PENDING
} from "../../contants";
import { queryCoinInfo } from "../../services/api/spot";
import { AppState } from "../store";

type StateType = {
  status: STATUS;
  currentCoin: string;
  coinInfo: CoinInfo;
};

const initialState: StateType = {
  status: STATUS_IDLE,
  currentCoin: "btc",
  coinInfo: null
};

/**
 *  获取币种信息
 *  @param symbol 币种名称(示例: btc)
 **/
export const getCoinInfo: any = createAsyncThunk(
  "cash/getCoinInfo",
  async ({ symbol, lang = DEFAULT_LANG }: { symbol: string; lang?: string }) => {
    const response: any = await queryCoinInfo({ symbol, lang });
    return response;
  }
);

export const slice = createSlice({
  name: "spot",
  initialState,
  reducers: {
    setCurrentCoin: (state, action: PayloadAction<{ symbol: string }>) => {
      state.currentCoin = action.payload.symbol;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCoinInfo.pending, (state, _action) => {
        state.status = STATUS_PENDING;
      })
      .addCase(getCoinInfo.fulfilled, (state, action) => {
        try {
          const {
            rank,
            marketCap,
            circulatingSupply,
            maxSupply,
            totalSupply,
            issueDate,
            issuePrice,
            desc
          } = action.payload?.data?.data;
          state.status = STATUS_FULFILLED;
          state.coinInfo = {
            rank,
            marketCap,
            circulatingSupply,
            maxSupply,
            totalSupply,
            issueDate,
            issuePrice,
            desc
          };
        } catch (error) {}
      })
      .addCase(getCoinInfo.rejected, (state, _action) => {
        state.status = STATUS_FAILED;
      });
  }
});

export const { setCurrentCoin } = slice.actions;

export const selectCoinInfoStatus = (state: AppState) => state.coinInfo?.status || STATUS_IDLE;
export const selectCoinInfo = (state: AppState) => state.coinInfo?.coinInfo || null;
export const selectCurrentCoin = (state: AppState) => state.coinInfo?.currentCoin;

export default slice.reducer;
