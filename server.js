import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import foodRouter from "./routes/food.routes.js";
import { connectDB } from "./config/db.js";

dotenv.config();

// app config
const app = express();
const port = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cors());

// db connection
connectDB();

// api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));

app.listen(port, () =>
  console.log(`server is running on http://localhost:${port}`)
);
