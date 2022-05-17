export const futureSnapshotIndicator = (v) => {
  // 行情快照
  let data = {
    contractId: v.ci,
    result: {
      messageType: v.mt,
      applId: v.ai,
      contractId: v.ci,
      symbol: v.sb,
      tradeDate: v.td,
      time: v.te,
      lastPrice: v.lp,
      matchQty: v.mq,
      numTrades: v.nt,
      openPrice: v.op,
      priceHigh: v.ph,
      priceLow: v.pl,
      historyPriceHigh: v.hph,
      historyPriceLow: v.hpl,
      totalTurnover: v.tt,
      totalVolume: v.tv,
      totalBidVol: v.tbv,
      totalAskVol: v.tav,
      prevPrice: v.pp,
      clearPrice: v.cp,
      posiVol: v.pv,
      priceChangeRadio: v.pcr24,
      priceChange: v.pc24,
      lastUpdateId: v.lui,
      contractStatus: v.cs,
      deliveryPrice: v.dp,
      fundingRate: v.fr,
      predictionFundingRate: v.pfr,
      premiumIndex: v.pi,
      predictionPremiumIndex: v.ppi,
      fairBasis: v.fb,
      tradingsignal: v.ts,
      indexPrice: v.ip,
      signalLevel: v.sl,
      buyPrice: v.obp,
      sellPrice: v.osp,
      usdt24turnover: v.u24t,
      commodity24turnover: v.c24t
    }
  };
  return data;
};
