import { BadRequestError } from "@src/errors";
// import { LandLordSignupData } from "@src/interfaces/auth.interface";
import { FilterQuery } from "mongoose";
import HouseAgentModel, {
  IProject,
  IProjectDocument,
} from "@src/db/model/project.model";
import createBaseService from "./base.service";
import ProjectModel from "@src/db/model/project.model";

const agentService = createBaseService<IProjectDocument>(
  "Project",
  ProjectModel
);

const saveOrUpdate = async (
  data: Partial<IProject>,
  filterQuery?: FilterQuery<IProjectDocument>
): Promise<IProjectDocument> => {
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
