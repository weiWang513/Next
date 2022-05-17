import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// import { tradingVolume, tradingData } from "../../services/api/home";

interface InitialState {
  deepthIndex: number | "";
  bidsAsks: {
    bids?: [];
    asks?: [];
    bidsMax: number;
    asksMax: number;
  };
  bidsAsksOrigin: {
    contractId?: number;
    bids?: [][];
    asks?: [][];
    cp?: "0";
    ip?: "0";
    lp?: "0";
  };
  bidsAsksForDepth: {
    contractId?: number;
    bids?: [][];
    asks?: [][];
  };
  entrustControlType: number;
}

export const initialState: InitialState = {
  deepthIndex: "",
  bidsAsksOrigin: {},
  bidsAsksForDepth: {},
  bidsAsks: {
    bids: [],
    asks: [],
    bidsMax: 0,
    asksMax: 0
  },
  entrustControlType: 0
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
    updateDeepthIndex(state, { payload }) {
      state.deepthIndex = payload;
    },
    updateBidsAsksOrigin(state, { payload }) {
      state.bidsAsksOrigin = payload;
    },
    updateBidsAsksForDepth(state, { payload }) {
      state.bidsAsksForDepth = payload;
    },
    updateBidsAsks(state, { payload }) {
      state.bidsAsks = payload;
    },
    setEntrustControlType(state, { payload }) {
      state.entrustControlType = payload;
    }
  }
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
  updateDeepthIndex,
  updateBidsAsksOrigin,
  updateBidsAsks,
  setEntrustControlType,
  updateBidsAsksForDepth
} = slice.actions;

export default slice.reducer;
