import http from "../http";

export const queryCommonData = () => http.get("/future/queryCommonData");
export const queryIndicatorList = () =>
  http.get("/futureQuot/queryIndicatorList"); // 获取期货所有交易对行情
export const queryCurrency = () => http.get("/common/queryCurrency");
export const querySnapshot = (params) =>
  http.get("/futureQuot/querySnapshot", { params }); // 获取期货行情快照
export const queryAvail = (params) =>
  http.get("/future/queryAvail", { params }); // 获取期货可用资金查询
export const queryAvailable = (params) =>
  http.get("/futureAsset/queryAvailable", { params }); // 获取期货可用资金查询
export const queryForceLower = (params) =>
  http.get("/future/queryForceLower", { params }); // 强减队列查询
export const queryVarietyMargin = (params) =>
  http.get("/future/queryVarietyMargin", { params }); // 查询用户合约保证金梯度
export const placeOrder = (params) =>
  http.post("/future/place", params.params, { headers: params.headers }); // 下单
export const conditionOrderPlace = (params) =>
  http.post("/future/condition/order/placeOrder", params.params, {
    headers: params.headers,
  }); // 下单
export const adjustMarginRate = (params) =>
  http.post("/future/adjustMarginRate", params.params, {
    headers: params.headers,
  }); // 修改仓位模式
export const cancelOrder = (params) =>
  http.post("/future/cancel", params.params, { headers: params.headers }); // 撤单
export const cancelCondOrder = (params) =>
  http.post("/future/condition/order/cancel", params.params, {
    headers: params.headers,
  }); // 撤条件单
export const cancels = (params) => http.delete("/future/cancels", params); // 批量撤单
export const conditionCancels = (params) =>
  http.post("/future/condition/order/cancels", params.params, {
    headers: params.headers,
  }); // 批量撤单
export const cancelAllOrder = (params) =>
  http.get("/future/cancelAll", {
    headers: params.headers,
    params: params.params,
  }); // 一键撤单
export const queryTickTrade = (params) =>
  http.get("/futureQuot/queryTickTrade", { params }); // 获取逐笔成交
export const getKline = (params) =>
  http.get("/futureQuot/queryCandlestick", { params }); // 获取K线
export const queryPosi = (params) => http.get("/future/queryPosi"); // 持仓查询
export const conditionHistoryQuery = (params) =>
  http.get("/future/condition/order/historyQuery", { params }); // 历史条件委托查询
export const queryActiveOrder = (params) =>
  http.get("/future/queryActiveOrder"); // 当前委托查询
export const condActiveQuery = (params) =>
  http.get("/future/condition/order/activeQuery"); // 当前委托查询
export const queryLastestHistoryOrders = (params) =>
  http.get("/future/queryLastestHistoryOrders"); // 最新委托历史
export const receiveGift = (params) => http.post("/simulation/receiveGift"); // 模拟交易-领取礼物
export const receiveSimulationCurrency = (params) =>
  http.post("/simulation/receiveSimulationCurrency"); // 模拟交易-重新获取模拟交易币
export const querySimultionDetail = (params) =>
  http.get("/simulation/querySimultionDetail"); // 模拟交易-查询模拟交易详情
export const querySimulationUserStatus = (params) =>
  http.post("/simulation/querySimulationUserStatus"); // 模拟交易-查询用户模拟交易状态
export const adjustMargin = (params) =>
  http.post("/future/adjustMargin", params.params, { headers: params.headers }); // 调整保证金
export const queryAccountAssetFlow = (params) =>
  http.get("/future/queryAccountAssetFlow", { params }); // 查询用户资金流水
export const queryAssetFlowType = () => http.get("/future/queryAssetFlowType"); // 查询用户资金流水类型
export const queryUserProfitLossList = (params) =>
  http.get("/future/queryUserProfitLossList", { params }); // 查询用户盈亏历史
export const queryContractDeliveryList = (params) =>
  http.get("/future/queryContractDeliveryList", { params }); // 查询合约交割历史
export const queryFcOrders = (params) =>
  http.get("/future/queryFcOrders", { params }); // 历史强平查询
export const queryFlOrders = (params) =>
  http.get("/future/queryFlOrders", { params }); // 历史强减查询
export const queryHisOrder = (params) =>
  http.get("/future/queryHisOrder", { params }); // 历史委托查询
export const queryHisMatch = (params) =>
  http.get("/future/queryHisMatch", { params }); // 成交明细查询
export const queryMarginInfo = () => http.get("/future/queryAvail"); // 获取可用保证金列表
export const queryVarietyMarginAll = (params) =>
  http.get("/future/queryVarietyMarginAll", params); // 全量查询合约保证金梯度
export const queryUserLendingAssetSummary = (params) =>
  http.get("/lending/asset/queryUserLendingAssetSummary", params); // 查询用户配资资产详情

export const getFavorite = () => http.get("/future/queryFavoriteList"); // 收藏列表
export const deleteFavorite = (params) =>
  http.delete("/future/deleteFavorite", { data: params }); // 删除收藏
export const addFavorite = (params) => http.post("/future/addFavorite", params); // 添加收藏
export const addFavorites = (params) =>
  http.post("/future/addFavorites", { params }); // 批量收藏
export const queryMatchByOrderId = (params) =>
  http.get("/future/queryMatchByOrderId", { params }); // 通过委托ID查成交

export const queryRiskFundsList = (params) =>
  http.get("/future/queryRiskFundsList", { params }); // 风险基金查询
export const queryOrderByOrderId = (params) =>
  http.get("/future/queryOrderByOrderId", { params }); // 查询单个委托
export const adjustModel = (params) =>
  http.post("/future/position/adjustModel", params.params, {
    headers: params.headers,
  }); // 调整持仓模式
export const posiReverse = (params) =>
  http.post("/future/posiReverse", params.params, {
    headers: params.headers,
  }); // 持仓反手
export const cleanAll = (params) =>
  http.get("/future/cleanAll",{
    headers: params.headers,
    params: params.params,
  }); // 全平全撤
export const queryInviteCode = (params) =>
  http.get("/users/invite/queryCode", params); // 获取我的邀请码

export const queryAllContract = () => http.get("/future/queryAllContract"); // 查询所有合约（包含下架合约）
