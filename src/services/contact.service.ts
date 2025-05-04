import { IContact, IContactDocument } from "@src/db/model/contact.model";
import { BadRequestError } from "@src/errors";
import { ClientSession, FilterQuery } from "mongoose";
import ContactModel from "../db/model/contact.model";
import createBaseService from "./base.service";

const ContactService = createBaseService<IContactDocument>(
  "Contact",
  ContactModel
);
const saveOrUpdate = async (
  data: Partial<IContact>,
  filterQuery?: FilterQuery<IContactDocument>,
  session?: ClientSession
): Promise<IContactDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await ContactModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await ContactModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new ContactModel({
        ...data,
      });
      await record.save({ session });
    }
    return record;
  } catch (error) {
    throw new BadRequestError("Error saving/updating record: " + error.message);
  }
};

export default { ...ContactService, saveOrUpdate };
