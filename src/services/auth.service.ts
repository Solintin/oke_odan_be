import UserModel, { IUser, IUserDocument } from "@src/db/model/user.model";
import {
  ApplicationError,
  BadRequestError,
  ConflictError,
  NotFoundError,
} from "@src/errors";
import bcrpyt from "bcryptjs";
import createBaseService from "./base.service";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";
import { DecodedAuthToken } from "@src/interfaces/function.interface";
import { UserType } from "@src/interfaces/enum.interface";
import UserService from "@src/services/user.service";
import { mailQueue } from "@src/utils/queueManager";
import helperUtil from "@src/utils/helperUtil";
import {
  MailTemplates,
  ResetPasswordData,
} from "@src/interfaces/mail.interface";

const authService = createBaseService<IUserDocument>("User", UserModel);

const AuthEncryptKey = fs
  .readFileSync(path.join(process.cwd(), "private.key"))
  .toString();

const signUp = async (
  data: IUser,
  userType: UserType
): Promise<IUserDocument> => {
  const isExist = await UserModel.findOne({ email: data.email });
  if (isExist) {
    throw new BadRequestError("User already exists");
  }
  let user: any;
  switch (userType) {
    case UserType.USER:
      user = await UserService.saveOrUpdate(data);
      break;

    default:
      throw new ApplicationError(500, "Invalid User Type");
  }

  return user;
};

const getUserForLogin = async (
  email: string,
  password: string
): Promise<IUserDocument> => {
  const user = await UserModel.findOne({ email }).select("+password");
  if (!user || !validatePassword(user, password)) {
    throw new BadRequestError("Email or password is incorrect");
  }
  return user;
};

const login = async (user: IUserDocument) => {
  const { password, ...userPayload } = user.toObject();
  const accessToken = generateAccessToken(userPayload as IUserDocument);
  return { user, accessToken };
};

const validatePassword = (user: IUserDocument, password: string) => {
  try {
    return bcrpyt.compareSync(password, user.password);
  } catch (error) {
    return false;
  }
};

const generateAccessToken = (user: IUserDocument): string => {
  return jwt.sign({ ...user }, AuthEncryptKey, {
    algorithm: "RS256",
    expiresIn: "1h",
  });
};

const verifyAccessToken = (token: string): DecodedAuthToken => {
  try {
    const payload = jwt.verify(
      token,
      AuthEncryptKey
    ) as unknown as IUserDocument;
    return { payload, expired: false };
  } catch (error) {
    return {
      payload: null,
      expired: error.message.includes("expired") ? error.message : error,
    };
  }
};
async function forgotPassword(email: string) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new NotFoundError(`User with email '${email}' does not exist.`);
  }

  const token = helperUtil.generateOtp();

  await mailQueue.addJob({
    to: user.email,
    templateName: MailTemplates.forgotPassword,
    replacements: {
      user,
      token,
    },
  });

  return user;
}

async function resetPassword(data: ResetPasswordData) {
  const user = await this.UserModel.findOne({ email: data.email }).select(
    "+password"
  );
  const isValid = helperUtil.verifyOtp(data.otp, 5);

  if (!isValid) {
    throw new BadRequestError("Invalid OTP");
  }

  const { confirmPassword } = data;

  if (this.validatePassword(user, confirmPassword)) {
    throw new ConflictError("Current password cannot be used as new password.");
  }

  await user.set("password", confirmPassword).save();

  const currentDate = new Date();

  // Format to dd/mm/yy - hh:mm:ss
  const formattedDate =
    [
      currentDate.getDate().toString().padStart(2, "0"),
      (currentDate.getMonth() + 1).toString().padStart(2, "0"),
      currentDate.getFullYear().toString().slice(-2),
    ].join("/") +
    " - " +
    [
      currentDate.getHours().toString().padStart(2, "0"),
      currentDate.getMinutes().toString().padStart(2, "0"),
      currentDate.getSeconds().toString().padStart(2, "0"),
    ].join(":");
  await mailQueue.addJob({
    to: user.email,
    templateName: MailTemplates.passwordResetCompleted,
    replacements: {
      user,
      currentDate: formattedDate,
    },
  });

  return user;
}

export default {
  ...authService,
  signUp,
  getUserForLogin,
  login,
  validatePassword,
  verifyAccessToken,
  forgotPassword,
  resetPassword,
};
