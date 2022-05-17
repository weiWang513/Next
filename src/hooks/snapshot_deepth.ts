import useSocketIO from './useSocketIO'
import _ from "lodash";
import store from "../store/store";
import { updateBidsAsks, updateBidsAsksOrigin } from '../store/modules/orderBooks';
import { handleSnapshotDepth } from '../utils/calcFun';
export const initSnapshotDeepth = (socket) => {
  console.log('socket', socket)
  socket?.on(
    "future_snapshot_depth",
    _.throttle((data) => {
      if (data && store.getState().contract.contractId === data.contractId) {
        store.dispatch(updateBidsAsksOrigin(data));
        store.dispatch(
          updateBidsAsks(
            handleSnapshotDepth(
              { bids: data.bids.slice(0, 30), asks: data.asks.slice(0, 30)},
              store.getState().orderBooks.deepthIndex,
              store.getState().contract.contractItem?.priceTick
            )
          )
        );
      }
    }, 500)
  );
}