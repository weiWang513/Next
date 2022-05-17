// 加
function floatAdd(arg1, arg2) {
  if (arg1 === undefined || arg2 === undefined) {
    return 0
  } else {
    let r1, r2, m
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    return (arg1 * m + arg2 * m) / m
  }
}

// 减
function floatSub(arg1, arg2) {
  if (arg1 === undefined || arg2 === undefined) {
    return 0
  } else {
    let r1, r2, m, n
    try {
      r1 = arg1.toString().split('.')[1].length
    } catch (e) {
      r1 = 0
    }
    try {
      r2 = arg2.toString().split('.')[1].length
    } catch (e) {
      r2 = 0
    }
    m = Math.pow(10, Math.max(r1, r2))
    // 动态控制精度长度
    n = r1 >= r2 ? r1 : r2
    return ((arg1 * m - arg2 * m) / m).toFixed(n)
  }
}

// 乘
function floatMul(arg1, arg2) {
  if (arg1 === undefined || arg2 === undefined) {
    return 0
  } else {
    let m = 0
    let s1 = arg1.toString()
    let s2 = arg2.toString()
    try {
      m += s1.split('.')[1].length
    } catch (e) {}
    try {
      m += s2.split('.')[1].length
    } catch (e) {}
    return (
      (Number(s1.replace('.', '')) * Number(s2.replace('.', ''))) /
      Math.pow(10, m)
    )
  }
}

// 除
function floatDiv(arg1, arg2) {
  if (arg1 === undefined || arg2 === undefined) {
    return 0
  } else {
    if (arg2 === 0) {
      return 0
    } else {
      let t1 = 0
      let t2 = 0
      let r1
      let r2
      try {
        t1 = arg1.toString().split('.')[1].length
      } catch (e) {}
      try {
        t2 = arg2.toString().split('.')[1].length
      } catch (e) {}

      r1 = Number(arg1.toString().replace('.', ''))

      r2 = Number(arg2.toString().replace('.', ''))
      return (r1 / r2) * Math.pow(10, t2 - t1)
    }
  }
}

// 获取float小数
function getFloat(num, index) {
  return parseFloat(num).toFixed(index)
}
// 保留n位小数
function subStringNum(a, num) {
  let aType = typeof a
  let aArr
  let aStr
  if (aType === 'number') {
    aStr = a.toString()
    aArr = aStr.split('.')
  } else if (aType === 'string') {
    aArr = a.split('.')
  }

  if (aArr.length > 1) {
    a = aArr[0] + '.' + aArr[1].substr(0, num)
  }
  return a
}

// 数组累加求和
function arraySum(arr) {
  let s = 0
  for (let i = arr.length - 1; i >= 0; i--) {
    s = floatAdd(s, arr[i])
  }
  return s
}

// 深度累加量
function depthSum(bidsNew) {
  let temp = []
  bidsNew.forEach(el => {
    temp.push(el[1])
  })
  for (let i = 0; i < temp.length; i++) {
    bidsNew[i].push(arraySum(temp.slice(0, i + 1)))
  }
  return bidsNew
}

// 将小数变成百分比
function toRateFilter(value) {
  if (!value) return
  if (Number(value) > 0) {
    value = parseFloat(value * 100).toFixed(2) + ''
  } else if (Number(value) < 0) {
    value = parseFloat(value * 100).toFixed(2) + ''
  }
  return value
}

// 保留两位有效数字
function toPrecision2(val) {
  if (!val) return
  let arr = val.toString().split('.')
  if (arr.length === 1) {
    val = arr.join()
  } else {
    let numStr = parseFloat('0.' + arr[1])
      .toPrecision(2)
      .toString()
    val = arr[0] + '.' + numStr.split('.')[1]
  }
  return val
}

function saveSix(n) {
  return Number(n).toFixed(6)
}
// 处理科学技术转成小数
function toNonExponential(num) {
  let m = num.toExponential().match(/\d(?:\.(\d*))?e([+-]\d+)/)
  return num.toFixed(Math.max(0, (m[1] || '').length - m[2]))
}

// 时间戳格式化
function timestampToTime(timestamp) {
  let date = new Date(timestamp / 1000)
  let YYYY = date.getFullYear() + '-'
  let MM =
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) + '-'
  let DD = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
  let hh =
    (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
  let mm =
    (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
  let ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  return YYYY + MM + DD + hh + mm + ss
}
// 订单深度
function addProperty(v) {
  v.forEach((item, index) => {
    if (index) {
      item[2] = Number(item[1]) + Number(v[index - 1][2])
    } else {
      item[2] = Number(item[1])
    }
  })
}

// tv
function createChannelString(symbolInfo) {
  let channel = symbolInfo.name.split(/[:/]/)
  // const exchange = channel[0] === 'GDAX' ? 'Coinbase' : channel[0]
  const to = channel[1]
  const from = channel[0]
  // subscribe to the CryptoCompare trade channel for the pair and exchange
  return `${from}${to}`
}

function updateBar(data, sub) {
  var lastBar = sub.lastBar
  let resolution = sub.resolution
  if (resolution.includes('D')) {
    // 1 day in minutes === 1440
    resolution = 1440
  } else if (resolution.includes('W')) {
    // 1 week in minutes === 10080
    resolution = 10080
  }
  var coeff = resolution * 60
  // console.log({coeff})
  var rounded = Math.floor(data[0] / coeff) * coeff
  var lastBarSec = lastBar.time / 1000
  var _lastBar
  if (rounded > lastBarSec) {
    // create a new candle, use last close as open **PERSONAL CHOICE**
    _lastBar = {
      time: Number(data[0]), // TradingView requires bar time in ms
      low: Number(data[3]),
      high: Number(data[2]),
      open: Number(data[1]),
      close: Number(data[4]),
      volume: Number(data[5])
    }
  } else {
    // update lastBar candle!
    if (data[3] < lastBar.low) {
      lastBar.low = data[3]
    } else if (data[2] > lastBar.high) {
      lastBar.high = data[2]
    }

    lastBar.volume += Number(data[5])
    lastBar.close = data[4]
    _lastBar = lastBar
  }
  return _lastBar
}

function trimStr(str) {
  if (!str) return null
  return str.replace(/(^\s*)|(\s*$)/g, '')
}

export {
  floatAdd,
  floatSub,
  floatMul,
  floatDiv,
  getFloat,
  subStringNum,
  arraySum,
  depthSum,
  toRateFilter,
  toPrecision2,
  timestampToTime,
  saveSix,
  createChannelString,
  addProperty,
  trimStr,
  updateBar,
  toNonExponential
}
