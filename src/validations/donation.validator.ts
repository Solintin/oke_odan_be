import { BaseValidator } from "./index";
// import Joi, { ValidationResult } from 'joi';
import Joi, { ValidationResult } from "joi";
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
