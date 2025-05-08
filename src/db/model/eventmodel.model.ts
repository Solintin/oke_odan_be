import { Schema, model, Document, Model, Date } from "mongoose";

export interface IEvent {
  title: string;
  address: string;
  state: string;
  city: string;
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
    country: { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
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
