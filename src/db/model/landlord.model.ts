import { Schema, Document, Model } from "mongoose";
import UserModel, { IUser } from "./user.model";
import { Relationship, UserType } from "@src/interfaces/enum.interface";
import { INOK } from "@src/interfaces/function.interface";

// House Agent Interface
export interface ILandlord extends IUser {
  numberOfHousesOwned: number;
  utilityBillImage: string;
  homeAddress: string;
  yoe: string; // Years of Experience
  availableOnDemand: boolean;
  next_of_kin: INOK;
}

// Mongoose Document Interface
export interface ILandlordDocument extends ILandlord, Document {}

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
const LandlordSchema = new Schema<ILandlord>(
  {
    homeAddress: { type: String, required: true },
    numberOfHousesOwned: { type: Number, required: true },
    yoe: { type: String, required: true }, // Years of Experience
    availableOnDemand: { type: Boolean, default: false },
    utilityBillImage: { type: String, required: true },
    next_of_kin: { type: NextOfKinSchema, required: true },
  },
  { timestamps: true }
);

const LandlordModel: Model<ILandlordDocument> =
  UserModel.discriminator<ILandlordDocument>(UserType.LANDLORD, LandlordSchema);

export default LandlordModel;
