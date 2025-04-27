import { BadRequestError } from "@src/errors";
import { ClientSession, FilterQuery } from "mongoose";
import ArtisanModel, {
  IArtisan,
  IArtisanDocument,
} from "@src/db/model/artisan.model";
import createBaseService from "./base.service";
import HouseAgentModel, {
  IHouseAgentDocument,
} from "@src/db/model/agent.model";
import { UserType } from "@src/interfaces/enum.interface";

const artisanService = createBaseService<IArtisanDocument>(
  UserType.ARTISAN,
  ArtisanModel
);

const saveOrUpdate = async (
  data: Partial<IArtisan>,
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

export default { ...artisanService, saveOrUpdate };
