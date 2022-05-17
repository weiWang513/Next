import http from "../http";

export const getBannerList = (params) =>
  http.get("/common/banner/list", { params: params }); // 获取banner列表

export const getArticlesList = (params) =>
  http.get("/common/helpcenter/articlesList", { params: params }); // 获取公告列表

export const queryBrokerDockingInfo = (params) =>
  http.get("/broker/docking/queryBrokerDockingInfo", { params }); // 查询B端对接定制化信息
export const minTransferOut = (params) =>
  http.get("/futureAsset/minTransferOut", { params }); // 查询钱包最小转出数量
export const futureQueryAvail = (params) =>
  http.get("/futureAsset/queryAvailable", { params }); // 获取期货可用资金查询

export const futureAssetTransfer = (params) =>
  http.post("/futureAsset/transfer", params.params, {
    headers: params.headers,
  }); // 我的钱包转合约(合约转我的钱包)

export const futureAssetCheck = (params) =>
  http.get("/futureAsset/check", { params }); // (合约转我的钱包)/查询内部转账状态(合约转现货)
export const listVerifyImg = (params) =>
  http.get("/common/verify/listVerifyImg", { params });
export const checkCnIp = (params) =>
  http.get("/common/ip/checkCnIp", { params });
export const queryVersion = (params) =>
  http.get("/common/app/queryVersion", { params }); // 查询版本信息
export const lendingForbidWithdraw = params =>
  http.get("/futureAsset/lendingForbidWithdraw", { params }); // 查询用户当前禁止出金数量
/**
 * @获取弹框信息
 * @param type 默认是0,0代表PC， 1代表安卓，2代表ios，3代表H5
 * @param locale
 * @returns
 */
export const getModalAlert = (params) =>
  http.get("/common/jump/query", { params: params });
