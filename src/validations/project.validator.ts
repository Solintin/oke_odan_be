import { BaseValidator } from "./index";
// import Joi, { ValidationResult } from 'joi';
import Joi, { ValidationResult } from "joi";

import { Request } from "express";
import { ProjectStatus } from "@src/interfaces/enum.interface";

class ProjectValidatorUtils extends BaseValidator {
  protected makeSchemaOptional(schema: Joi.ObjectSchema): Joi.ObjectSchema {
    const updateSchema = schema.fork(
      Object.keys(schema.describe().keys),
      (field) => field.optional()
    );

    return updateSchema;
  }
  protected ProjectSchema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    location: Joi.string().min(2).max(100).required(),
    image: Joi.string().uri(),
    link: Joi.string().uri(),
    amount: Joi.number().positive().required(),
    status: Joi.string()
      .valid(...Object.values(ProjectStatus))
      .optional(),
  });
  public create = (req: Request): ValidationResult => {
    return this.validate(this.ProjectSchema, req.body);
  };
  public update = (req: Request): ValidationResult => {
    const optionalSchema = this.makeSchemaOptional(this.ProjectSchema);
    return this.validate(optionalSchema, req.body);
  };
}

export default new ProjectValidatorUtils();
