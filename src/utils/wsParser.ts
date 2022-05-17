/**
 * 现货列表
 */
export function parseSpotList(list: any[]) {
  // DOC: https://yapi.dsnkm.com/project/13/interface/api/494
  // 只取了部分字段，其它字段后面按需添加
  return list.map((item: any) => {
    return {
      id: item.ci,
      // 交易对状态
      status: item.cs,
      // 最新价格
      lastPrice: item.lp,
      // 涨跌幅
      priceChangeRadio: item.pcr,
      // 交易量
      totalVolume: item.tv
      // 其它字段暂不需要处理
    };
  });
}

/**
 * 行情现货
 */
export function parseSnapshot(item: any): SpotSnapshot {
  // DOC: https://yapi.dsnkm.com/project/13/interface/api/494
  // 只取了部分字段，其它字段后面按需添加
  return {
    // 现货ID
    spotId: item?.ci,
    // 现货symbol
    symbol: item?.sb,
    // 最新价格
    lastPrice: item?.lp,
    // 最高价
    priceHigh: item?.ph,
    // 最低价
    priceLow: item?.pl,
    // 当日成交额
    totalTurnover: item?.tt,
    // 当日成交量
    totalVolume: item?.tv,
    // 当日涨跌幅度
    priceChangeRadio: item?.pcr,
    // 当日涨跌
    priceChange: item?.pc
  };
}
