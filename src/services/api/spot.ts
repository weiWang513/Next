import http from "../http";

export const queryCommonData = () => http.get("/cash/queryCommonData");
export const queryIndicatorList = () => http.get("/cashQuot/queryIndicatorList"); // 获取现货所有交易对行情
export const queryCurrency = () => http.get("/common/queryCurrency");
export const querySnapshot = (params) => http.get("/cashQuot/querySnapshot", { params }); // 获取现货行情快照
export const queryAvailable = () => http.get("/cash/queryAvailable"); // 获取现货可用资金查询
export const placeOrder = (params) =>
  http.post("/cash/place", params.params, { headers: params.headers }); // 下单
export const cancelOrder = (params) =>
  http.post("/cash/cancel", params.params, { headers: params.headers }); // 撤单
export const cancelAllOrder = (params) =>
  http.get("/cash/cancelAll", {
    headers: params.headers,
    params: params.params
  }); // 一键撤单
export const queryTickTrade = (params) => http.get("/cashQuot/queryTickTrade", { params }); // 获取逐笔成交
export const getKline = (params) => http.get("/cashQuot/queryCandlestick", { params }); // 获取K线
export const queryActiveOrder = () => http.get("/cash/queryActiveOrders"); // 当前委托查询
export const queryHisOrder = (params) => http.get("/cash/queryHisOrder", { params }); // 历史委托
export const queryHisMatch = (params) => http.get("/cash/queryHisMatch", { params }); // 成交明细查询

export const getFavorite = () => http.get("/cash/queryFavoriteList"); // 收藏列表
export const deleteFavorite = (params) => http.get("/cash/deleteFavorite", { params }); // 删除收藏
export const addFavorite = (params) => http.post("/cash/addFavorite", params); // 添加收藏
export const queryCoinInfo = ({ symbol, lang }: { symbol: string; lang: string }) =>
  http.get("/common/queryCoinInfo", { params: { symbol, lang } });
