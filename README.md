# binance-trading-bot
Bot to trade bitcoin with non fiat currency USDT using Binance trading account. Built using node js, binance API, ccxt.

# What script does?

This script triggers the automated trades between `BTC/USDT` pair for given spread amount. The limit buy and limit sell are calculated based on spread and allowance for each trade.

# Setup guide

1. Install dependencies
  ```
  npm install
  ```

2. Create `.env` file and add below parameters to it -
  ```
  BINANCE_API_KEY=''
  BINANCE_API_SECRET=''
  ```
  You can obtain these values from your binance account.

3. Start the bot
  ```
  npm start
  ```
