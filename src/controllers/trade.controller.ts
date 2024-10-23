import { Request, NextFunction, Response } from "express";
import { TradeService } from "../services/trade.service"; // Adjust the path as necessary

export class TradeController {
  constructor(private readonly service: TradeService) {}

  async fetchTrades(req: Request, res: Response, next: NextFunction) {
    const { symbol } = req.params;
    const { since, limit } = req.body;
    try {
      const trades = await this.service.fetchTrades(symbol, since, limit);
      res.json(trades);
    } catch (err) {
      next(err);
    }
  }

  async createMarketOrder(req: Request, res: Response, next: NextFunction) {
    const { symbol, amount } = req.body;

    try {
      const order = await this.service.createMarketOrder(symbol, amount);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }

  async createLimitOrder(req: Request, res: Response, next: NextFunction) {
    const { symbol, amount, price } = req.body;

    try {
      const order = await this.service.createLimitOrder(symbol, amount, price);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  }

  async cancelOrder(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;

    try {
      const response = await this.service.cancelOrder(orderId);
      res.json(response);
    } catch (err) {
      next(err);
    }
  }

  async getOrderStatus(req: Request, res: Response, next: NextFunction) {
    const { orderId } = req.params;

    try {
      const status = await this.service.getOrderStatus(orderId);
      res.json({ orderId, status });
    } catch (err) {
      next(err);
    }
  }

  async fetchOpenOrders(req: Request, res: Response, next: NextFunction) {
    const { symbol } = req.params;

    try {
      const openOrders = await this.service.fetchOpenOrders(symbol);
      res.json(openOrders);
    } catch (err) {
      next(err);
    }
  }

  async fetchBalance(req: Request, res: Response, next: NextFunction) {
    try {
      const balance = await this.service.fetchBalance();
      res.json(balance);
    } catch (err) {
      next(err);
    }
  }

  async fetchTicker(req: Request, res: Response, next: NextFunction) {
    const { symbol } = req.params;

    try {
      const ticker = await this.service.fetchTicker(symbol);
      res.json(ticker);
    } catch (err) {
      next(err);
    }
  }

  async fetchOHLCV(req: Request, res: Response, next: NextFunction) {
    const { symbol } = req.params;
    const { timeframe, since, limit } = req.body;

    try {
      const ohlcv = await this.service.fetchOHLCV(
        symbol,
        timeframe,
        since,
        limit,
      );
      res.json({
        data: ohlcv,
      });
    } catch (err) {
      next(err);
    }
  }

  async fetchHistoricalTrades(req: Request, res: Response, next: NextFunction) {
    const { symbol } = req.params;
    const { since, limit } = req.body;

    try {
      const historicalTrades = await this.service.fetchHistoricalTrades(
        symbol,
        since,
        limit,
      );
      res.json(historicalTrades);
    } catch (err) {
      next(err);
    }
  }
}
