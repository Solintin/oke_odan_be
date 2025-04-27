import { IRequest } from "@src/interfaces/function.interface";
import logger from "@src/utils/logger";
import { Response, NextFunction } from "express";
import { ICareTakerAgent } from "@src/db/model/caretaker.model";
import caretakerService from "@src/services/caretaker.service";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data, user } = req;
    const payload: ICareTakerAgent = { ...data, user_id: user._id };
    const caretaker = await caretakerService.saveOrUpdate(payload);

    res
      .status(201)
      .json({ message: "caretaker Created Successfully", data: caretaker });
  } catch (error) {
    logger.log(
      "error",
      `Error in create caretaker controller method: ${error}`
    );
    next(error);
  }
};

const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { caretakerId },
    } = req;
    const caretaker = await caretakerService.saveOrUpdate(data, {
      _id: caretakerId,
    });
    res
      .status(200)
      .json({ message: "caretaker updated Successfully", data: caretaker });
  } catch (error) {
    logger.log(
      "error",
      `Error in update caretaker controller method: ${error}`
    );
    next(error);
  }
};

const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { caretakerId },
    } = req;
    const caretaker = await caretakerService.deleteOne({ _id: caretakerId });
    res
      .status(200)
      .json({ message: `caretaker deleted Successfully`, data: caretaker });
  } catch (error) {
    logger.log(
      "error",
      `Error in delete caretaker controller method: ${error}`
    );
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { caretakerId },
    } = req;
    const caretaker = await caretakerService.getOrError({ _id: caretakerId });
    res
      .status(200)
      .json({ message: `caretaker Fetched Successfully`, data: caretaker });
  } catch (error) {
    logger.log(
      "error",
      `Error in fetching caretaker controller method: ${error}`
    );
    next(error);
  }
};

const index = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt, user } = req;
    const caretakers = await caretakerService.getAll(
      { ...filters },
      null,
      pageOpt
    );
    res
      .status(200)
      .json({ message: `caretakers Retrieved Successfully`, data: caretakers });
  } catch (error) {
    logger.log("error", `Error in retrieving caretaker list method: ${error}`);
    next(error);
  }
};

export { create, update, remove, get, index };
