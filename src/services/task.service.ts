import TaskModel, { ITask, ITaskDocument } from "@src/db/model/task.model";
import { BadRequestError } from "@src/errors";
import { FilterQuery } from "mongoose";
import createBaseService from "./base.service";

const taskService = createBaseService<ITaskDocument>("Task", TaskModel);

const saveOrUpdate = async (
  data: Partial<ITask>,
  filterQuery?: FilterQuery<ITaskDocument>
): Promise<ITaskDocument> => {
  try {
    let task;
    if (filterQuery) {
      const existingTask = await TaskModel.findOne(filterQuery);
      if (!existingTask) {
        throw new BadRequestError("Task not found");
      }
      task = await TaskModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      task = new TaskModel({
        ...data,
      });
      await task.save();
    }
    return task;
  } catch (error) {
    throw new BadRequestError("Error saving/updating task: " + error.message);
  }
};

export default { ...taskService, saveOrUpdate };
