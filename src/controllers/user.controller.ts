import { IRequest } from "@src/interfaces/function.interface";
import logger from "@src/utils/logger";
import { Response, NextFunction } from "express";
import userService from "@src/services/user.service";
import { IUser } from "@src/db/model/user.model";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data } = req;
    const payload: IUser = { ...data };
    const new_user = await userService.saveOrUpdate(payload);

    res
      .status(201)
      .json({ message: "user Created Successfully", data: new_user });
  } catch (error) {
    logger.log("error", `Error in create user controller method: ${error}`);
    next(error);
  }
};

const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { userId },
    } = req;
    const user = await userService.saveOrUpdate(data, { _id: userId });
    res.status(200).json({ message: "user updated Successfully", data: user });
  } catch (error) {
    logger.log("error", `Error in update user controller method: ${error}`);
    next(error);
  }
};

const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { userId },
    } = req;
    const user = await userService.deleteOne({ _id: userId });
    res.status(200).json({ message: `user deleted Successfully`, data: user });
  } catch (error) {
    logger.log("error", `Error in delete user controller method: ${error}`);
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { userId },
    } = req;
    const user = await userService.getOrError({ _id: userId });
    res.status(200).json({ message: `user Fetched Successfully`, data: user });
  } catch (error) {
    logger.log("error", `Error in fetching user controller method: ${error}`);
    next(error);
  }
};

const index = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt, user } = req;
    const users = await userService.getAll({ ...filters }, null, pageOpt);
    res
      .status(200)
      .json({ message: `users Retrieved Successfully`, data: users });
  } catch (error) {
    logger.log("error", `Error in retrieving user list method: ${error}`);
    next(error);
  }
};

export { create, update, remove, get, index };
