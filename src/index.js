import UDFCompatibleDatafeed from './UDFCompatibleDatafeed.js'
// 谨慎用试用的令牌，可能存在过期问题 
const key = 'a5ca43babf5e49c4b734bdcb6f51a4a4465d52bd3fbe48e1847ac9259ae290c8'
new TradingView.widget({
  debug: false,
  fullscreen: false,
  symbol: 'BINANCE:BTCUSDT',
  interval: '5',
  container: "tradingview-container",
  datafeed: new UDFCompatibleDatafeed(key),
  library_path: "/charting_library/",
  locale: 'zh',
  autosize: true,
  width: window.innerWidth,
  height: window.innerHeight,
  disabled_features: ['use_localstorage_for_settings'],
  enabled_features: [
    'pre_post_market_sessions',
    'show_symbol_logos',
    'show_exchange_logos',
    'seconds_resolution',
    'custom_resolutions',
    'secondary_series_extend_time_scale',
    'show_percent_option_for_right_margin',
    'items_favoriting',
    'disable_resolution_rebuild',
  ],
  // overrides,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, // 时区
  theme: 'light', // 主题设置
  loading_screen: "#FFFFFF", // 加载时的背景颜
})
