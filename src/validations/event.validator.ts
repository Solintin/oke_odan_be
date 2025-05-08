import { BaseValidator } from "./index";
import Joi, { ValidationResult } from "joi";
import { Request } from "express";

class EventValidatorUtils extends BaseValidator {
  public create = (req: Request): ValidationResult => {
    const schema = Joi.object({
      title: Joi.string().min(3).max(255).required(),
      address: Joi.string().min(5).max(500).required(),
      state: Joi.string().min(2).max(100).required(),
      city: Joi.string().min(2).max(100).required(),
      country: Joi.string().min(2).max(100).required(),
      event_date: Joi.date()
        .iso() // Ensures ISO 8601 format (e.g., "2025-06-15T09:00:00Z")
        .greater("now")
        .required()
        .messages({
          "date.iso":
            "Event date must be in ISO 8601 format (e.g., 'YYYY-MM-DDTHH:mm:ssZ')",
          "date.greater": "Event date must be in the future",
        }),
      images: Joi.array().items(Joi.string().uri()).min(1).required(),
      description: Joi.string().min(10).optional(),
      isPublished: Joi.boolean().optional(),
      isOnGoing: Joi.boolean().optional(),
    });
    return this.validate(schema, req.body);
  };

  public update = (req: Request): ValidationResult => {
    const schema = Joi.object({
      title: Joi.string().min(3).max(255).optional(),
      address: Joi.string().min(5).max(500).optional(),
      state: Joi.string().min(2).max(100).optional(),
      city: Joi.string().min(2).max(100).optional(),
      country: Joi.string().min(2).max(100).optional(),
      event_date: Joi.date()
        .iso() // Ensures ISO 8601 format (e.g., "2025-06-15T09:00:00Z")
        .greater("now")
        .required()
        .messages({
          "date.iso":
            "Event date must be in ISO 8601 format (e.g., 'YYYY-MM-DDTHH:mm:ssZ')",
          "date.greater": "Event date must be in the future",
        })
        .optional(),
      images: Joi.array().items(Joi.string().uri()).min(1).optional(),
      description: Joi.string().min(10).optional(),
      isPublished: Joi.boolean().optional(),
      isOnGoing: Joi.boolean().optional(),
    });
    return this.validate(schema, req.body);
  };
}

export default new EventValidatorUtils();
