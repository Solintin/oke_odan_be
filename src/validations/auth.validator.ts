import { BaseValidator } from "./index";
// import Joi, { ValidationResult } from 'joi';
import Joi, { ValidationResult } from "joi";
import { Request } from "express";
import {
  MemberStatus,
  PostEnum,
  UserType,
} from "@src/interfaces/enum.interface";

class AuthValidatorUtils extends BaseValidator {
  protected baseUserSchema = Joi.object({
    __t: Joi.string()
      .valid(...Object.values(UserType))
      .required()
      .messages({
        "any.only": "Invalid user type",
        "any.required": "User type is required",
      }),

    firstName: Joi.string().trim().min(2).max(100).required(),
    lastName: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().trim().lowercase().required().messages({
      "string.email": "Invalid email format",
      "any.required": "Email is required",
    }),
    password: Joi.string().trim().min(8).max(100).required().messages({
      "string.min": "Password must be at least 8 characters long",
      "string.max": "Password cannot exceed 100 characters",
      "string.pattern.base":
        "Password must include uppercase, lowercase, number, and special character",
      "any.required": "Password is required",
    }),
    phone: Joi.string().trim().optional().messages({
      "string.pattern.base": "Invalid phone number format",
    }),
    profileImage: Joi.string().uri().optional(),
    post: Joi.string()
      .valid(...Object.values(PostEnum))
      .optional(),
    status: Joi.string()
      .valid(...Object.values(MemberStatus))
      .optional(),
  });

  protected makeSchemaOptional(schema: Joi.ObjectSchema): Joi.ObjectSchema {
    const updateSchema = schema.fork(
      Object.keys(schema.describe().keys),
      (field) => field.optional()
    );

    return updateSchema;
  }
  public createUser = (req: Request): ValidationResult => {
    return this.validate(this.baseUserSchema, req.body);
  };

  public updateUser = (req: Request): ValidationResult => {
    const optionalSchema = this.makeSchemaOptional(this.baseUserSchema);
    return this.validate(optionalSchema, req.body);
  };

  protected resetPasswordSchema = this.baseUserSchema.append({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
    password: Joi.string().alphanum().min(6).required(),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .messages({
        "any.only": "Passwords do not match",
        "any.required": "Please confirm your password",
      }),
  });
  public ResetPassword = (req: Request): ValidationResult => {
    return this.validate(this.resetPasswordSchema, req.body);
  };
  protected forgotPasswordSchema = this.baseUserSchema.append({
    email: Joi.string().email().required(),
  });
  public ForgotPassword = (req: Request): ValidationResult => {
    return this.validate(this.forgotPasswordSchema, req.body);
  };

  public login = (req: Request): ValidationResult => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().trim().min(5).max(100).required(),
    });
    return this.validate(schema, req.body);
  };
}

export default new AuthValidatorUtils();

export interface ResetPasswordData {
  email: string;
  otp: string;
  password: string;
  confirmPassword: string;
}
