import http from "../http";

export const lockedProduct = () => http.get("/fm/lockedProduct"); // 定期理财-理财产品列表

export const statistics = () => http.get("/fm/lockedProduct/statistics"); // 定期理财-用户总资产及收益

export const subscribe = (params) =>
  http.post("/fm/lockedProduct/subscribe", params.params, { headers: params.headers }); // 定期理财-申购