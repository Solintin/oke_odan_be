import { IRequest } from "@src/interfaces/function.interface";
import paymentdetailService from "@src/services/paymentdetail.service";
import logger from "@src/utils/logger";
import { Response, Request, NextFunction } from "express";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data } = req;
    const Donation = await paymentdetailService.saveOrUpdate(data);
    res.status(201).json({
      message: `Donation Created Successfully`,
      data: Donation,
    });
  } catch (error) {
    logger.log("error", `Error in create Donation controller method: ${error}`);
    next(error);
  }
};
const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { paymentDetailId },
    } = req;

    const Donation = await paymentdetailService.saveOrUpdate(data, {
      _id: paymentDetailId,
    });
    res.status(200).json({
      message: `Donation updated Successfully`,
      data: Donation,
    });
  } catch (error) {
    logger.log("error", `Error in update Donation controller method: ${error}`);
    next(error);
  }
};
const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { paymentDetailId },
    } = req;

    const Donation = await paymentdetailService.deleteOne({
      _id: paymentDetailId,
    });
    res.status(200).json({
      message: `Donation deleted Successfully`,
      data: Donation,
    });
  } catch (error) {
    logger.log("error", `Error in delete Donation controller method: ${error}`);
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { paymentDetailId },
    } = req;

    const Donation = await paymentdetailService.getOrError({
      _id: paymentDetailId,
    });
    res.status(200).json({
      message: `Donation Fetched Successfully`,
      data: Donation,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in fetching Donation controller method: ${error}`
    );
    next(error);
  }
};
const index = async (req: IRequest, res: Response, Next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;

    const Donations = await paymentdetailService.getAll(filters, null, pageOpt);
    res.status(200).json({
      message: `Donations Retrieved Successfully`,
      data: Donations,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in retrieving Donation controller method: ${error}`
    );
    Next(error);
  }
};

export { create, update, remove, get, index };
