import { BadRequestError } from "@src/errors";
import { ClientSession, FilterQuery } from "mongoose";
import CareTakerAgentModel, {
  ICareTakerAgent,
  ICareTakerAgentDocument,
} from "@src/db/model/caretaker.model";
import { UserType } from "@src/interfaces/enum.interface";
import createBaseService from "./base.service";

const agentService = createBaseService<ICareTakerAgentDocument>(
  UserType.CARETAKER,
  CareTakerAgentModel
);

const saveOrUpdate = async (
  data: Partial<ICareTakerAgent>,
  filterQuery?: FilterQuery<ICareTakerAgentDocument>
): Promise<ICareTakerAgentDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await CareTakerAgentModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await CareTakerAgentModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new CareTakerAgentModel({
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
