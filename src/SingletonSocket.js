


const TYPE_MAP = {
  'crypto': 'cws',
  'stock': 'sws',
  'forex': 'fws',
  'indices': 'iws'
}
const BASE_URL = 'wss://api.itick.org'

class SingletonSocket {
  static instance = null
  token = ''
  resolution = '1'
  socket = null
  type = ''
  symbol = ''
  region = ''
  reconnectMaxTimes = 10  //最大重连次数
  reconnectInterval = 5000 // 5秒重连间隔
  heartbeatInterval = 30000 // 30秒心跳间隔
  reconnectTimes = 0 // 重连次数
  heartbeatTimer = null
  onmessage = null
  dataMap = new Map()
  lastBar = null //上一根K线

  constructor(token) {
    this.token = token
  }
  static getInstance (token) {
    if (!SingletonSocket.instance) {
      SingletonSocket.instance = new SingletonSocket(token)
    }
    return SingletonSocket.instance;
  }
  // 连接
  connect (type, symbol, region, resolution, lastBar) {
    this.resolution = resolution
    this.region = region
    this.lastBar = lastBar
    this.dataMap.clear()
    // 订阅小时、天周期不需要连接webSocket
    const flag = ['1', '5', '10', '30'].includes(resolution)
    if (!flag) {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) this.close()
      return
    }
    // 订阅相同symbol不需要重连webSocket
    if (this.symbol === symbol && this.socket && this.socket.readyState === WebSocket.OPEN) return
    // 关闭之前的连接
    if (this.socket && this.socket.readyState === WebSocket.OPEN) this.close()
    this.socket = new WebSocket(`${BASE_URL}/${TYPE_MAP[type]}`)
    this.symbol = symbol
    this.type = type
    this.reconnectTimes = 0
    this.socket.onopen = () => {
      console.log('WebSocket 连接成功')
      this.send({ ac: "auth", params: this.token })
      this.startHeartbeat()
    };

    this.socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        this.handleMessage(data);
      } catch (error) {
        console.log('消息解析错误:', error);
      }
    };

    this.socket.onclose = (event) => {
      if (event.code === 1000) return
      console.log('WebSocket 连接异常关闭 将尝试重新连接:', event.code);
      this.reconnect();
    };

    this.socket.onerror = (error) => {
      console.error('WebSocket 连接发生错误:', error);
    };
  }
  // 设置心跳
  startHeartbeat () {
    this.heartbeatTimer = setInterval(() => {
      if (this.socket && this.socket.readyState === WebSocket.OPEN) {
        this.send({ ac: "ping", params: Date.now() })
      }
    }, this.heartbeatInterval);
  }
  // 停止心跳
  stopHeartbeat () {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }
  // 重连
  reconnect () {
    this.stopHeartbeat();
    this.reconnectTimes++
    if (this.reconnectTimes > this.reconnectMaxTimes) return
    const timeOut = setTimeout(() => {
      console.log('重新连接中...');
      this.connect(this.type, this.symbol, this.region, this.resolution, this.lastBar);
      clearTimeout(timeOut)
    }, this.reconnectInterval);
  }
  handleSymbolName () {
    return this.symbol
  }
  // 获取上一根K线时间戳
  getPreviousNearestFiveOrTenMinutesTimestamp (timestamp, resolution) {
    const now = new Date(timestamp);
    if (resolution === '1') {
      // 设置秒和毫秒为0，得到当前整分钟的时间
      now.setSeconds(0, 0);
      // 转换为时间戳（毫秒）
      return now.getTime();
    }
    const minutes = now.getMinutes();
    const resolutionInMinutes = parseInt(resolution);
    // 计算当前时间之前的最近一个整5分钟或整10分钟或者整15分钟或者整30分钟时间
    const targetMinutes = Math.floor(minutes / resolutionInMinutes) * resolutionInMinutes;
    // 创建一个新的 Date 对象，设置为整分钟
    const targetTime = new Date(now);
    targetTime.setMinutes(targetMinutes);
    targetTime.setSeconds(0);
    targetTime.setMilliseconds(0);

    return targetTime.getTime();
  }
  // 处理消息
  handleMessage (res) {
    const { code, data, resAc, msg } = res
    if (code === 1 && resAc === 'auth') {
      this.send({ ac: "subscribe", params: this.handleSymbolName(), types: "tick" })
      return
    }
    if (code === 1 && data) {
      const { t, ld, v } = data
      const time = this.getPreviousNearestFiveOrTenMinutesTimestamp(t, this.resolution)
      const lastData = this.dataMap.get(time) || (this.lastBar?.time === time ? this.lastBar : undefined)
      if (lastData) {
        this.dataMap.set(time, {
          time: time,
          close: ld,
          open: lastData.open,
          high: ld > lastData.high ? ld : lastData.high,
          low: ld < lastData.low ? ld : lastData.low,
          volume: v + lastData.volume
        })
      } else {
        this.dataMap.clear()
        this.dataMap.set(time, {
          time: time,
          close: ld,
          open: ld,
          high: ld,
          low: ld,
          volume: v
        })
      }
      this.onmessage?.(this.dataMap.get(time))
    }
  }
  // 发送消息
  send (params) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(params));
    } else {
      console.log('WebSocket 未连接成功， 状态码:', this.socket?.readyState);
    }
  }
  // 监听消息
  onMessage (callback) {
    this.onmessage = callback
  }
  // 关闭连接
  close () {
    if (this.socket) {
      this.socket.close();
      this.stopHeartbeat();
    }
  }
}

export default SingletonSocket;