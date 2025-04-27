import { serverConfig } from "@src/configs";
import { NotFoundError } from "@src/errors";
import {
  rateLimiter,
  filterMiddleware,
} from "@src/middlewares/system.middleware";
import { Request, Response, Router } from "express";
import os from "os";
import authRoutes from "./auth.routes";
import agentRoutes from "./agent.routes";
import artisanRoutes from "./artisan.routes";
import landLordRoutes from "./landlord.routes";
import careTakerRoute from "./caretaker.routes";
import userRoute from "./user.routes";

const router = Router();
const apiVersion = "/api/v1";

router.use(rateLimiter);
router.use(filterMiddleware);

const index = (_req: Request, res: Response): any => {
  return res.status(200).json({
    message: `Welcome to Oke-Odan API.`,
    data: {
      port: serverConfig.PORT,
      container_hostname: os.hostname(),
      processId: process.pid,
      environment: serverConfig.NODE_ENV,
      version: serverConfig.APP_VERSION,
    },
  });
};

router.get("/", index);

router.use(`${apiVersion}/auth`, authRoutes);
router.use(`${apiVersion}/agent`, agentRoutes);
router.use(`${apiVersion}/artisan`, artisanRoutes);
router.use(`${apiVersion}/landlord`, landLordRoutes);
router.use(`${apiVersion}/caretaker`, careTakerRoute);
router.use(`${apiVersion}/user`, userRoute);

router.use("*", (req) => {
  throw new NotFoundError(
    `You missed the road Cannot ${req.method} ${req.originalUrl} on this server`
  );
});

export default router;
