import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redisConnection = new Redis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

redisConnection.on("connect", () => {
  console.log("Redis connection established.");
});

redisConnection.on("error", (err) => {
  console.error(`Redis connection error: ${err}`);
});

export default redisConnection;