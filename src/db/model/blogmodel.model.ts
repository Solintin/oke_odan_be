import { Schema, model, Document, Model, Date } from "mongoose";

export interface IBlog {
  title: string;
  author: string;
  scheduled_date: Date;
  images: string[];
  blog_detail?: string;
  slug: string;
  isPublished: boolean;
}

export interface IBlogDocument extends IBlog, Document {}

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    scheduled_date: { type: Date, required: true },
    images: { type: [String], required: true },
    blog_detail: { type: String },
    slug: { type: String, unique: true }, // Added unique constraint
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Pre-save middleware to auto-generate slug
BlogSchema.pre<IBlogDocument>("save", function (next) {
  if (this.isModified("title") || !this.slug) {
    // Convert title to lowercase, replace spaces with hyphens, and remove special chars
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, "-") // Replace spaces with -
      .replace(/[^\w\-]+/g, "") // Remove all non-word chars except -
      .replace(/\-\-+/g, "-") // Replace multiple - with single -
      .replace(/^-+/, "") // Trim - from start
      .replace(/-+$/, ""); // Trim - from end
  }
  next();
});

const BlogModel: Model<IBlogDocument> = model<IBlogDocument>(
  "Blog",
  BlogSchema
);

export default BlogModel;
