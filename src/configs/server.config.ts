import { config } from "dotenv";
config();

const ServerConfig = {
  NODE_ENV: process.env.NODE_ENV || "development",

  HOST: process.env.HOST || "localhost",

  PORT: process.env.PORT,

  APP_VERSION: process.env.APP_VERSION,

  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,

  MAX_REQUESTS_PER_MINUTE: Number(process.env.MAX_REQUESTS_PER_MINUTE),
};

export default ServerConfig;
