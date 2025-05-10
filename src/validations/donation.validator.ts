import { BaseValidator } from "./index";
// import Joi, { ValidationResult } from 'joi';
import Joi, { ValidationResult } from "joi";
import { Request } from "express";
import mongoose from "mongoose";

class DonatorValidatorUtils extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object({
      user: Joi.string()
        .optional()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }),
      amount: Joi.number().optional(),
      note: Joi.string().trim().min(3).optional(),
    });
    return this.validate(schema, req.body);
  };
  public update = (req: Request): ValidationResult => {
    const schema = Joi.object({
      user: Joi.string()
        .optional()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.error("any.invalid");
          }
          return value;
        }),
      amount: Joi.number().optional(),
      note: Joi.string().trim().min(3).optional(),
    });
    return this.validate(schema, req.body);
  };
}

export default new DonatorValidatorUtils();
