import { IRequest } from "@src/interfaces/function.interface";
import logger from "@src/utils/logger";
import { Response, NextFunction } from "express";
import announcementService from "@src/services/announcement.service";
import { IAnnouncement } from "@src/db/model/announcementmodel.model";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data } = req;
    const payload: IAnnouncement = { ...data };
    const new_user = await announcementService.saveOrUpdate(payload);

    res
      .status(201)
      .json({ message: "announcement Created Successfully", data: new_user });
  } catch (error) {
    logger.log("error", `Error in create user controller method: ${error}`);
    next(error);
  }
};

const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { announcementId },
    } = req;
    const announcement = await announcementService.saveOrUpdate(data, {
      _id: announcementId,
    });
    res.status(200).json({
      message: "announcement updated Successfully",
      data: announcement,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in update announcement controller method: ${error}`
    );
    next(error);
  }
};

const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { announcementId },
    } = req;
    const announcement = await announcementService.deleteOne({
      _id: announcementId,
    });
    res.status(200).json({
      message: `announcement deleted Successfully`,
      data: announcement,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in delete announcement controller method: ${error}`
    );
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { announcementId },
    } = req;
    const announcement = await announcementService.getOrError({
      _id: announcementId,
    });
    res.status(200).json({
      message: `announcement Fetched Successfully`,
      data: announcement,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in fetching announcement controller method: ${error}`
    );
    next(error);
  }
};

const scheduled = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;
    const currentDate = new Date();

    // Filter for announcements where scheduled_date is in the future
    const projects = await announcementService.getAll(
      {
        ...filters,
        scheduled_date: { $gt: currentDate },
      },
      null,
      { ...pageOpt }
    );

    res.status(200).json({
      message: `Scheduled projects retrieved successfully`,
      data: projects,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in retrieving scheduled announcements: ${error}`
    );
    next(error);
  }
};

const published = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;
    const currentDate = new Date();

    // Filter for announcements where scheduled_date is in the past
    const projects = await announcementService.getAll(
      {
        ...filters,
        scheduled_date: { $lte: currentDate },
      },
      null,
      { ...pageOpt }
    );

    res.status(200).json({
      message: `Published projects retrieved successfully`,
      data: projects,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in retrieving published announcements: ${error}`
    );
    next(error);
  }
};

const index = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;
    const announcements = await announcementService.getAll(
      { ...filters },
      null,
      pageOpt
    );
    res.status(200).json({
      message: `announcements Retrieved Successfully`,
      data: announcements,
    });
  } catch (error) {
    logger.log("error", `Error in retrieving user list method: ${error}`);
    next(error);
  }
};

export { create, update, remove, get, index, scheduled, published };
