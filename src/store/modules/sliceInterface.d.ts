export interface contractInitialState {
  contractList: {
    symbol?: string;
    contractId?: number;
    contractSide?: number;
    priceTick?: number;
    contractUnit?: number;
    currencyName?: number;
    commodityName?: number;
  }[];
  contractBasicList: {
    symbol?: string;
    contractId?: number;
    contractSide?: number;
    priceTick?: number;
    contractUnit?: number;
    currencyName?: number;
    commodityName?: number;
  }[];
  allContractList: {
    symbol?: string;
    contractId?: number;
    contractSide?: number;
    priceTick?: number;
    contractUnit?: number;
    currencyName?: number;
    commodityName?: number;
  }[];
  coinList: [];
  exchangeList: [];
  indictorList: {
    contractId: number;
    result: {
      contractId: number;
      symbol: string;
      priceChangeRadio: number;
    };
  }[];
  currencyList: [];
  snapshot: {
    contractId?: number;
    lastPrice?: number;
    clearPrice?: number;
    indexPrice?: number;
    fundingRate?: number;
    priceChange?: number;
    totalVolume?: number;
    totalTurnover?: number;
    priceHigh?: number;
    priceLow?: number;
    posiVol?: number;
    priceChangeRadio?: number;
    usdt24turnover?: number;
    commodity24turnover?: number;
  };
  contractId: number;
  contractItem: {
    priceTick?: number;
    symbol?: String;
    lotSize?: String;
    contractType?: number;
    deliveryTime?: number;
    perpetualSettleFrequency?: number;
    contractSide?: number;
    contractId?: number;
    commodityName?: string;
    contractUnit?: number;
    currencyId?: number;
    currencyName?: string;
    takerFeeRatio?: any;
    makerFeeRatio?: any;
    minMaintainRate?: any;
    commodityId?: number;
  };
  favoritesListShow: boolean;
  orderConfirm: boolean;
  favoritesList: number[];
  varietyMarginAll: {};
  futureLastestTickPrice: {};
  futureTick: {}[];
  hideOther: boolean;
  futureKline: [];
  resolution: string;
  _subs: any; // kline推送
  chartFull: boolean;
  tickToKline: any;
  notice: {
    title?: string;
    data?: string;
    contractId?: number;
    type?: number;
    time?: number;
  };
  contractListShow: boolean;
}

export interface assetsInitialState {
  posListProps: {
    quantity?: number;
    symbol?: string;
    side?: number;
    clearPrice?: number;
    contractId?: number;
    absQuantity?: number;
    curMargin?: number;
    unrealizedProfitLoss?: number;
    unrealizedProfitLossS?: number;
    returnRate?: number;
    initMarginRate?: number;
    marginType?: number;
    fairQty?: number;
  }[];
  curDelegateInfo: {
    // 当前委托信息
    list: {
      contractId?;
      side?;
      orderStatus?;
      positionEffect?;
      orderId?;
    }[]; // 当前委托列表
    curList: []; //  当前合约的当前委托列表
    OpenOrders: [];
    conOrders: [];
  };
  accountList: {
    available?: number;
    marginBalance?: number;
    currencyId?: number;
    posiMode?: number;
  }[];
  accountListTemp: [];
  accountListLastId: number;
  available: number;
  marginAvail: number;
  updateHoldPosi: boolean;
  energyList: {
    contractId?: number;
    rank?: number;
  }[];
  conditionOrders: {
    conditionOrderId?: number;
  }[];
  condiRestfulTimes: number;
  condiOrderUuid: number;
  conditionResf: boolean;
  posiReverseQty: number | string;
  posiReversePriceType: number;
  posiReversePrice: number | string;
}

export interface placeInitialState {
  price?: string;
  count?: string;
  stopPrice?: string;
  stopPriceType?: number;
  side?: number;
  priceType?: number;
  priceTypeTab?: number;
  modeType?: number;
  lever?: number;
  maxLever?: number;
  leverTypes?: number[];
  stopType?: number;
  qtyBuy?: number;
  qtySell?: number;
  commissionValueBuy?: number;
  commissionValueSell?: number;
  costBuy?: number;
  costSell?: number;
  crossLever?: number;
  allInQuantityBuy?: number;
  allInQuantitySell?: number;
  allInValueBuy?: number;
  allInValueSell?: number;
  setSP?: boolean;
  setSL?: boolean;
  profitInput?: string;
  lossInput?: string;
  profitStopType?: number;
  lossStopType?: number;
  Passive?: boolean;
  closeFlag?: boolean;
  countType?: number;
  positionEffect?: number;
  percent?: number;
  posiMode: number;
}

export interface spotInitialState {
  // 现货交易对
  spotList: Array<SpotTradePair>;
  allSpotList: Array<SpotTradePair>;
  currentSpot: SpotTradePair | Object;
  coinList: Coin[];
  exchangeList: Exchange[];
  spotId: number;
  snapshot: SpotSnapshot;
  // 上一次的行情，可用于比较lastPrice的涨跌
  prevSnapshot: SpotSnapshot;
  visibleSpotList: boolean;
  orderBook: {
    deepthIndex: number;
    bidsAsks: {
      bids?: [];
      asks?: [];
      bidsMax: number;
      asksMax: number;
    };
    bidsAsksOrigin: {
      contractId?: number;
      bids?: [][];
      asks?: [][];
      lp?: "0";
      cp?: "0";
      lip?: "0";
    };
    preBidsAsksOrigin: {
      contractId?: number;
      bids?: [][];
      asks?: [][];
      lp?: "0";
      cp?: "0";
      lip?: "0";
    };
    bidsAsksForDepth: {
      contractId?: number;
      bids?: [][];
      asks?: [][];
    };
    entrustControlType: number;
  };

  favoritesList: number[];
  orderConfirm: boolean;

  accountList: {
    available?: number;
    marginBalance?: number;
    currencyId?: number;
    posiMode?: number;
  }[];
  indictorList: {
    contractId: number;
    result: {
      contractId: number;
      symbol: string;
      priceChangeRadio: number;
    };
  }[];
  currencyList: any[];

  futureLastestTickPrice: any;
  futureTick: any[];
  futureKline: any[];

  hideOther: boolean;
  resolution: string;
  _subs: any;
  chartFull: boolean;
  tickToKline: {
    lines: any;
  };
  curOrder: any[];
  orderPrice: string;
  orderQty: string;
}
