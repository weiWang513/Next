import http from "../http";

export const tradingVolume = () =>
  http.get("/futureQuot/statistical/tradingVolume"); // 首页获取交易量

export const tradingData = () =>
  http.get("/futureQuot/statistical/tradingData"); // 90天价格

export const queryCandlesticks = (params) =>
  http.get("/futureQuot/queryCandlesticks", { params }); // 查询多个合约k线
