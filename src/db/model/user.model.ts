import { Schema, model, Document, Model } from "mongoose";
import bcrpyt from "bcryptjs";
import { authConfig } from "@src/configs";
import {
  MemberStatus,
  PostEnum,
  UserType,
} from "@src/interfaces/enum.interface";
export interface IUser {
  __t: UserType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  profileImage?: string;
  post?: PostEnum;
  status?: MemberStatus;
}

export interface IUserDocument extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { unique: true, type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    __t: {
      type: String,
      enum: Object.values(UserType),
      required: true,
    },
    post: {
      type: String,
      enum: Object.values(PostEnum),
      default: PostEnum.MEMBER,
    },
    status: {
      type: String,
      enum: Object.values(MemberStatus),
      default: MemberStatus.Pending,
    },
  },
  { timestamps: true, discriminatorKey: "__t" }
);

UserSchema.pre<IUserDocument>("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrpyt.genSalt(authConfig.BCRYPT_SALT_ROUNDS);
      this.password = await bcrpyt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    return next(error);
  }
});

UserSchema.set("toJSON", {
  transform(_, ret) {
    delete ret.password;
  },
});

const UserModel: Model<IUserDocument> = model<IUserDocument>(
  "User",
  UserSchema
);

export default UserModel;
