import { ITask } from "@src/db/model/task.model";
import { IRequest } from "@src/interfaces/function.interface";
import taskService from "@src/services/task.service";
import logger from "@src/utils/logger";
import { Response, NextFunction } from "express";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data, user } = req;
    const payload: ITask = { ...data, user_id: user._id };
    const task = await taskService.saveOrUpdate(payload);

    res.status(201).json({ message: "Task Created Successfully", data: task });
  } catch (error) {
    logger.log("error", `Error in create task controller method: ${error}`);
    next(error);
  }
};

const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { taskId },
    } = req;
    const task = await taskService.saveOrUpdate(data, { _id: taskId });
    res.status(200).json({ message: "Task updated Successfully", data: task });
  } catch (error) {
    logger.log("error", `Error in update task controller method: ${error}`);
    next(error);
  }
};

const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { taskId },
    } = req;
    const task = await taskService.deleteOne({ _id: taskId });
    res.status(200).json({ message: `Task deleted Successfully`, data: task });
  } catch (error) {
    logger.log("error", `Error in delete task controller method: ${error}`);
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { taskId },
    } = req;
    const task = await taskService.getOrError({ _id: taskId });
    res.status(200).json({ message: `Task Fetched Successfully`, data: task });
  } catch (error) {
    logger.log("error", `Error in fetching task controller method: ${error}`);
    next(error);
  }
};

const index = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt, user } = req;
    const tasks = await taskService.getAll(
      { ...filters, user_id: user._id },
      null,
      pageOpt
    );
    res
      .status(200)
      .json({ message: `Tasks Retrieved Successfully`, data: tasks });
  } catch (error) {
    logger.log("error", `Error in retrieving task list method: ${error}`);
    next(error);
  }
};

export { create, update, remove, get, index };
