


const TIMES_TAMP = 60 * 1000
const BASE_URL = 'https://api.itick.org'
export default class Request {
  token
  resolutionsMap = {
    1: TIMES_TAMP,
    2: 5 * TIMES_TAMP,
    3: 10 * TIMES_TAMP,
    4: 30 * TIMES_TAMP,
    5: 60 * TIMES_TAMP,
    6: 120 * TIMES_TAMP,
    7: 240 * TIMES_TAMP,
    8: 24 * 60 * TIMES_TAMP,
    9: 7 * 24 * 60 * TIMES_TAMP,
    10: 30 * 24 * 60 * TIMES_TAMP
  }
  constructor(token) {
    this.token = token
  }
  getKline (symbolType, region, symbol, resolution) {
    return new Promise((resolve, reject) => {
      fetch(`${BASE_URL}/${symbolType}/kline?region=${region}&code=${symbol}&kType=${resolution}`, { headers: { token: this.token } })
        .then(res => res.json())
        .then((res) => {
          const { code, data } = res
          if (code === 0) {
            const bars = [];
            const meta = { noData: false }
            for (const { t, c, o, h, l, v } of data) bars.push({ time: t, close: c, open: o, high: h, low: l, volume: v })
            // 300条以下不显示的问题
            if (bars.length) while (bars.length < 301) bars.unshift({ time: bars[0].time - this.resolutionsMap[resolution], close: bars[0].close, open: bars[0].close, high: bars[0].close, low: bars[0].close, volume: 0 })
            resolve({ bars, meta })
          }
          else reject(res.msg)
        })
        .catch(err => reject(err));
    });
  }

  getSymbolList (params) {
    let url = `${BASE_URL}/symbol/list?`
    for (const val in params) url += `${val}=${params[val]}&`
    url = url.slice(0, -1)
    return new Promise((resolve, reject) => {
      fetch(url, { headers: { token: this.token } })
        .then(res => res.json())
        .then(res => {
          const { code, data } = res
          if (code === 200) resolve(data)
          else reject('查询失败')
        })
    });
  }
  getSymbolInfo (symbolName) {
    const [exchange, symbol] = symbolName.split(':')
    return new Promise((resolve, reject) => {
      fetch(`${BASE_URL}/symbol/info?code=${symbol}&exchange=${exchange === 'BINANCE' ? 'Binance' : exchange}`, { headers: { token: this.token } })
        .then(res => res.json())
        .then(res => {
          const { code, data } = res
          if (code === 200) resolve(data)
          else reject('查询失败')
        })
    });
  }
}