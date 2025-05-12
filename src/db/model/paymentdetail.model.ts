import { Schema, model, Document, Model } from "mongoose";

export interface IPaymentDetail {
  accountNumber: string;
  accountName: string;
  accountBank: string;
}

export interface IPaymentDetailDocument extends IPaymentDetail, Document {}

const PaymentDetailSchema = new Schema<IPaymentDetail>(
  {
    accountNumber: { type: String, required: true },
    accountName: { type: String, required: true },
    accountBank: { type: String, required: true },
  },
  { timestamps: true } // ✅ Ensures `createdAt` and `updatedAt`
);

const PaymentDetailModel: Model<IPaymentDetailDocument> =
  model<IPaymentDetailDocument>("PaymentDetail", PaymentDetailSchema);

export default PaymentDetailModel;
