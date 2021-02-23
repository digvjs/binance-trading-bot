require('dotenv').config;
const ccxt = require('ccxt');
const axios = require('axios');

const tick = async () => {
    //
}

const run = () => {
    const config = {
        //
    }

    // Instantiate binance client
    const binanceClient = new ccxt.binance({
        apiKey: process.env.BINANCE_API_KEY,
        secret: process.env.BINANCE_API_SECRET
    });

    //
}