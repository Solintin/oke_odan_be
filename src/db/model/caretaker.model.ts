import { Schema, Document, Model } from "mongoose";
import UserModel, { IUser } from "./user.model";
import {
  AgentAssociation,
  AgentType,
  Relationship,
  UserType,
} from "@src/interfaces/enum.interface";
import { INOK } from "@src/interfaces/function.interface";

// House Agent Interface
export interface ICareTakerAgent extends IUser {
  caretaker_association: AgentAssociation | "Independent";
  businessLocation: string;
  license_number: string;
  businessRegImage: string;
  professionalCertImage: string;
  homeAddress: string;
  yoe: string; // Years of Experience
  availableOnDemand: boolean;
  referenceLetters: string[];
  next_of_kin: INOK;
}

// Mongoose Document Interface
export interface ICareTakerAgentDocument extends ICareTakerAgent, Document {}

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
const CaretakerSchema = new Schema<ICareTakerAgent>(
  {
    businessLocation: { type: String, required: true },
    license_number: { type: String, required: true },
    businessRegImage: { type: String, required: true },
    professionalCertImage: { type: String, required: true },
    homeAddress: { type: String, required: true },
    yoe: { type: String, required: true }, // Years of Experience
    availableOnDemand: { type: Boolean, default: false },
    referenceLetters: { type: [String], required: true },
    next_of_kin: { type: NextOfKinSchema, required: true },
  },
  { timestamps: true }
);

// Create House Agent Model using Discriminator
const CareTakerAgentModel: Model<ICareTakerAgentDocument> =
  UserModel.discriminator<ICareTakerAgentDocument>(
    UserType.CARETAKER,
    CaretakerSchema
  );

export default CareTakerAgentModel;
