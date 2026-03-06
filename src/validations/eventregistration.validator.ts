import { BaseValidator, Joi } from "./index";
import { Request } from "express";
import { ValidationResult } from "joi";

class EventRegistrationValidatorUtils extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(255).required(),
      address: Joi.string().min(5).max(500).required(),
      phone: Joi.string().pattern(this.patterns.phoneNumber).required(),
      email: Joi.string().email().optional(),
    });

    return this.validate(schema, req.body);
  };
}

export default new EventRegistrationValidatorUtils();

