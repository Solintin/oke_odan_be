import { config } from "dotenv";
config();

const RedisConfig = {
  REDIS_HOST: process.env.REDIS_HOST,

  REDIS_PORT: process.env.REDIS_PORT,

  REDIS_ACCESS_KEY: process.env.REDIS_ACCESS_KEY,
};

export default RedisConfig;
