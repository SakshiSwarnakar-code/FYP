import mongoose from "mongoose";
import { ENV } from "../config/env.js";

export const connectDB = async () => {
  await mongoose.connect(ENV.MONGO_URI, { dbName: ENV.DB_NAME });
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};
