import { IRequest } from "@src/interfaces/function.interface";
import logger from "@src/utils/logger";
import { Response, NextFunction } from "express";
import projectService from "@src/services/project.service";
import { IProject } from "@src/db/model/project.model";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data } = req;
    const payload: IProject = { ...data };
    const new_user = await projectService.saveOrUpdate(payload);

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
      paramIds: { projectId },
    } = req;
    const project = await projectService.saveOrUpdate(data, { _id: projectId });
    res
      .status(200)
      .json({ message: "project updated Successfully", data: project });
  } catch (error) {
    logger.log("error", `Error in update project controller method: ${error}`);
    next(error);
  }
};

const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { projectId },
    } = req;
    const project = await projectService.deleteOne({ _id: projectId });
    res
      .status(200)
      .json({ message: `project deleted Successfully`, data: project });
  } catch (error) {
    logger.log("error", `Error in delete project controller method: ${error}`);
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { projectId },
    } = req;
    const project = await projectService.getOrError({ _id: projectId });
    res
      .status(200)
      .json({ message: `project Fetched Successfully`, data: project });
  } catch (error) {
    logger.log(
      "error",
      `Error in fetching project controller method: ${error}`
    );
    next(error);
  }
};

const index = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;
    const projects = await projectService.getAll({ ...filters }, null, pageOpt);
    res
      .status(200)
      .json({ message: `projects Retrieved Successfully`, data: projects });
  } catch (error) {
    logger.log("error", `Error in retrieving user list method: ${error}`);
    next(error);
  }
};

export { create, update, remove, get, index };
