import { Id } from "@src/interfaces/function.interface";
import { Schema, model, Document, Model, SchemaTypes } from "mongoose";

export interface IDonation {
  user: Id;
  amount: number;
  note: string;
}

export interface IDonationDocument extends IDonation, Document {}

const DonationSchema = new Schema<IDonation>(
  {
    amount: { type: Number, default: 0.0, required: true },
    note: { type: String, default: null },
    user: { type: SchemaTypes.ObjectId, ref: "User" },
  },
  { timestamps: true } // ✅ Ensures `createdAt` and `updatedAt`
);

const DonationModel: Model<IDonationDocument> = model<IDonationDocument>(
  "Donation",
  DonationSchema
);

export default DonationModel;
