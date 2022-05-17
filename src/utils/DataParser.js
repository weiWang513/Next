// import { getRiseColor, getFallColor } from '../contants/contants'
import { toFix6 } from './filters'
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
      priceChangeRadio: v.pcr,
      priceChange: v.pc,
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
    },
  }
  return data
}

export const futureSnapshotBidAsk = (v) => {
  // console.log(v, 'vvvvvvvvvvvvs')
  if (v) {
    return {
      contractId: v.ci,
      asks: v.asks,
      bids: v.bids,
    }
  }
}

export const loadBase64Image = (url) => {
  return new Promise((RES, REJ) => {
    fetch(url)
      .then((r) => r.blob())
      .then((blob) => {
        const reader = new FileReader()
        reader.onload = (e) => {
          const data = e.target.result
          RES(data.split('base64,')[1])
        }
        reader.readAsDataURL(blob)
      })
      .catch(REJ)
  })
}
/**
 * 行情合约列表融合
 * @param {合约列表} contractList
 * @param {行情列表} futureAllIndicator
 * @param {汇率列表} exchanges
 * @param {} currency
 */
export const futureAllIndicatorToMarketList = (
  contractList,
  futureAllIndicator,
  exchanges,
  currency,
  coin_priceState
) => {
  let result = []
  let exchange = exchanges.find((el) => el.name === currency) || { rate: 1 }
  result = contractList.map((contratItem) => {
    let _latest =
      contratItem.contractSide === 1
        ? coin_priceState.find((el) => el.currencyId === contratItem.currencyId)
          ? coin_priceState.find((el) => el.currencyId === contratItem.currencyId).latest
          : 0
        : coin_priceState.find((el) => el.currencyId === contratItem.commodityId)
        ? coin_priceState.find((el) => el.currencyId === contratItem.commodityId).latest
        : 0
    const _item = { ...contratItem }
    futureAllIndicator.forEach((newItem) => {
      if (contratItem.contractId === newItem.contractId) {
        _item['clearPrice'] = newItem.result.clearPrice
        _item['posiVol'] = newItem.result.posiVol
        _item['fundingRate'] = newItem.result.fundingRate
        _item['indexPrice'] = newItem.result.indexPrice
        _item['lastPrice'] = newItem.result.lastPrice
        _item['totalVolume'] = newItem.result.totalVolume
        _item['priceChangeRadio'] = newItem.result.priceChangeRadio
        _item['transferValue'] = toFix6(newItem.result.lastPrice * parseFloat(_latest) * exchange.rate)
      }
    })
    return _item
  })
  return result
}

// export const coinPriceToMarketList = (oldData, newData, exchanges, currency) => {
//   let result = []
//   let exchange = exchanges.find((el) => el.name === currency) || { rate: 1 }
//   // oldData.map(oldItem => {
//   //   newData.map(newItem => {
//   //     if ((oldItem.contractSide===1 && oldItem.currencyId === newItem.currencyId) || (oldItem.contractSide===2 && oldItem.commodityId === newItem.currencyId)) {
//   //       // console.log(newItem, oldItem.symbol, oldItem.lastPrice, newItem.latest, oldItem.exchangeRate, 'wangwei-----oldItem.lastPrice')
//   //       let data = oldItem;
//   //       data["coinLatest"] = newItem.latest;
//   //       data["transferValue"] =
//   //         Math.floor(
//   //           oldItem.lastPrice *
//   //             parseFloat(newItem.latest) *
//   //             oldItem.exchangeRate
//   //         )
//   //       // console.log(data, 'wangwei-------data----coinPriceToMarketList-------')
//   //       result.push(data);
//   //     }
//   //   });
//   // });
//   oldData.forEach((el) => {
//     let newItem = newData.find((item) => {
//       if (el.contractSide === 1 && el.currencyId !== 999999) {
//         return el.currencyId === item.currencyId
//       } else if (el.contractSide === 2) {
//         return el.commodityId === item.currencyId
//       } else if (el.contractSide === 1 && el.currencyId === 999999) {
//         return 7 === item.currencyId
//       } else {
//         return false
//       }
//     })
//     if (newItem) {
//       el['coinLatest'] = newItem.latest
//       el['transferValue'] = toFix6(el.lastPrice * parseFloat(newItem.latest) * exchange.rate)
//       result.push(el)
//     }
//   })
//   return result
// }

export const getPercentFromString = (str) => {
  let result =
    Math.floor(parseFloat(str) * 10000) / 100 < 0
      ? Math.floor(parseFloat(str) * 10000) / 100
      : `+${Math.floor(parseFloat(str) * 10000) / 100}`
  if (isNaN(result)) {
    return `0.00%`
  }
  return `${result}%`
}

// export const showColor = (factor, riseColor) => {
//   let result = parseFloat(factor) > 0 ? getRiseColor(riseColor) : getFallColor(riseColor)
//   return result
// }

// export const addFavorateStatusToContract = (favorateArray,target) => {
//   let resultArray = this.props.market_listState;
//   let favorateItems = [];
//   favorateArray.map(id => {
//     resultArray.map(item => {
//       let resultDic = item;
//       if (item.contractId === id) {
//         resultDic["isFavorate"] = true;
//         favorateItems.push(item);
//       }
//     });
//   });
//   target.setState({ favorates: favorateItems });
//   return resultArray;
// };
