import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  placeOrder,
  userOrders,
  verifyOrder,
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);

export default orderRouter;
