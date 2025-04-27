import Redis from "ioredis";
import { redisConfig } from "@src/configs";
import loggerUtil from "@src/utils/logger";

const createRedisClient = () => {
  const client = new Redis({
    host: redisConfig.REDIS_HOST,
    port: Number(redisConfig.REDIS_PORT),
    password: redisConfig.REDIS_ACCESS_KEY,
    username: "default",
    maxRetriesPerRequest: null,
    retryStrategy: (attempts: number) => {
      const maxRetries = 3;
      const delay = Math.min(attempts * 1000, 5000);

      if (attempts >= maxRetries) {
        console.error("❌ Max Redis connection retries reached!");
        return null;
      }

      console.warn(
        `⚠️ Redis connection failed. Retrying in ${
          delay / 1000
        }s... (Attempt ${attempts}/${maxRetries})`
      );
      return delay;
    },
  });

  client.on("connect", () => {
    loggerUtil.debug("Connection established to Redis.");
  });

  client.on("close", () => {
    loggerUtil.debug("Redis connection closed.");
  });

  client.on("error", (error: Error) => {
    loggerUtil.log("error", `Redis error: ${error}`);
  });

  return client;
};

const redisClient = createRedisClient();

export default redisClient;
