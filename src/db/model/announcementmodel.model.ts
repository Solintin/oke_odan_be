import { Schema, model, Document, Model } from "mongoose";

export interface IAnnouncement {
  title: string;
  author: string;
  scheduled_date: Date;
  images: string[];
  announcement_detail?: string;
  slug: string;
}

export interface IAnnouncementDocument extends IAnnouncement, Document {
  status: "Scheduled" | "Published"; // Add virtual property to interface
}

const announcementSchema = new Schema<IAnnouncement>(
  {
    title: { type: String },
    author: { type: String },
    scheduled_date: { type: Date },
    images: { type: [String] },
    announcement_detail: { type: String },
    slug: { type: String, unique: true },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Add virtual status field
announcementSchema
  .virtual("status")
  .get(function (this: IAnnouncementDocument) {
    // Convert both dates to milliseconds for comparison
    const scheduledTime = this.scheduled_date?.getTime();
    const currentTime = Date.now();
    return scheduledTime > currentTime ? "Scheduled" : "Published";
  });

// Pre-save middleware to auto-generate slug
announcementSchema.pre<IAnnouncementDocument>("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w\-]+/g, "")
      .replace(/\-\-+/g, "-")
      .replace(/^-+/, "")
      .replace(/-+$/, "");
  }
  next();
});

const AnnouncementModel: Model<IAnnouncementDocument> =
  model<IAnnouncementDocument>("announcement", announcementSchema);

export default AnnouncementModel;
