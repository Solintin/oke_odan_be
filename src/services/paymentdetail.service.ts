import PaymentModel, {
  IPaymentDetail,
  IPaymentDetailDocument,
} from "@src/db/model/paymentdetail.model";
import { BadRequestError } from "@src/errors";
import { ClientSession, FilterQuery } from "mongoose";
import createBaseService from "./base.service";

const PaymentDetailService = createBaseService<IPaymentDetailDocument>(
  "PaymentDetail",
  PaymentModel
);
const saveOrUpdate = async (
  data: Partial<IPaymentDetail>,
  filterQuery?: FilterQuery<IPaymentDetailDocument>,
  session?: ClientSession
): Promise<IPaymentDetailDocument> => {
  try {
    let record;
    if (filterQuery) {
      const existingRecord = await PaymentModel.findOne(filterQuery);
      if (!existingRecord) {
        throw new BadRequestError("record not found");
      }
      record = await PaymentModel.findOneAndUpdate(filterQuery, data, {
        new: true,
        runValidators: true,
        upsert: false,
      });
    } else {
      record = new PaymentModel({
        ...data,
      });
      await record.save({ session });
    }
    return record;
  } catch (error) {
    throw new BadRequestError("Error saving/updating record: " + error.message);
  }
};

export default { ...PaymentDetailService, saveOrUpdate };
