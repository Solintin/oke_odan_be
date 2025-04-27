import { IRequest } from "@src/interfaces/function.interface";
import logger from "@src/utils/logger";
import { Response, NextFunction } from "express";
import { ILandlord } from "@src/db/model/landlord.model";
import landlordService from "@src/services/landlord.service";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data, user } = req;
    const payload: ILandlord = { ...data, user_id: user._id };
    const landLord = await landlordService.saveOrUpdate(payload);

    res
      .status(201)
      .json({ message: "landLord Created Successfully", data: landLord });
  } catch (error) {
    logger.log("error", `Error in create landLord controller method: ${error}`);
    next(error);
  }
};

const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { landLordId },
    } = req;
    const landLord = await landlordService.saveOrUpdate(data, {
      _id: landLordId,
    });
    res
      .status(200)
      .json({ message: "landLord updated Successfully", data: landLord });
  } catch (error) {
    logger.log("error", `Error in update landLord controller method: ${error}`);
    next(error);
  }
};

const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { landLordId },
    } = req;
    const landLord = await landlordService.deleteOne({ _id: landLordId });
    res
      .status(200)
      .json({ message: `landLord deleted Successfully`, data: landLord });
  } catch (error) {
    logger.log("error", `Error in delete landLord controller method: ${error}`);
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { landLordId },
    } = req;
    const landLord = await landlordService.getOrError({ _id: landLordId });
    res
      .status(200)
      .json({ message: `landLord Fetched Successfully`, data: landLord });
  } catch (error) {
    logger.log(
      "error",
      `Error in fetching landLord controller method: ${error}`
    );
    next(error);
  }
};

const index = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt, user } = req;
    const landLords = await landlordService.getAll(
      { ...filters },
      null,
      pageOpt
    );
    res
      .status(200)
      .json({ message: `landLords Retrieved Successfully`, data: landLords });
  } catch (error) {
    logger.log("error", `Error in retrieving landLord list method: ${error}`);
    next(error);
  }
};

export { create, update, remove, get, index };
