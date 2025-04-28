import { donationType, statusType } from "@src/interfaces/enum.interface";
import { Id } from "@src/interfaces/function.interface";
import { Schema, model, Document, Model, SchemaTypes } from "mongoose";

export interface IDonation {
  firstName: string;
  lastName: string;
  address: string;
  state: string;
  programId: Id;
  donationType: donationType;
  status: statusType;
  amount: number;
  item: string;
  note: string;
}

export interface IDonationDocument extends IDonation, Document {}

const DonationSchema = new Schema<IDonation>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    donationType: {
      type: String,
      enum: Object.values(donationType),
      default: null,
    },
    status: {
      type: String,
      enum: Object.values(statusType),
      default: statusType.Pending,
    },
    amount: { type: Number, default: null },
    note: { type: String, default: null },
    item: { type: String, default: null },
    programId: { type: SchemaTypes.ObjectId, ref: "program" },
  },
  { timestamps: true } // ✅ Ensures `createdAt` and `updatedAt`
);

const DonationModel: Model<IDonationDocument> = model<IDonationDocument>(
  "Donation",
  DonationSchema
);

export default DonationModel;
