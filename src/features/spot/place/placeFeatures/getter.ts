import store from "../../../../store/store";

export const getLastPrice = () => {
  return store?.getState().spot?.snapshot?.lastPrice || "1";
};
