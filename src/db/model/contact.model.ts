import { Schema, model, Document, Model } from "mongoose";

export interface IContact {
  subject: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  message: string;
}

export interface IContactDocument extends IContact, Document {}

const ContactSchema = new Schema<IContact>(
  {
    subject: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const ContactModel: Model<IContactDocument> = model<IContactDocument>(
  "Contact",
  ContactSchema
);

export default ContactModel;
