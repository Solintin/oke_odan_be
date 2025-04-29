import {
  IAnnouncement,
  IAnnouncementDocument,
} from "@src/db/model/announcementmodel.model";
import { BadRequestError } from "@src/errors";
import { ClientSession, FilterQuery } from "mongoose";
import AnnouncementModel from "../db/model/announcementmodel.model";
import createBaseService from "./base.service";

const announcementService = createBaseService<IAnnouncementDocument>(
  "announcement",
  AnnouncementModel
);
const saveOrUpdate = async (
  data: Partial<IAnnouncement>,
  filterQuery?: FilterQuery<IAnnouncementDocument>,
  session?: ClientSession
): Promise<IAnnouncementDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await AnnouncementModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await AnnouncementModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new AnnouncementModel({
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
