// src/controllers/overview.controller.ts

import { NextFunction, Request, Response } from "express";
import { getOverviewMetrics } from "@src/services/overview.service";
import logger from "@src/utils/logger";

const overviewData = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getOverviewMetrics();
    res.status(200).json({
      message: "Overview fetched successfully",
      data,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in retrieving Overview controller method: ${error}`
    );
    next(error);
  }
};

export default overviewData;
