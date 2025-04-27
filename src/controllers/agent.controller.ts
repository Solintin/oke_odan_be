import { IRequest } from "@src/interfaces/function.interface";
import logger from "@src/utils/logger";
import { Response, NextFunction } from "express";
import agentService from "@src/services/agent.service";
import { IHouseAgent } from "@src/db/model/agent.model";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data } = req;
    const payload: IHouseAgent = { ...data };
    const agent = await agentService.saveOrUpdate(payload);

    res
      .status(201)
      .json({ message: "agent Created Successfully", data: agent });
  } catch (error) {
    logger.log("error", `Error in create agent controller method: ${error}`);
    next(error);
  }
};

const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { agentId },
    } = req;
    const agent = await agentService.saveOrUpdate(data, { _id: agentId });
    res
      .status(200)
      .json({ message: "agent updated Successfully", data: agent });
  } catch (error) {
    logger.log("error", `Error in update agent controller method: ${error}`);
    next(error);
  }
};

const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { agentId },
    } = req;
    const agent = await agentService.deleteOne({ _id: agentId });
    res
      .status(200)
      .json({ message: `agent deleted Successfully`, data: agent });
  } catch (error) {
    logger.log("error", `Error in delete agent controller method: ${error}`);
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { agentId },
    } = req;
    const agent = await agentService.getOrError({ _id: agentId });
    res
      .status(200)
      .json({ message: `agent Fetched Successfully`, data: agent });
  } catch (error) {
    logger.log("error", `Error in fetching agent controller method: ${error}`);
    next(error);
  }
};

const index = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt, user } = req;
    const agents = await agentService.getAll({ ...filters }, null, pageOpt);
    res
      .status(200)
      .json({ message: `agents Retrieved Successfully`, data: agents });
  } catch (error) {
    logger.log("error", `Error in retrieving agent list method: ${error}`);
    next(error);
  }
};

export { create, update, remove, get, index };
