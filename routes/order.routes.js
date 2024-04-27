import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
  listOrders,
  placeOrder,
  userOrders,
  verifyOrder,
} from "../controllers/order.controllers.js";

const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);

export default orderRouter;