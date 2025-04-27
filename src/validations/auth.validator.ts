import { BaseValidator } from "./index";
// import Joi, { ValidationResult } from 'joi';
import Joi, { ValidationResult } from "joi";
import { Request } from "express";
import {
  AgentAssociation,
  AgentType,
  Relationship,
  ServiceType,
  UserType,
} from "@src/interfaces/enum.interface";

class AuthValidatorUtils extends BaseValidator {
  protected NOK = Joi.object({
    fullName: Joi.string().trim().min(2).max(100).optional().messages({
      "string.min": "Next of kin full name must be at least 2 characters long",
      "string.max": "Next of kin full name cannot exceed 100 characters",
    }),

    relationship: Joi.string()
      .valid(...Object.values(Relationship))
      .optional()
      .messages({
        "any.only": "Invalid relationship type",
      }),

    phone: Joi.string().trim().optional().messages({
      "string.pattern.base": "Invalid phone number format",
    }),

    email: Joi.string().email().trim().lowercase().optional().messages({
      "string.email": "Invalid email format",
    }),

    address: Joi.string().trim().min(10).max(300).required().messages({
      "string.min": "Next of kin address must be at least 10 characters long",
      "string.max": "Next of kin address cannot exceed 300 characters",
      "any.required": "Next of kin address is required",
    }),

    identifierImage: Joi.string().optional(),
  }).optional();
  protected baseUserSchema = Joi.object({
    __t: Joi.string()
      .valid(...Object.values(UserType))
      .required()
      .messages({
        "any.only": "Invalid user type",
        "any.required": "User type is required",
      }),

    fullName: Joi.string().trim().min(2).max(100).required().messages({
      "string.min": "Full name must be at least 2 characters long",
      "string.max": "Full name cannot exceed 100 characters",
      "any.required": "Full name is required",
    }),

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

    identifierImage: Joi.string().required().messages({
      "any.required": "Identifier image is required",
    }),
  });

  protected makeSchemaOptional(schema: Joi.ObjectSchema): Joi.ObjectSchema {
    const updateSchema = schema.fork(
      Object.keys(schema.describe().keys),
      (field) => field.optional()
    );

    // const keys = schema.$_terms.keys;
    // const optionalSchema = Object.keys(keys).reduce((acc, key) => {
    //   const rule = (keys as Record<string, any>)[key];
    //   return acc.append({
    //     [key]: rule.optional(),
    //   });
    // }, Joi.object());

    return updateSchema;
  }
  public createUser = (req: Request): ValidationResult => {
    return this.validate(this.baseUserSchema, req.body);
  };

  public updateUser = (req: Request): ValidationResult => {
    const optionalSchema = this.makeSchemaOptional(this.baseUserSchema);
    return this.validate(optionalSchema, req.body);
  };

  protected AgentSchema = this.baseUserSchema.append({
    // HouseAgent specific fields
    agentType: Joi.string()
      .valid(...Object.values(AgentType))
      .required()
      .messages({
        "any.only": "Invalid agent type",
        "any.required": "Agent type is required",
      }),

    agentAssociation: Joi.string()
      .valid(...Object.values(AgentAssociation))
      .required()
      .messages({
        "any.only": "Invalid agent association",
        "any.required": "Agent association is required",
      }),

    businessLocation: Joi.string().trim().min(3).max(200).required().messages({
      "string.min": "Business location must be at least 3 characters long",
      "string.max": "Business location cannot exceed 200 characters",
      "any.required": "Business location is required",
    }),

    license_number: Joi.string()
      .trim()
      .alphanum()
      .min(5)
      .max(50)
      .required()
      .messages({
        "string.alphanum": "License number must be alphanumeric",
        "string.min": "License number must be at least 5 characters long",
        "string.max": "License number cannot exceed 50 characters",
        "any.required": "License number is required",
      }),

    businessRegImage: Joi.string().required().messages({
      "any.required": "Business registration image is required",
    }),

    professionalCertImage: Joi.string().required().messages({
      "any.required": "Professional certification image is required",
    }),

    homeAddress: Joi.string().trim().min(10).max(300).required().messages({
      "string.min": "Home address must be at least 10 characters long",
      "string.max": "Home address cannot exceed 300 characters",
      "any.required": "Home address is required",
    }),

    yoe: Joi.string()
      .pattern(/^[0-9]+$/)
      .min(1)
      .max(2)
      .required()
      .messages({
        "string.pattern.base": "Years of experience must be a number",
        "string.min": "Years of experience must be at least 1 digit",
        "string.max": "Years of experience cannot exceed 2 digits",
        "any.required": "Years of experience is required",
      }),

    availableOnDemand: Joi.boolean().required().messages({
      "any.required": "Availability status is required",
    }),

    referenceLetters: Joi.array()
      .items(Joi.string().trim().min(10))
      .min(1)
      .max(5)
      .required()
      .messages({
        "array.min": "At least one reference letter is required",
        "array.max": "Maximum 5 reference letters allowed",
        "any.required": "Reference letters are required",
      }),

    next_of_kin: this.NOK,
  });
  public createAgent = (req: Request): ValidationResult => {
    return this.validate(this.AgentSchema, req.body);
  };
  public updateAgent = (req: Request): ValidationResult => {
    const optionalSchema = this.makeSchemaOptional(this.AgentSchema);
    return this.validate(optionalSchema, req.body);
  };

  protected ArtisanSchema = this.baseUserSchema
    .append({
      skill: Joi.string()
        .valid(...Object.values(ServiceType))
        .optional(),

      portfolioImages: Joi.array().items(Joi.string()).optional(),

      homeAddress: Joi.string().trim().min(10).max(300).optional(),

      yoe: Joi.string()
        .trim()
        .min(1)
        .max(3) // Assuming years of experience is a small number
        .optional(),

      availableOnDemand: Joi.boolean().optional(),

      next_of_kin: this.NOK,
    })
    .min(1); // Ensure at least one field is being updated
  public createArtisan = (req: Request): ValidationResult => {
    return this.validate(this.ArtisanSchema, req.body);
  };
  public updateArtisan = (req: Request): ValidationResult => {
    const optionalSchema = this.makeSchemaOptional(this.ArtisanSchema);
    return this.validate(optionalSchema, req.body);
  };

  protected careTakerSchema = this.baseUserSchema.append({
    // ICareTakerAgent specific fields
    caretaker_association: Joi.string()
      .valid("Independent", "Private", "Government", "NonProfit")
      .required()
      .messages({
        "any.only": "Invalid association type",
        "any.required": "Association type is required",
      }),
    businessLocation: Joi.string().trim().min(3).required().messages({
      "string.empty": "Business location is required",
      "string.min": "Business location must be at least {#limit} characters",
    }),
    license_number: Joi.string().trim().required().messages({
      "string.empty": "License number is required",
    }),
    businessRegImage: Joi.string().uri().required().messages({
      "string.uri": "Business registration image must be a valid URL",
      "string.empty": "Business registration image is required",
    }),
    professionalCertImage: Joi.string().uri().required().messages({
      "string.uri": "Professional certificate image must be a valid URL",
      "string.empty": "Professional certificate image is required",
    }),
    homeAddress: Joi.string().trim().min(5).required().messages({
      "string.empty": "Home address is required",
      "string.min": "Home address must be at least {#limit} characters",
    }),
    yoe: Joi.string()
      .pattern(/^\d+$/, "numbers")
      .message("Years of experience must be a positive number")
      .required(),
    availableOnDemand: Joi.boolean().required().messages({
      "boolean.base": "Availability on demand must be true or false",
    }),
    referenceLetters: Joi.array()
      .items(
        Joi.string().uri().messages({
          "string.uri": "Each reference letter must be a valid URL",
        })
      )
      .min(1)
      .required()
      .messages({
        "array.min": "At least one reference letter is required",
        "array.base": "Reference letters must be provided as an array",
      }),
    next_of_kin: this.NOK,
  });
  public createCareTakerAgent = (req: Request): ValidationResult => {
    return this.validate(this.careTakerSchema, req.body);
  };
  public updateCareTaker = (req: Request): ValidationResult => {
    const optionalSchema = this.makeSchemaOptional(this.careTakerSchema);
    return this.validate(optionalSchema, req.body);
  };

  protected landLordSchema = this.baseUserSchema.append({
    // ILandlord specific fields
    numberOfHousesOwned: Joi.number().integer().min(0).required().messages({
      "number.base": "Number of houses owned must be a number",
      "number.min": "Number of houses cannot be negative",
    }),
    utilityBillImage: Joi.string().uri().required().messages({
      "string.uri": "Utility bill image must be a valid URL",
      "string.empty": "Utility bill image is required",
    }),
    homeAddress: Joi.string().trim().min(5).required().messages({
      "string.empty": "Home address is required",
      "string.min": "Home address must be at least {#limit} characters",
    }),
    yoe: Joi.string()
      .pattern(/^\d+$/, "numbers")
      .message("Years of experience must be a positive number")
      .required(),
    availableOnDemand: Joi.boolean().required(),
    next_of_kin: this.NOK,
  });
  public createLandlord = (req: Request): ValidationResult => {
    return this.validate(this.landLordSchema, req.body);
  };
  public updateLandlord = (req: Request): ValidationResult => {
    const optionalSchema = this.makeSchemaOptional(this.landLordSchema);
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
