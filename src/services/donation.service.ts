import { IUser, IUserDocument } from "@src/db/model/user.model";
import { BadRequestError } from "@src/errors";
import { UserType } from "@src/interfaces/enum.interface";
import { ClientSession, FilterQuery } from "mongoose";
import UserModel from "../db/model/user.model";
import createBaseService from "./base.service";

const donationService = createBaseService<IUserDocument>(
  UserType.USER,
  UserModel
);
const saveOrUpdate = async (
  data: Partial<IUser>,
  filterQuery?: FilterQuery<IUserDocument>,
  session?: ClientSession
): Promise<IUserDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await UserModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await UserModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new UserModel({
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
