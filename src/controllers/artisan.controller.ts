import { IRequest } from "@src/interfaces/function.interface";
import logger from "@src/utils/logger";
import { Response, NextFunction } from "express";
import { IArtisan } from "@src/db/model/artisan.model";
import artisanService from "@src/services/artisan.service";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data } = req;
    const payload: IArtisan = { ...data };
    const artisan = await artisanService.saveOrUpdate(payload);

    res
      .status(201)
      .json({ message: "artisan Created Successfully", data: artisan });
  } catch (error) {
    logger.log("error", `Error in create artisan controller method: ${error}`);
    next(error);
  }
};

const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { artisanId },
    } = req;
    const artisan = await artisanService.saveOrUpdate(data, { _id: artisanId });
    res
      .status(200)
      .json({ message: "artisan updated Successfully", data: artisan });
  } catch (error) {
    logger.log("error", `Error in update artisan controller method: ${error}`);
    next(error);
  }
};

const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { artisanId },
    } = req;
    const artisan = await artisanService.deleteOne({ _id: artisanId });
    res
      .status(200)
      .json({ message: `artisan deleted Successfully`, data: artisan });
  } catch (error) {
    logger.log("error", `Error in delete artisan controller method: ${error}`);
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { artisanId },
    } = req;
    const artisan = await artisanService.getOrError({ _id: artisanId });
    res
      .status(200)
      .json({ message: `artisan Fetched Successfully`, data: artisan });
  } catch (error) {
    logger.log(
      "error",
      `Error in fetching artisan controller method: ${error}`
    );
    next(error);
  }
};

const index = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt, user } = req;
    const artisans = await artisanService.getAll({ ...filters }, null, pageOpt);
    res
      .status(200)
      .json({ message: `artisans Retrieved Successfully`, data: artisans });
  } catch (error) {
    logger.log("error", `Error in retrieving artisan list method: ${error}`);
    next(error);
  }
};

export { create, update, remove, get, index };
