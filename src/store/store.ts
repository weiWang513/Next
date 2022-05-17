import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import thunk from "redux-thunk";
import appReducer from "./modules/appSlice";
import contractReducer from "./modules/contractSlice";
import homeReducer from "./modules/homeSlice";
import orderReducer from "./modules/orderBooks";
import placeReducer from "./modules/placeSlice";
import spotReducer from "./modules/spotSlice";
import coinInfoReducer from "./modules/coinInfoSlice";

// export function makeStore() {
//   return configureStore({
//     reducer: {
//       app: appReducer,
//       contract: contractReducer,
//       home: homeReducer,
//       orderBooks:
//       orderReducer,
//       place: placeReducer,
//       asset: assetReducer,
//     },
import assets from "./modules/assetsSlice";

export function makeStore() {
  return configureStore({
    reducer: {
      app: appReducer,
      contract: contractReducer,
      home: homeReducer,
      orderBooks: orderReducer,
      place: placeReducer,
      assets,
      spot: spotReducer,
      coinInfo: coinInfoReducer
    },
    middleware: [thunk]
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

// export type AppStore = ReturnType<typeof makeStore>;

// const wrapper = createWrapper<AppStore>(makeStore);

export default store;
