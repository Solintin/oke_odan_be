import { Schema, Document, Model } from "mongoose";
import UserModel, { IUser } from "./user.model";
import {
  Relationship,
  ServiceType,
  UserType,
} from "@src/interfaces/enum.interface";
import { INOK } from "@src/interfaces/function.interface";

// House Agent Interface
export interface IArtisan extends IUser {
  skill: ServiceType;
  portfolioImages: [string];
  homeAddress: string;
  yoe: string; // Years of Experience
  availableOnDemand: boolean;
  next_of_kin: INOK;
}

// Mongoose Document Interface
export interface IArtisanDocument extends IArtisan, Document {}

// Define Next of Kin (NOK) Schema
const NextOfKinSchema = new Schema<INOK>(
  {
    fullName: { type: String, trim: true },
    relationship: {
      type: String,
      enum: Object.values(Relationship),
      required: false,
    },
    phone: { type: String, trim: true },
    email: { type: String, trim: true },
    address: { type: String, required: true },
    identifierImage: { type: String, required: true },
  },
  { _id: false }
);

// Define House Agent Schema
const ArtisanSchema = new Schema<IArtisan>(
  {
    skill: { type: String, enum: Object.values(ServiceType), required: true },
    homeAddress: { type: String, required: true },
    yoe: { type: String, required: true }, // Years of Experience
    availableOnDemand: { type: Boolean, default: false },
    portfolioImages: { type: [String], required: true },
    next_of_kin: { type: NextOfKinSchema, required: true },
  },
  { timestamps: true }
);

const ArtisanModel: Model<IArtisanDocument> =
  UserModel.discriminator<IArtisanDocument>(UserType.ARTISAN, ArtisanSchema);

export default ArtisanModel;
