# iTick TradingView 图表集成教程

## 简介
本教程将指导您如何使用 iTick 的股票 API 和 TradingView 的图表库创建专业的交易图表应用。iTick 提供可靠的股票、外汇、加密货币和指数的市场数据，而 TradingView 则提供强大的图表功能。

## 前置要求
- Node.js 16 或更高版本
- JavaScript 基础知识
- iTick API 账号和令牌
- TradingView 图表库

## 第一步：项目设置

首先，创建一个新项目：

```bash
mkdir itick-tradingview-chart
cd itick-tradingview-chart
npm init -y
```

安装必要的依赖：

```bash
npm install --save express webpack webpack-cli webpack-dev-server
```

## 第二步：项目结构

创建以下目录结构：
```
itick-tradingview-chart/
├── src/
│   ├── assets
│       └── charting_library/ # TradingView 库文件
│   └── index.js
├── package.json
├── README.md
└── index.html
```

## 第三步：获取 iTick API 令牌

1. 访问 [iTick 官网](https://www.itick.org)
2. 点击右上角的"立即获取"
3. 注册/登录您的账号
4. 点击头像进入控制台
5. 复制您的 API 令牌

## 第四步：配置API_KEY实现

### 在src/index.js文件中替换申请到的 API_KEY ：

```js
import UDFCompatibleDatafeed from './UDFCompatibleDatafeed.js'
// 谨慎用试用的令牌，可能存在过期问题  
const key = 'API_KEY'
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

## 第五步：运行应用

运行应用：

```bash
npm install
npm run start
```

## 主要特性
- 来自 iTick API 的实时股票数据
- 专业的 TradingView 图表
- 多时间周期支持
- 技术指标
- 自定义主题
- 响应式设计

## 安全注意事项
1. 切勿在客户端代码中暴露 iTick API 令牌
2. 实现适当的错误处理
3. 使用 HTTPS 进行 API 请求
4. 考虑实现速率限制

## 高级功能
您可以通过以下方式增强应用：
- 多图表布局
- 自定义技术指标
- 保存/加载图表配置
- 带自动完成的股票代码搜索
- 价格提醒
- 绘图工具

## 常见问题解决
常见问题及解决方案：
1. API 连接问题
   - 验证 API 令牌有效性
   - 检查网络连接
   - 确保 API 端点 URL 正确

2. 图表加载问题
   - 验证 TradingView 库路径
   - 检查浏览器控制台错误
   - 确保所有必需文件正确加载

## 技术支持
如需额外支持：
- iTick 文档：https://itick-cn.readme.io/reference/instructions
- iTick 支持邮箱：support@itick.org
- Telegram：@iticksupport
- WhatsApp：+85259046663

## 结语
本教程提供了构建专业交易图表应用的基础。您可以根据具体需求和要求进行扩展。如果您在实施过程中遇到任何问题，请随时参考上述支持渠道获取帮助。 

转载：https://itick.org/blog/blog-014