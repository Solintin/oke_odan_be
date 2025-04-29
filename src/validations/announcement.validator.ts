import { BaseValidator } from "./index";
import Joi, { ValidationResult } from "joi";
import { Request } from "express";

class announcementValidatorUtils extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object({
      title: Joi.string().min(3).max(255).required(),
      author: Joi.string().min(2).max(100).required(),
      scheduled_date: Joi.date()
        .iso() // Ensures ISO 8601 format (e.g., "2025-06-15T09:00:00Z")
        .greater("now") // Must be a future date
        .required()
        .messages({
          "date.iso": "Date must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)",
          "date.greater": "Date must be in the future",
        }),
      images: Joi.array().items(Joi.string().uri()).min(1).required(),
      announcement_detail: Joi.string().min(10).optional(),
    });
    return this.validate(schema, req.body);
  };

  public update = (req: Request): ValidationResult => {
    const schema = Joi.object({
      title: Joi.string().min(3).max(255).optional(),
      author: Joi.string().min(2).max(100).optional(),
      scheduled_date: Joi.date()
        .iso()
        .greater("now")
        .optional()
        .messages({
          "date.iso": "Date must be in ISO 8601 format (YYYY-MM-DDTHH:mm:ssZ)",
          "date.greater": "Date must be in the future",
        })
        .optional(),
      images: Joi.array().items(Joi.string().uri()).min(1).optional(),
      announcement_detail: Joi.string().min(10).optional(),
    });
    return this.validate(schema, req.body);
  };
}

export default new announcementValidatorUtils();
