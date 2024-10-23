import { Router } from "express";
import { TradeService } from "../services/trade.service"; // Adjust the path as necessary
import { Clients } from "../interfaces/Clients"; // Assuming you have a Clients interface
import { TradeController } from "../controllers/trade.controller";
import { validateLimitOrder, validateMarketOrder } from "../middleware/trade";

export function createTradeRoutes(clients: Clients) {
  const tradeService = new TradeService(clients);
  const tradeController = new TradeController(tradeService);
  const route = Router({ mergeParams: true });

  // Fetch recent trades for a symbol
  route.get(
    "/trades/:symbol",
    tradeController.fetchTrades.bind(tradeController),
  );

  // Create a market order
  route.post(
    "/orders/market",
    validateMarketOrder,
    tradeController.createMarketOrder.bind(tradeController),
  );

  // Create a limit order
  route.post(
    "/orders/limit",
    validateLimitOrder,
    tradeController.createLimitOrder.bind(tradeController),
  );

  // Cancel an order by ID
  route.delete(
    "/orders/:orderId",
    tradeController.cancelOrder.bind(tradeController),
  );

  // Get order status
  route.get(
    "/orders/:orderId/status",
    tradeController.getOrderStatus.bind(tradeController),
  );

  // Fetch open orders
  route.get(
    "/orders/open/:symbol?",
    tradeController.fetchOpenOrders.bind(tradeController),
  );

  // Fetch balance
  route.get("/balance", tradeController.fetchBalance.bind(tradeController));

  // Fetch ticker
  route.get(
    "/ticker/:symbol",
    tradeController.fetchTicker.bind(tradeController),
  );

  // Fetch OHLCV data
  route.get("/ohlcv/:symbol", tradeController.fetchOHLCV.bind(tradeController));

  // Fetch historical trades
  route.get(
    "/historical-trades/:symbol",
    tradeController.fetchHistoricalTrades.bind(tradeController),
  );

  return route;
}
