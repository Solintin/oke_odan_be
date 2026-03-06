import { IRequest } from "@src/interfaces/function.interface";
import eventService from "@src/services/event.service";
import eventRegistrationService from "@src/services/eventregistration.service";
import logger from "@src/utils/logger";
import { Response, Request, NextFunction } from "express";

const create = async (req: Request, res: Response, Next: NextFunction) => {
  try {
    const { body: data } = req;
    const event = await eventService.saveOrUpdate(data);
    res.status(201).json({
      message: `Event Created Successfully`,
      data: event,
    });
  } catch (error) {
    logger.log("error", `Error in create event controller method: ${error}`);
    Next(error);
  }
};
const update = async (req: IRequest, res: Response, Next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { eventId },
    } = req;

    const event = await eventService.saveOrUpdate(data, {
      _id: eventId,
    });
    res.status(200).json({
      message: `Event Updated Successfully`,
      data: event,
    });
  } catch (error) {
    logger.log("error", `Error in update event controller method: ${error}`);
    Next(error);
  }
};
const remove = async (req: IRequest, res: Response, Next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { eventId },
    } = req;

    const event = await eventService.deleteOne({
      _id: eventId,
    });
    res.status(200).json({
      message: `Event Deleted Successfully`,
      data: event,
    });
  } catch (error) {
    logger.log("error", `Error in delete event controller method: ${error}`);
    Next(error);
  }
};
const get = async (req: IRequest, res: Response, Next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { eventId },
    } = req;

    const event = await eventService.getOrError({
      _id: eventId,
    });
    res.status(200).json({
      message: `Event Fetched Successfully`,
      data: event,
    });
  } catch (error) {
    logger.log("error", `Error in fetching event controller method: ${error}`);
    Next(error);
  }
};
const index = async (req: IRequest, res: Response, Next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;

    const events = await eventService.getAll(filters, null, pageOpt);
    res.status(200).json({
      message: `Events Retrieved Successfully`,
      data: events,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in retrieving event controller method: ${error}`
    );
    Next(error);
  }
};
const registerInterest = async (
  req: IRequest,
  res: Response,
  Next: NextFunction
) => {
  try {
    const {
      body: data,
      paramIds: { eventId },
    } = req;

    // Ensure event exists
    const event = await eventService.getOrError({
      _id: eventId,
    });

    const registration = await eventRegistrationService.saveOrUpdate({
      ...data,
      event: event._id,
    });

    res.status(201).json({
      message: `Interest registered successfully`,
      data: registration,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in registerInterest event controller method: ${error}`
    );
    Next(error);
  }
};

const getRegistrations = async (
  req: IRequest,
  res: Response,
  Next: NextFunction
) => {
  try {
    const {
      paramIds: { eventId },
      filters,
      pageOpt,
    } = req;

    await eventService.getOrError({ _id: eventId });

    const registrations = await eventRegistrationService.getAll(
      { event: eventId, ...filters },
      null,
      pageOpt
    );

    res.status(200).json({
      message: `Registrations retrieved successfully`,
      data: registrations,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in getRegistrations event controller method: ${error}`
    );
    Next(error);
  }
};

export { create, update, remove, get, index, registerInterest, getRegistrations };
