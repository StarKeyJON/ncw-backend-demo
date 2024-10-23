import ccxt from "ccxt"; // Import the CCXT library

import { Clients } from "../interfaces/Clients"; // Assuming you have a Clients interface
import { Trade } from "../model/trade";
const exchange = new ccxt.pro.binance({ newUpdates: false });

export class TradeService {
  private exchange: typeof exchange; // Declare the exchange property

  constructor(private readonly clients: Clients) {
    this.exchange = new ccxt.pro.binance({
      // Initialize the exchange with the specific exchange
      newUpdates: false,
      apiKey: this.clients.apiKey,
      secret: this.clients.secret,
      password: this.clients.passphrase,
      enableRateLimit: true,
    });
  }

  // Fetch recent trades for a symbol
  async fetchTrades(symbol: string, since?: number, limit?: number) {
    return await this.exchange.fetchTrades(symbol, since, limit);
  }

  // Create a market order
  async createMarketOrder(symbol: string, amount: number) {
    const order = await this.exchange.createMarketOrder(symbol, "buy", amount);
    await Trade.create({
      symbol,
      amount,
      orderId: order.id,
      status: order.status, // Ensure status is set correctly
    });
    return order;
  }

  // Create a limit order
  async createLimitOrder(symbol: string, amount: number, price: number) {
    const order = await this.exchange.createLimitOrder(
      symbol,
      "buy",
      amount,
      price,
    );
    await Trade.create({
      symbol,
      amount,
      price,
      orderId: order.id,
      status: order.status, // Ensure status is set correctly
    });
    return order;
  }

  // Cancel an order by ID
  async cancelOrder(orderId: string) {
    const response = await this.exchange.cancelOrder(orderId);
    await Trade.update({ orderId }, { status: "canceled" });
    return response;
  }

  // Get order status
  async getOrderStatus(orderId: string) {
    const order = await this.exchange.fetchOrder(orderId);
    return order.status; // e.g., 'open', 'closed', 'canceled'
  }

  // Fetch open orders
  async fetchOpenOrders(symbol?: string) {
    return await this.exchange.fetchOpenOrders(symbol);
  }

  // Fetch all orders (including closed and canceled)
  async fetchAllOrders(symbol?: string, since?: number, limit?: number) {
    return await this.exchange.fetchOrders(symbol, since, limit);
  }

  // Fetch balance information
  async fetchBalance() {
    return await this.exchange.fetchBalance();
  }

  // Fetch ticker for a symbol
  async fetchTicker(symbol: string) {
    return await this.exchange.fetchTicker(symbol);
  }

  // Fetch OHLCV data
  async fetchOHLCV(
    symbol: string,
    timeframe: string,
    since?: number,
    limit?: number,
  ) {
    return await this.exchange.fetchOHLCV(symbol, timeframe, since, limit);
  }

  // Fetch historical trades for a symbol
  async fetchHistoricalTrades(symbol: string, since?: number, limit?: number) {
    return await this.exchange.fetchMyTrades(symbol, since, limit);
  }
}
