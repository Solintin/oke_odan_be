import DonationModel, {
  IDonation,
  IDonationDocument,
} from "@src/db/model/donation.model";
import { BadRequestError } from "@src/errors";
import { ClientSession, FilterQuery } from "mongoose";
import createBaseService from "./base.service";

const donationService = createBaseService<IDonationDocument>(
  "donation",
  DonationModel
);
const saveOrUpdate = async (
  data: Partial<IDonation>,
  filterQuery?: FilterQuery<IDonationDocument>,
  session?: ClientSession
): Promise<IDonationDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await DonationModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await DonationModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new DonationModel({
        ...data,
      });
      await record.save({ session });
    }
    return record;
  } catch (error) {
    throw new BadRequestError("Error saving/updating record: " + error.message);
  }
};

export default { ...donationService, saveOrUpdate };
