import { serverConfig } from "@src/configs";
import { NotFoundError } from "@src/errors";
import {
  rateLimiter,
  filterMiddleware,
} from "@src/middlewares/system.middleware";
import { Request, Response, Router } from "express";
import os from "os";
import authRoutes from "./auth.routes";
import userRoute from "./user.routes";
import announcementRoute from "./announcement.routes";
import projectRoute from "./project.routes";
import contactRoute from "./contact.route";
import eventRoute from "./event.routes";
import donationRoute from "./donation.routes";
import paymentdetailRoute from "./paymentdetail.routes";
import overviewData from "@src/controllers/overview.controller";

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
router.use(`${apiVersion}/user`, userRoute);
router.use(`${apiVersion}/announcement`, announcementRoute);
router.use(`${apiVersion}/project`, projectRoute);
router.use(`${apiVersion}/contact`, contactRoute);
router.use(`${apiVersion}/event`, eventRoute);
router.use(`${apiVersion}/donation`, donationRoute);
router.use(`${apiVersion}/paymentdetail`, paymentdetailRoute);
router.get(`${apiVersion}/overview`, overviewData);

router.use("*", (req) => {
  throw new NotFoundError(
    `You missed the road Cannot ${req.method} ${req.originalUrl} on this server`
  );
});

export default router;
