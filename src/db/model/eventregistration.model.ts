import { Schema, model, Document, Model, Types } from "mongoose";

export interface IEventRegistration {
  event: Types.ObjectId;
  name: string;
  address: string;
  phone: string;
  email?: string;
}

export interface IEventRegistrationDocument
  extends IEventRegistration,
    Document {}

const EventRegistrationSchema = new Schema<IEventRegistration>(
  {
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    name: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
  },
  {
    timestamps: true,
  }
);

const EventRegistrationModel: Model<IEventRegistrationDocument> =
  model<IEventRegistrationDocument>("EventRegistration", EventRegistrationSchema);

export default EventRegistrationModel;

