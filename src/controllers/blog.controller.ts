import { IRequest } from "@src/interfaces/function.interface";
import blogService from "@src/services/blog.service";
import logger from "@src/utils/logger";
import { Response, Request, NextFunction } from "express";

class blogController {
  public async create(
    req: Request,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const { body: data } = req;
      const blog = await blogService.saveOrUpdate(data);
      return res.status(201).json({
        message: `blog Created Successfully`,
        data: blog,
      });
    } catch (error) {
      logger.log("error", `Error in create blog controller method: ${error}`);
      Next(error);
    }
  }
  public async update(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: data,
        paramIds: { blogId },
      } = req;

      const blog = await blogService.saveOrUpdate(data, {
        _id: blogId,
      });
      return res.status(200).json({
        message: `blog Updated Successfully`,
        data: blog,
      });
    } catch (error) {
      logger.log("error", `Error in update blog controller method: ${error}`);
      Next(error);
    }
  }
  public async delete(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: data,
        paramIds: { blogId },
      } = req;

      const blog = await blogService.deleteOne({
        _id: blogId,
      });
      return res.status(200).json({
        message: `blog Deleted Successfully`,
        data: blog,
      });
    } catch (error) {
      logger.log("error", `Error in delete blog controller method: ${error}`);
      Next(error);
    }
  }
  public async get(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const {
        body: data,
        paramIds: { blogId },
      } = req;

      const blog = await blogService.getOrError({
        _id: blogId,
      });
      return res.status(200).json({
        message: `blog Fetched Successfully`,
        data: blog,
      });
    } catch (error) {
      logger.log("error", `Error in fetching blog controller method: ${error}`);
      Next(error);
    }
  }
  public async index(
    req: IRequest,
    res: Response,
    Next: NextFunction
  ): Promise<Response> {
    try {
      const { filters, pageOpt } = req;

      const blogs = await blogService.getAll(filters, null, pageOpt);
      return res.status(200).json({
        message: `blogs Retrieved Successfully`,
        data: blogs,
      });
    } catch (error) {
      logger.log(
        "error",
        `Error in retrieving blog controller method: ${error}`
      );
      Next(error);
    }
  }
}

export default blogController;
