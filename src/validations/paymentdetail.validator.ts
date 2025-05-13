import { BaseValidator } from "./index";
// import Joi, { ValidationResult } from 'joi';
import Joi, { ValidationResult } from "joi";
import { Request } from "express";

class DonatorValidatorUtils extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object({
      accountNumber: Joi.string().trim().min(3).required(),
      accountName: Joi.string().trim().min(3).required(),
      accountBank: Joi.string().trim().min(3).required(),
      isCurrent: Joi.boolean().optional(),
    });
    return this.validate(schema, req.body);
  };
  public update = (req: Request): ValidationResult => {
    const schema = Joi.object({
      accountNumber: Joi.string().trim().min(3).optional(),
      accountName: Joi.string().trim().min(3).optional(),
      accountBank: Joi.string().trim().min(3).optional(),
      isCurrent: Joi.boolean().optional(),
    });
    return this.validate(schema, req.body);
  };
}

export default new DonatorValidatorUtils();
