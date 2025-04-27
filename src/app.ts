import express, { Express, json, urlencoded } from "express";
import { Connection } from "mongoose";
import compression from "compression";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { Server } from "http";
import DB from "@src/db";
import routes from "@src/routes";
import { dbConfig, serverConfig } from "@src/configs/";
import { errorHandler } from "@src/middlewares/system.middleware";
import logger from "./utils/logger";
import { setupSwagger } from "./configs/swagger";

const corsOptions: cors.CorsOptions = {
  origin: serverConfig.ALLOWED_ORIGINS
    ? serverConfig.ALLOWED_ORIGINS.split(",")
    : "*",
};

const initializeDb = async (): Promise<Connection | null> => {
  try {
    logger.info("⏳ Initializing database...");
    const connection = await DB.connectDB(dbConfig);
    logger.debug("✅ MongoDB connection established");
    return connection;
  } catch (error) {
    logger.error(`❌ Error connecting to MongoDB: ${error}`);
    return null;
  }
};

const setupMiddlewares = (app: Express): void => {
  app.set("trust proxy", 1);
  app.use(compression());
  app.use(cors(serverConfig.NODE_ENV === "development" ? {} : corsOptions));
  app.use(json());
  app.use(urlencoded({ extended: false }));
  app.use(helmet());
  if (["development", "staging"].includes(serverConfig.NODE_ENV)) {
    app.use(morgan("dev"));
  }
  app.use(express.static(path.join(__dirname, "resources/public")));
  app.use(routes);
  setupSwagger(app);
  app.use(errorHandler);
};

const setupProcessSignals = (server: Server): void => {
  ["SIGINT", "SIGTERM"].forEach((signal) => {
    process.on(signal, async () => {
      logger.warn(`⚠️ Received ${signal}. Closing app...`);
      server.close(() => {
        logger.debug("✅ HTTP server closed, port released.");
        DB.closeConnection().then(() => {
          logger.debug("✅ Shutdown completed successfully\n");
          process.exit(0);
        });
      });
    });
  });
};

const startServer = async (): Promise<Server> => {
  const app = express();
  const dbConnection = await initializeDb();
  if (!dbConnection) {
    logger.error("❌ Failed to establish database connection. Exiting...");
    process.exit(1);
  }
  setupMiddlewares(app);
  const server = app.listen(serverConfig.PORT || 3000, () => {
    logger.debug(
      `✅ Server running on port ${serverConfig.PORT || 3000} in ${
        serverConfig.NODE_ENV
      } mode.`
    );
  });
  setupProcessSignals(server);
  return server;
};

const server = startServer();
export default server;
