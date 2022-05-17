import http from '../http'

export const queryAllOtcCurrencyList = () => http.get('/otc/queryAllOtcCurrencyList') // 获取otc 币种列表
export const buyPlaceOrder = params => http.post('/otc/buyPlaceOrder', params.params, { headers: params.headers }) // 买入，充值
export const buy = params => http.post('/otc/buy', params.params, { headers: params.headers }) // 买入，充值