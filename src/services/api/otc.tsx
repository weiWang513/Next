import http from "../http";

// 平台支持的币种列表
export const getCreditCurrency = () => http.get("/credit/card/common/currency");

// 平台支持的法币列表
export const getCreditFiatCurrency = () => http.get("/credit/card/common/fiatCurrency");

// 服务商列表
export const getServiceProvider = () => http.get("/credit/card/common/serviceProvider");

// 合约列表
export function queryCommonData() {
  return http.get("/future/queryCommonData");
}

// 默认估价（固定值询价）
export function evaluate(params) {
  return http.get("/credit/card/purchase/evaluate", { params });
}

// 询价
export function quote(params) {
  return http.post("/credit/card/purchase/quote", params.params, {
    headers: params.headers
  });
}

// 确认订单发起支付
export function payment(params) {
  return http.post("/credit/card/purchase/payment", params.params, {
    headers: params.headers
  });
}

// tradeType === 1 询价
export function queryPrice(params) {
  return http.get("/otc/queryPrice", { params });
}
