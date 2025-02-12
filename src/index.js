import UDFCompatibleDatafeed from './UDFCompatibleDatafeed.js'
// key 需要在 https://www.itick.org 中免费申请
const key = '*****'
new TradingView.widget({
  debug: false,
  fullscreen: false,
  symbol: 'BINANCE:BTCUSDT',
  interval: '1',
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
