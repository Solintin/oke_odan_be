import { BadRequestError } from "@src/errors";
// import { LandLordSignupData } from "@src/interfaces/auth.interface";
import { FilterQuery } from "mongoose";
import ProjectModel, {
  IProject,
  IProjectDocument,
} from "@src/db/model/project.model";
import createBaseService from "./base.service";
import { ProjectStatus } from "@src/interfaces/enum.interface";

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
      const existingRecord = await ProjectModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await ProjectModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new ProjectModel({
        ...data,
      });
      await record.save();
    }
    return record;
  } catch (error) {
    throw new BadRequestError("Error saving/updating record: " + error.message);
  }
};

const getProjectOverviewMetrics = async () => {
  const [projectsResult, ongoingResult, completedResult, cancelResult] =
    await Promise.all([
      ProjectModel.aggregate([{ $count: "count" }]),

      ProjectModel.aggregate([
        { $match: { status: ProjectStatus.Ongoing } },
        { $count: "count" },
      ]),
      ProjectModel.aggregate([
        { $match: { status: ProjectStatus.Completed } },
        { $count: "count" },
      ]),
      ProjectModel.aggregate([
        { $match: { status: ProjectStatus.Cancel } },
        { $count: "count" },
      ]),
    ]);

  return {
    total: projectsResult[0]?.count || 0,
    ongoing: ongoingResult[0]?.count || 0,
    completed: completedResult[0]?.count || 0,
    cancel: cancelResult[0]?.count || 0,
  };
};

export default { ...agentService, saveOrUpdate, getProjectOverviewMetrics };
