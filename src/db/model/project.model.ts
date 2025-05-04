import { ProjectStatus } from "@src/interfaces/enum.interface";
import { Schema, model, Document, Model } from "mongoose";
export interface IProject {
  title: string;
  location: string;
  image?: string;
  amount?: number;
  link?: string;
  status?: ProjectStatus;
}

export interface IProjectDocument extends IProject, Document {}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    location: { type: String, required: true },
    amount: { type: Number, default: 0.0, min: 0 },
    image: { type: String, default: "" },
    link: { type: String, default: "" },
    status: {
      type: String,
      enum: Object.values(ProjectStatus),
      default: ProjectStatus.Ongoing,
    },
  },
  {
    timestamps: true,
  }
);

const ProjectModel: Model<IProjectDocument> = model<IProjectDocument>(
  "Project",
  ProjectSchema
);

export default ProjectModel;
