import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://atultingre:atultingre@cluster0.ltp1czg.mongodb.net/food-delivery"
    );
    console.log("Database  connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};
