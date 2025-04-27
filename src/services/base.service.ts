import { NotFoundError } from "@src/errors";
import {
  PageOptions,
  PaginatedResult,
} from "@src/interfaces/function.interface";
import {
  ClientSession,
  FilterQuery,
  Model,
  PopulateOptions,
  SortOrder,
  Document,
} from "mongoose";

export interface SortBy<T> {
  field?: keyof T;
  order?: SortOrder;
}

export interface DocumentWithTimeStamp extends Document {
  createdAt?: Date;
  updatedAt?: Date;
  initiated?: Date;
}

const createBaseService = <T extends DocumentWithTimeStamp>(
  resourceName: string,
  resourceModel: Model<T>,
  defaultSorting: SortBy<T> = { field: "createdAt", order: "desc" }
) => {
  const count = async (
    filterQuery: FilterQuery<T>,
    session?: ClientSession
  ): Promise<number> => {
    return await resourceModel.countDocuments(filterQuery, session);
  };

  const getAll = async (
    filterQuery: FilterQuery<T> = {},
    populateData?: PopulateOptions[],
    pageOpt: PageOptions = { sort: defaultSorting as any, page: 1, limit: 10 }
  ): Promise<PaginatedResult<T>> => {
    const field = pageOpt.sort?.field || defaultSorting.field;
    const order = pageOpt.sort?.order || defaultSorting.order;
    const limit = Math.max(1, pageOpt.limit || 10);
    const page = Math.max(1, pageOpt.page || 1);
    const skip = (page - 1) * limit;

    const totalRecords = await resourceModel.countDocuments(filterQuery);
    const totalPages = Math.ceil(totalRecords / limit);

    const records = await resourceModel
      .find(filterQuery)
      .populate(populateData)
      .sort({ [field]: order })
      .skip(skip)
      .limit(limit);

    return {
      data: records,
      pagination: {
        totalRecords,
        totalPages,
        currentPage: page,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  };

  const getOrError = async (
    filterQuery?: FilterQuery<T>,
    populateData?: PopulateOptions[],
    session?: ClientSession
  ): Promise<T> => {
    const record = await resourceModel
      .findOne(filterQuery, null, { session })
      .populate(populateData);
    if (!record) throw new NotFoundError(`${resourceName} not found`);
    return record as T;
  };

  const deleteOne = async (
    filterQuery: FilterQuery<T>,
    session?: ClientSession
  ): Promise<T> => {
    const record = await resourceModel.findOneAndDelete(filterQuery, {
      session,
    });
    if (!record) throw new NotFoundError(`${resourceName} not found`);
    return record;
  };

  const generatePopulateData = (
    field: string,
    attributes?: unknown,
    populateData?: PopulateOptions[],
    virtualPopulateOption?: { localField?: string; foreignField?: string }
  ): PopulateOptions => {
    return {
      path: field,
      ...(attributes && { select: attributes }),
      ...(populateData && { populate: populateData }),
      ...(virtualPopulateOption?.localField && {
        localField: virtualPopulateOption.localField,
      }),
      ...(virtualPopulateOption?.foreignField && {
        foreignField: virtualPopulateOption.foreignField,
      }),
    };
  };

  return { count, getAll, getOrError, deleteOne, generatePopulateData };
};

export default createBaseService;
