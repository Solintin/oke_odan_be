import { IRequest } from "@src/interfaces/function.interface";
import DonationService from "@src/services/donation.service";
import logger from "@src/utils/logger";
import { Response, Request, NextFunction } from "express";

class DonationController {
  public async create(
    req: Request,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const { body: data } = req;
      const Donation = await DonationService.saveOrUpdate(data);
      return res.status(201).json({
        message: `Donation Created Successfully`,
        data: Donation,
      });
    } catch (error) {
      logger.log(
        "error",
        `Error in create Donation controller method: ${error}`
      );
      Next(error);
    }
  }
  public async update(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: data,
        paramIds: { donationId },
      } = req;

      const Donation = await DonationService.saveOrUpdate(data, {
        _id: donationId,
      });
      return res.status(200).json({
        message: `Donation updated Successfully`,
        data: Donation,
      });
    } catch (error) {
      logger.log(
        "error",
        `Error in update Donation controller method: ${error}`
      );
      Next(error);
    }
  }
  public async delete(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: data,
        paramIds: { donationId },
      } = req;

      const Donation = await DonationService.deleteOne({
        _id: donationId,
      });
      return res.status(200).json({
        message: `Donation deleted Successfully`,
        data: Donation,
      });
    } catch (error) {
      logger.log(
        "error",
        `Error in delete Donation controller method: ${error}`
      );
      Next(error);
    }
  }

  public async get(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: data,
        paramIds: { donationId },
      } = req;

      const populateData = [
        DonationService.generatePopulateData(
          "programId",
          "title goal currentRaised isPublished isOnGoing"
        ),
      ];
      const Donation = await DonationService.getOrError(
        {
          _id: donationId,
        },
        populateData
      );
      return res.status(200).json({
        message: `Donation Fetched Successfully`,
        data: Donation,
      });
    } catch (error) {
      logger.log(
        "error",
        `Error in fetching Donation controller method: ${error}`
      );
      Next(error);
    }
  }
  public async index(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const { filters, pageOpt } = req;
      const Donations = await DonationService.getAll(filters, null, pageOpt);
      return res.status(200).json({
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
  }
}

export default DonationController;
