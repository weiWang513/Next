declare type STATUS = "idle" | "pending" | "succeeded" | "failed";

// 现货交易对
// DOC: DOC: https://yapi.dsnkm.com/project/13/interface/api/7187
declare type SpotTradePair = {
  id: number;
  // 商品ID
  commodityId: number;
  // 商品币名称
  commodityName: string;
  // 交易对状态
  status: number;
  // 货币id
  currencyId: number;
  // 货币名称
  currencyName: string;
  // 类型
  currencyType: number;
  // 最新价格
  lastPrice: string;
  // 最小交易单位
  lotSize: string;
  // maker 手续费率
  makerFeeRatio: string;
  // 涨跌幅
  priceChangeRadio: string;
  // 最小报价单位
  priceTick: string;
  // 名称
  symbol: string;
  // tarker 手续费率
  takerFeeRatio: string;
  // 交易量
  totalVolume: string;
};

// 现货行情
// DOC: https://yapi.dsnkm.com/project/13/interface/api/494
declare type SpotSnapshot = {
  // 现货ID
  spotId: number;
  // 现货symbol
  symbol: string;
  // 最新价格
  lastPrice: string;
  // 最高价
  priceHigh: string;
  // 最低价
  priceLow: string;
  // 当日成交额
  totalTurnover: string;
  // 当日成交量
  totalVolume: string;
  // 当日涨跌幅度
  priceChangeRadio: string;
  // 当日涨跌
  priceChange: string;
};

// 币种的U价格
declare type Coin = {
  // 币id
  currencyId: number;
  // 最新价格（USD价格）
  latest: string;
};

// 兑换汇率
declare type Exchange = {
  id: number;
  // 法币名称
  name: string;
  // 费率（USD汇率）
  rate: number;
  // 更新时间（13位时间戳）
  updateTime: number;
};

// 法币符号
declare type FiatSymbol = {
  // 法币名称，如： USD\EUR\JPY
  id: string;
  // 法币符号，如： $、€、¥
  symbol: string;
};

type Language = {
  id: string;
  value: string;
};

// 币种信息(现货)
declare type CoinInfo = {
  // 市值排名
  rank?: number;
  // 市值
  marketCap?: number;
  // 流通量
  circulatingSupply?: number;
  // 最大供给量
  maxSupply?: number;
  // 总量
  totalSupply?: number;
  // 发行日期
  issueDate?: number;
  // 发行价格
  issuePrice?: number;
  desc?: string;
};
