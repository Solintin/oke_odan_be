import { BadRequestError } from "@src/errors";
import { FilterQuery } from "mongoose";
import BaseDocumentService from "./base.service";
import BlogModel, { IBlog, IBlogDocument } from "@src/db/model/blogmodel.model";

// ✅ Fix: Use `IBlogDocument` Instead of `IBlog`
class BlogService extends BaseDocumentService<IBlogDocument> {
  private BlogModel = BlogModel;
  constructor() {
    super("Blog", BlogModel);
  }

  public async saveOrUpdate(
    data: Partial<IBlog>, // Allow partial data for updates
    filterQuery?: FilterQuery<IBlogDocument> // Optional filter for updates
  ): Promise<IBlogDocument> {
    let Blog;

    if (filterQuery) {
      const isExist = await this.BlogModel.findOne({
        ...filterQuery,
      });
      if (!isExist) {
        throw new BadRequestError("Blog not found");
      }
      Blog = await this.BlogModel.findOneAndUpdate(filterQuery, data, {
        new: true, // Return updated document
        runValidators: true, // Ensure validation
      });
    } else {
      Blog = new this.BlogModel(data);
      await Blog.save();
    }

    return Blog;
  }
}

export default new BlogService();
