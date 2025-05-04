import { IRequest } from "@src/interfaces/function.interface";
import logger from "@src/utils/logger";
import { Response, NextFunction } from "express";
import ContactService from "@src/services/contact.service";
import { IContact } from "@src/db/model/contact.model";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data } = req;
    const payload: IContact = { ...data };
    const new_user = await ContactService.saveOrUpdate(payload);

    res
      .status(201)
      .json({ message: "Contact Created Successfully", data: new_user });
  } catch (error) {
    logger.log("error", `Error in create user controller method: ${error}`);
    next(error);
  }
};

const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { ContactId },
    } = req;
    const Contact = await ContactService.saveOrUpdate(data, {
      _id: ContactId,
    });
    res.status(200).json({
      message: "Contact updated Successfully",
      data: Contact,
    });
  } catch (error) {
    logger.log("error", `Error in update Contact controller method: ${error}`);
    next(error);
  }
};

const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { ContactId },
    } = req;
    const Contact = await ContactService.deleteOne({
      _id: ContactId,
    });
    res.status(200).json({
      message: `Contact deleted Successfully`,
      data: Contact,
    });
  } catch (error) {
    logger.log("error", `Error in delete Contact controller method: ${error}`);
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { ContactId },
    } = req;
    const Contact = await ContactService.getOrError({
      _id: ContactId,
    });
    res.status(200).json({
      message: `Contact Fetched Successfully`,
      data: Contact,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in fetching Contact controller method: ${error}`
    );
    next(error);
  }
};

const scheduled = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;
    const currentDate = new Date();

    // Filter for Contacts where scheduled_date is in the future
    const projects = await ContactService.getAll(
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
    logger.log("error", `Error in retrieving scheduled Contacts: ${error}`);
    next(error);
  }
};

const published = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;
    const currentDate = new Date();

    // Filter for Contacts where scheduled_date is in the past
    const projects = await ContactService.getAll(
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
    logger.log("error", `Error in retrieving published Contacts: ${error}`);
    next(error);
  }
};

const index = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;
    const Contacts = await ContactService.getAll({ ...filters }, null, pageOpt);
    res.status(200).json({
      message: `Contacts Retrieved Successfully`,
      data: Contacts,
    });
  } catch (error) {
    logger.log("error", `Error in retrieving user list method: ${error}`);
    next(error);
  }
};

export { create, update, remove, get, index, scheduled, published };
