import { IRequest } from "@src/interfaces/function.interface";
import DonationService from "@src/services/donation.service";
import logger from "@src/utils/logger";
import { Response, Request, NextFunction } from "express";

const create = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const { body: data } = req;
    const Donation = await DonationService.saveOrUpdate(data);
    res.status(201).json({
      message: `Donation Created Successfully`,
      data: Donation,
    });
  } catch (error) {
    logger.log("error", `Error in create Donation controller method: ${error}`);
    next(error);
  }
};
const update = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { donationId },
    } = req;

    const Donation = await DonationService.saveOrUpdate(data, {
      _id: donationId,
    });
    res.status(200).json({
      message: `Donation updated Successfully`,
      data: Donation,
    });
  } catch (error) {
    logger.log("error", `Error in update Donation controller method: ${error}`);
    next(error);
  }
};
const remove = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      body: data,
      paramIds: { donationId },
    } = req;

    const Donation = await DonationService.deleteOne({
      _id: donationId,
    });
    res.status(200).json({
      message: `Donation deleted Successfully`,
      data: Donation,
    });
  } catch (error) {
    logger.log("error", `Error in delete Donation controller method: ${error}`);
    next(error);
  }
};

const get = async (req: IRequest, res: Response, next: NextFunction) => {
  try {
    const {
      paramIds: { donationId },
    } = req;

    const populateData = [
      DonationService.generatePopulateData(
        "user",
        "firstName lastName email post"
      ),
    ];
    const Donation = await DonationService.getOrError(
      {
        _id: donationId,
      },
      populateData
    );
    res.status(200).json({
      message: `Donation Fetched Successfully`,
      data: Donation,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in fetching Donation controller method: ${error}`
    );
    next(error);
  }
};
const index = async (req: IRequest, res: Response, Next: NextFunction) => {
  try {
    const { filters, pageOpt } = req;
    const populateData = [
      DonationService.generatePopulateData(
        "user",
        "firstName lastName email post"
      ),
    ];
    const Donations = await DonationService.getAll(
      filters,
      populateData,
      pageOpt
    );
    res.status(200).json({
      message: `Donations Retrieved Successfully`,
      data: Donations,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in retrieving Donation controller method: ${error}`
    );
    Next(error);
  }
};
const getMyDonation = async (
  req: IRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { filters, pageOpt, user } = req;
    const populateData = [
      DonationService.generatePopulateData(
        "user",
        "firstName lastName email post"
      ),
    ];
    const Donations = await DonationService.getAll(
      { ...filters, user },
      populateData,
      pageOpt
    );
    res.status(200).json({
      message: `Donations Retrieved Successfully`,
      data: Donations,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in retrieving Donation controller method: ${error}`
    );
    next(error);
  }
};

export { create, update, remove, get, index, getMyDonation };
