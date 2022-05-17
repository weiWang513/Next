/**
 * 解析现货交易对列表
 * @param list
 */
export function parseSpotTradePairList(
  list: Array<any> = [],
  filter?: boolean
): Array<SpotTradePair> {
  // DOC: https://yapi.dsnkm.com/project/13/interface/api/7187
  const result = [];
  list.map((item: any) => {
    const {
      commodityId,
      commodityName,
      // 重定义字段名
      contractId: id,
      // 重定义字段名
      contractStatus: status,
      currencyId,
      currencyName,
      currencyType,
      lastPrice,
      lotSize,
      makerFeeRatio,
      priceChangeRadio,
      priceTick,
      symbol,
      takerFeeRatio,
      totalVolume
    } = item;

    // 现货交易对状态如果是摘牌，前端交易对选择处不展示
    if (!filter && status === 4) return;

    // filter contractid<26
    if (filter && id < 26) return;

    result.push({
      // item中还包含了contractId，这个已经重定义，但是可能存在一些地方引用了，后期需要确认之后删除
      ...item,
      commodityId,
      commodityName,
      id,
      status,
      currencyId,
      currencyName,
      currencyType,
      lastPrice,
      lotSize,
      makerFeeRatio,
      priceChangeRadio,
      priceTick,
      symbol,
      takerFeeRatio,
      totalVolume
    });
  });
  return result;
}
