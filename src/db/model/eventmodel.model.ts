import { Schema, model, Document, Model, Date } from "mongoose";

export enum eventType {
  Physical = "Physical",
  Virtual = "Virtual",
}
export interface IEvent {
  title: string;
  address: string;
  state: string;
  city: string;
  link: string;
  type: string;
  country: string;
  event_date: Date;
  images: string[];
  description?: string;
  isPublished: boolean;
  isOnGoing: boolean;
}

export interface IEventDocument extends IEvent, Document {}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    link: { type: String },
    type: {
      type: String,
      enum: Object.values(eventType),
      required: true,
    },
    event_date: { type: Date, required: true },
    images: { type: [String], required: true },
    description: { type: String },
    isPublished: { type: Boolean, default: false },
    isOnGoing: { type: Boolean, default: true },
  },
  { timestamps: true } // ✅ Ensures `createdAt` and `updatedAt`
);

const EventModel: Model<IEventDocument> = model<IEventDocument>(
  "Event",
  EventSchema
);

export default EventModel;
