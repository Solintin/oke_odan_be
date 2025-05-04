import { BaseValidator } from "./index";
import Joi, { ValidationResult } from "joi";
import { Request } from "express";

class announcementValidatorUtils extends BaseValidator {
  protected makeSchemaOptional(schema: Joi.ObjectSchema): Joi.ObjectSchema {
    const updateSchema = schema.fork(
      Object.keys(schema.describe().keys),
      (field) => field.optional()
    );

    return updateSchema;
  }
  protected contactSchema = Joi.object({
    subject: Joi.string().min(3).max(255).required(),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    message: Joi.string().required(),
  });
  public create = (req: Request): ValidationResult => {
    return this.validate(this.contactSchema, req.body);
  };

  public update = (req: Request): ValidationResult => {
    const optionalSchema = this.makeSchemaOptional(this.contactSchema);
    return this.validate(optionalSchema, req.body);
  };
}

export default new announcementValidatorUtils();
