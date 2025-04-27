import LandlordModel, {
  ILandlord,
  ILandlordDocument,
} from "@src/db/model/landlord.model";
import { BadRequestError } from "@src/errors";
import { UserType } from "@src/interfaces/enum.interface";
// import { LandLordSignupData } from "@src/interfaces/auth.interface";
import { FilterQuery } from "mongoose";
import createBaseService from "./base.service";

const agentService = createBaseService<ILandlordDocument>(
  UserType.LANDLORD,
  LandlordModel
);

const saveOrUpdate = async (
  data: Partial<ILandlord>,
  filterQuery?: FilterQuery<ILandlordDocument>
): Promise<ILandlordDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await LandlordModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await LandlordModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new LandlordModel({
        ...data,
      });
      await record.save();
    }
    return record;
  } catch (error) {
    throw new BadRequestError("Error saving/updating record: " + error.message);
  }
};

export default { ...agentService, saveOrUpdate };
