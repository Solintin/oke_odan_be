import { BadRequestError } from "@src/errors";
import { ClientSession, FilterQuery } from "mongoose";
import createBaseService from "./base.service";
import EventModel, {
  IEvent,
  IEventDocument,
} from "@src/db/model/eventmodel.model";

const announcementService = createBaseService<IEventDocument>(
  "announcement",
  EventModel
);
const saveOrUpdate = async (
  data: Partial<IEvent>,
  filterQuery?: FilterQuery<IEventDocument>,
  session?: ClientSession
): Promise<IEventDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await EventModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await EventModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new EventModel({
        ...data,
      });
      await record.save({ session });
    }
    return record;
  } catch (error) {
    throw new BadRequestError("Error saving/updating record: " + error.message);
  }
};

export default { ...announcementService, saveOrUpdate };
