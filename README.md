## iTick 介绍

iTick 是一家数字代理机构，为金融科技公司和开发者提供可靠的数据源APIs，涵盖外汇、股票、加密货币、指数等，帮助构建创新的交易和分析工具，满足金融行业的需求

官网: https://www.itick.org

文档: https://itick-cn.readme.io/reference/instructions

## 特点

iTick 提供全面的 API 套件，包括 FIX、REST 和 Websocket API，可满足机构级客户的需求。我们的 iTick API 解决方案具有高度可扩展性，可让客户访问实时市场数据和见解。客户可以轻松地将我们的 iTick API 与其现有系统和应用程序集成，从而简化工作流程

🙋‍♀️ 开发者友好：标准易用接口风格，简明的文档以及丰富的各类示例，帮助开发者快速接入。

🌈 产品分类丰富：支持主流市场股票（美国、香港、中国、新加坡、日本等）、全球外汇、指数以及加密货币的实时、历史数据。

👩‍💻 支持多场景接入：丰富的接口数据，可以满足到小型的量化团队、金融科技公司以及专业的分析机构对数据的要求。

🍿 专业的服务质量：提供专业的数据来源，多地区加速以及数据链路的热备份技术，确保数据的实时以及稳定可靠。

🧙 灵活定制化服务：对于机构用户以及专业用户，支持提供定制化的数据方案，满足机构与专业用户的需求。

## 联系方式

Telegram: [iticksupport](https://t.me/iticksupport)

WhatsApp: +85259046663

Email: support@itick.org

## 启动项目

本项目仅供部分数据示例演示，如需更详细更准确的数据接入请联系iTick官方或参考文档: https://itick-cn.readme.io/reference/instructions

node 16+

```
cd tradingview-kline-demo
npm install
npm run start
```

## 设置令牌

打开官网，点击右上角立即获取，注册账号/登录，点击头像，打开控制台页面，查看令牌点击复制

粘贴到 src/index.js

```
import UDFCompatibleDatafeed from './UDFCompatibleDatafeed.js'
// 谨慎用试用的令牌，可能存在过期问题  
const key = '您的令牌'
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

```
