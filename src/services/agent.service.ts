import { BadRequestError } from "@src/errors";
// import { LandLordSignupData } from "@src/interfaces/auth.interface";
import { ClientSession, FilterQuery } from "mongoose";
import HouseAgentModel, {
  IHouseAgent,
  IHouseAgentDocument,
} from "@src/db/model/agent.model";
import createBaseService from "./base.service";
import { UserType } from "@src/interfaces/enum.interface";

const agentService = createBaseService<IHouseAgentDocument>(
  UserType.HOUSE_AGENT,
  HouseAgentModel
);

const saveOrUpdate = async (
  data: Partial<IHouseAgent>,
  filterQuery?: FilterQuery<IHouseAgentDocument>
): Promise<IHouseAgentDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await HouseAgentModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await HouseAgentModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new HouseAgentModel({
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
