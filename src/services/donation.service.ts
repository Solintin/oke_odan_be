import { BadRequestError } from "@src/errors";
import { FilterQuery } from "mongoose";
import BaseDocumentService from "./base.service";
import DonationModel, {
  IDonation,
  IDonationDocument,
} from "@src/db/model/donation.model";
import { donationType, statusType } from "@src/interfaces/enum.interface";
import ProgramModel from "@src/db/model/project.model";

// ✅ Fix: Use `IDonationDocument` Instead of `IDonation`
class DonationService extends BaseDocumentService<IDonationDocument> {
  private DonationModel = DonationModel;
  constructor() {
    super("Donation", DonationModel);
  }

  public async saveOrUpdate(
    data: Partial<IDonation>, // Allow partial data for updates
    filterQuery?: FilterQuery<IDonationDocument> // Optional filter for updates
  ): Promise<IDonationDocument> {
    let Donation;

    if (filterQuery) {
      const isExist = await this.DonationModel.findOne({
        ...filterQuery,
      });
      if (!isExist) {
        throw new BadRequestError("Donation not found");
      }
      if (
        isExist.donationType === donationType.Money &&
        data?.status === statusType.Successful
      ) {
        const getProgram = await ProgramModel.findById(data.programId);
        if (getProgram) {
          getProgram.currentRaised = getProgram.currentRaised + data.amount;
          if (getProgram.currentRaised >= getProgram.goal) {
            getProgram.isOnGoing = false;
          }
          await getProgram.save();
        }
      }
      Donation = await this.DonationModel.findOneAndUpdate(filterQuery, data, {
        new: true, // Return updated document
        runValidators: true, // Ensure validation
      });
    } else {
      if (data.donationType === donationType.Money && data.programId) {
        // const getProgram = await ProgramModel.findById(data.programId);
        // if (getProgram) {
        //   getProgram.currentRaised = getProgram.currentRaised + data.amount;
        //   await getProgram.save();
        // }
      }
      Donation = new this.DonationModel(data);
      await Donation.save();
    }

    return Donation;
  }
}

export default new DonationService();
