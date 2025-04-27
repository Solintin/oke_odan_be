import { Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError } from "@src/errors";
import authService from "@src/services/auth.service";
import { IRequest } from "@src/interfaces/function.interface";
import logger from "@src/utils/logger";

const validateUserAccess = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorization } = req.headers;
    if (!authorization) throw new BadRequestError("No token provided.");

    const token = authorization.startsWith("Bearer ")
      ? authorization.split(" ")[1]
      : authorization;

    if (!token) throw new BadRequestError("No token provided.");

    const { payload, expired } = authService.verifyAccessToken(token);

    if (expired) throw new UnauthorizedError("Please provide a valid token.");

    req.user = payload;
    next();
  } catch (error) {
    logger.log(
      "error",
      `Error in authentication middleware validate user access method: ${error}`
    );
    next(error);
  }
};

export default validateUserAccess;
