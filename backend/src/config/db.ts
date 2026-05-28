import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/veda-ai";

export const connectDB = async (): Promise<void> => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("MongoDB connection established successfully.");
    });

    mongoose.connection.on("error", (err) => {
      console.error(`MongoDB connection error: ${err}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("MongoDB connection disconnected.");
    });

    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
  } catch (error) {
    console.error("Critical error connecting to MongoDB:", error);
    process.exit(1);
  }
};

// Gracefully close connections on termination signals
export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed gracefully.");
};
