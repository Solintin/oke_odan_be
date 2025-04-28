import { BaseValidator } from "./index";
// import Joi, { ValidationResult } from 'joi';
import Joi, { ValidationResult } from "joi";
import { donationType, statusType } from "@src/interfaces/enum.interface";
import { Request } from "express";
import mongoose from "mongoose";

class DonatorValidatorUtils extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(3).max(100).required(),
      lastName: Joi.string().trim().min(3).max(100).required(),
      address: Joi.string().trim().min(5).max(255).required(),
      state: Joi.string().trim().min(3).max(100).required(),
      programId: Joi.string()
        .optional()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }),
      donationType: Joi.string()
        .valid(...Object.values(donationType))
        .required(),
      status: Joi.string()
        .valid(...Object.values(statusType))
        .optional(),
      amount: Joi.number()
        .precision(2)
        .positive()
        .when("donationType", {
          is: donationType.Money, // If donationType is "MONEY"
          then: Joi.required(), // amount becomes required
          otherwise: Joi.optional().allow(null), // else, optional (can be null/omitted)
        }),
      item: Joi.string()
        .trim()
        .max(100)
        .when("donationType", {
          is: donationType.Item, // If donationType is "ITEM"
          then: Joi.required(), // item becomes required
          otherwise: Joi.optional().allow(null), // else, optional (can be null/omitted)
        }),
      note: Joi.string().trim().min(3).optional(),
    });
    return this.validate(schema, req.body);
  };
  public update = (req: Request): ValidationResult => {
    const schema = Joi.object({
      firstName: Joi.string().trim().min(3).max(100).optional(),
      lastName: Joi.string().trim().min(3).max(100).optional(),
      address: Joi.string().trim().min(5).max(255).optional(),
      state: Joi.string().trim().min(3).max(100).optional(),
      donationType: Joi.string()
        .valid(...Object.values(donationType))
        .optional(),
      status: Joi.string()
        .valid(...Object.values(statusType))
        .optional(),
      programId: Joi.string()
        .optional()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }),
      amount: Joi.number().optional(),
      item: Joi.string().trim().min(3).max(100).optional(),
      note: Joi.string().trim().min(3).optional(),
    });
    return this.validate(schema, req.body);
  };
}

export default new DonatorValidatorUtils();
