import Request from './request.js'
import SingletonSocket from './SingletonSocket.js'
export default class UDFCompatibleDatafeed {
  token = ''
  symbolInfo = {}
  configuration
  request
  lastBar
  constructor(token) {
    this.token = token
    this.request = new Request(token)
    this.configuration = this.defaultConfiguration();
  }
  onReady (callback) {
    setTimeout(() => {
      callback(this.configuration)
    }, 0);
  }
  // 搜索产品
  async searchSymbols (userInput, exchange, symbolType, onResult) {
    const [type, region] = symbolType.split('_')
    const params = {
      ...(userInput ? { code: userInput } : {}),
      ...(type ? { type } : {}),
      ...(region ? { region } : {})
    }
    const data = await this.request.getSymbolList(params)
    const res = data.slice(0, 50)
    const result = []
    for (const item of res) {
      result.push({
        symbol: item.c,
        exchange: item.e,
        description: item.n,
        type: item.t,
        ticker: `${item.e}:${item.c}`
      })
    }
    onResult(result)
  }
  // 获取产品信息
  async resolveSymbol (symbolName, onResolve, onError) {
    const [exchange, symbol] = symbolName.split(':')
    if (this.symbolInfo[symbolName]) {
      const timer = setTimeout(() => {
        onResolve(this.symbolInfo[symbolName])
        clearTimeout(timer)
      }, 0);
      return
    }
    const result = await this.request.getSymbolInfo(symbolName)
    if (!result) {
      onError('查找不到产品')
      return
    }
    // 配置产品参数
    const data = {
      name: result.n,
      region: result.r,
      timezone: result.tz,
      exchange: result.e,
      type: result.t,
      subsessions: result.sb,
      session: result.sb.find(v => v.id === result.si).session,
      minmov: result.m,
      subsession_id: result.si,
      description: result.b ?? result.d,
      format: 'price',
      visible_plots_set: "ohlcv",
      variable_tick_size: '',
      listed_exchange: exchange,
      pricescale: 100,
      full_name: symbolName,
      pro_name: symbolName,
      base_name: [
        symbolName
      ],
      ticker: symbolName,
      supported_resolutions: this.configuration.supported_resolutions,
      has_daily: true,
      has_intraday: true,
      daily_multipliers: ["1"],
      has_weekly_and_monthly: !0,
      weekly_multipliers: ["1"],
      monthly_multipliers: ["1", "12"],
      intraday_multipliers: ["1", "5", "10", "30", "60"],
      data_status: 'streaming'
    }
    this.symbolInfo[symbolName] = data
    onResolve(data)
  }
  // 获取K线数据
  async getBars (symbolInfo, resolution, periodParams, onResult, onError) {
    const { name, type, region } = symbolInfo
    const { countBack, firstDataRequest, from, to } = periodParams
    try {
      const params = {
        symbolType: type,
        region: this.getSymbolRegion(type, region),
        symbol: name,
        et: to * 1000,
        limit: countBack,
        resolution: this.getResolution(resolution)
      }
      const data = await this.request.getKline(params)
      if (firstDataRequest) this.lastBar = data.bars[data.bars.length - 1]
      onResult(data.bars, data.meta)
    } catch (err) {
      onResult([], { noData: true })
    }
  }
  getSymbolRegion (type, region) {
    if (type === 'crypto') return 'BA'
    if (type === 'stock') return region || ''
    return 'gb'
  }
  getResolution (resolutions) {
    const resolutionsMap = { '1': 1, '5': 2, '10': 3, '30': 4, '60': 5, '120': 6, '240': 7, '1D': 8, '1W': 9, '1M': 10 }
    return resolutionsMap[resolutions]
  }
  unsubscribeBars () { }

  subscribeBars (symbolInfo, resolution, onRealtimeCallback, listenerGuid, onResetCacheNeededCallback) {
    const { region, type, name } = symbolInfo
    const socket = SingletonSocket.getInstance(this.token)
    socket.connect(type, name, region, resolution, this.lastBar)
    socket.onMessage(data => {
      if (data) onRealtimeCallback(data)
    })
  }
  /**
   * 默认参数
   * @returns 
   */
  defaultConfiguration () {
    return {
      supported_resolutions: ["1", "5", "10", "30", "60", "1D", "1W", "1M"],
      supports_marks: false,
      supports_timescale_marks: false,
      supports_time: false,
      symbols_types: [
        { name: '全部', value: "" },
        { name: '加密货币', value: "crypto" },
        { name: 'SH股', value: "stock_sh" },
        { name: 'SZ股', value: "stock_sz" },
        { name: '港股', value: "stock_hk" },
        { name: 'SG股', value: "stock_sg" },
        { name: '美股', value: "stock_us" },
        { name: '日股', value: "stock_jp" },
        { name: '外汇', value: "forex" },
        { name: '指数', value: "indices" }
      ],
    };
  }
}
