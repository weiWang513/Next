import { toFix6 } from '../../../../utils/filters'
const Big = require('big.js')

export const entrustValue = (posiQty, openPrice, contractSide, contractUnit) => {
  if (!Number(posiQty) || !Number(openPrice)) return '0'
  let data = '0'
  data =
    contractSide === 1
      ? new Big(posiQty).times(contractUnit).times(openPrice).toString()
      : new Big(posiQty).times(contractUnit).div(openPrice).toString()

  return data
}

export const calcClosePrice = (profitRatio, openPrice, lever, contractSide, tradeSide) => {
  if (!Number(profitRatio) || !Number(openPrice) || !Number(lever)) return '--'

  let data = '--'

  data =
    contractSide === 1
      ? new Big(openPrice).plus(new Big(profitRatio).div(100).times(openPrice).div(tradeSide).div(lever)).toString()
      : //（  盈利率 / 杠杆倍数*开仓方向 + 1 ）* 开仓价格
        new Big(profitRatio).div(100).div(lever).times(tradeSide).plus(1).times(openPrice).toString()

  return toFix6(data)
}
