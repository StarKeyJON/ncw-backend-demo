import { Request, Response, NextFunction } from "express";

export function validateLimitOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { symbol, amount, price } = req.body;

  // Check if symbol is a valid string
  if (typeof symbol !== "string" || symbol.trim() === "") {
    return res.status(400).json({ error: "Invalid symbol" });
  }

  // Check if amount is a valid number
  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ error: "Invalid amount. It must be a positive number." });
  }

  // Check if price is a valid number (for limit orders)
  if (price !== undefined && (typeof price !== "number" || price <= 0)) {
    return res
      .status(400)
      .json({ error: "Invalid price. It must be a positive number." });
  }

  // If all validations passed, move to the next middleware/controller
  next();
}

export function validateMarketOrder(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { symbol, amount } = req.body;

  // Check if symbol is a valid string
  if (typeof symbol !== "string" || symbol.trim() === "") {
    return res.status(400).json({ error: "Invalid symbol" });
  }

  // Check if amount is a valid number
  if (typeof amount !== "number" || amount <= 0) {
    return res
      .status(400)
      .json({ error: "Invalid amount. It must be a positive number." });
  }
  // If all validations passed, move to the next middleware/controller
  next();
}
