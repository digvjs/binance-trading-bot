require('dotenv').config();
const ccxt = require('ccxt');
const axios = require('axios');

const tick = async (config, binanceClient) => {
    const { asset, base, spread, allocation } = config;
    const market = `${asset}/${base}`;  // market key

    // Cancel orders of previous tick
    const orders = await binanceClient.fetchOpenOrders(market);
    orders.forEach(async order => {
        await binanceClient.cancelOrder(order.id);
    });

    // Get actual market price using coingecko API
    const results = await Promise.all([
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=usd')
    ]);
    const marketPrice = results[0].data.bitcoin.usd / results[1].data.tether.usd;

    // new orders config
    const sellPrice = marketPrice * (1 + spread);
    const buyPrice = marketPrice * (1 - spread);
    const balances = await binanceClient.fetchBalance();
    const assetBalance = balances.free[asset] || 0;
    const baseBalance = balances.free[base] || 0;
    const sellVolume = assetBalance * allocation;
    const buyVolume = (baseBalance * allocation) / marketPrice;

    // Create limit sell order
    await binanceClient.createLimitSellOrder(market, sellVolume, sellPrice);

    // Create limit buy order
    await binanceClient.createLimitBuyOrder(market, buyVolume, buyPrice);

    console.log(`
        New tick for ${market}...
        Created Limit sell order for ${sellVolume}@${sellPrice}
        Created Limit buy order for ${buyVolume}@${buyPrice}
    `);
}

const run = () => {
    const config = {
        asset: 'BTC',       // Trading crypto
        base: 'USDT',       // Trading against
        allocation: 0.1,    // % of money in portfolio for each trade
        spread: 0.2,        // % for Buy and sell limit order
        tickInterval: 2000  // 2 seconds
    }

    // Instantiate binance client
    const binanceClient = new ccxt.binance({
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_API_SECRET,
        options: {
            adjustForTimeDifference: true
        }
    });

    // First tick execution
    tick(config, binanceClient);

    // For subsequent execution of tick
    setInterval(tick, config.tickInterval, config, binanceClient);
}

// Execute bot
run();