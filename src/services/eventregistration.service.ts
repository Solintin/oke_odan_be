import { BadRequestError } from "@src/errors";
import { ClientSession, FilterQuery } from "mongoose";
import createBaseService from "./base.service";
import EventRegistrationModel, {
  IEventRegistration,
  IEventRegistrationDocument,
} from "@src/db/model/eventregistration.model";

const eventRegistrationService = createBaseService<IEventRegistrationDocument>(
  "EventRegistration",
  EventRegistrationModel
);

const saveOrUpdate = async (
  data: Partial<IEventRegistration>,
  filterQuery?: FilterQuery<IEventRegistrationDocument>,
  session?: ClientSession
): Promise<IEventRegistrationDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await EventRegistrationModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await EventRegistrationModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new EventRegistrationModel({
        ...data,
      });
      await record.save({ session });
    }
    return record;
  } catch (error) {
    throw new BadRequestError("Error saving/updating record: " + error.message);
  }
};

export default { ...eventRegistrationService, saveOrUpdate };

