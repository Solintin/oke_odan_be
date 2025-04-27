import { UserType } from "@src/interfaces/enum.interface";
import { IRequest } from "@src/interfaces/function.interface";
import authService from "@src/services/auth.service";
import logger from "@src/utils/logger";
import { NextFunction, Response, Request } from "express";

function signUp(userType: UserType) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { body: signUpData } = req;
      const user = await authService.signUp(signUpData, userType);
      const data = await authService.login(user);
      res.status(201).json({ message: "Welcome Boss", data });
    } catch (error) {
      logger.log("error", `Error in auth signup controller method: ${error}`);
      next(error);
    }
  };
}
const login = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      body: { email, password },
    } = req;
    const user = await authService.getUserForLogin(email, password);
    const data = await authService.login(user);
    return res.status(200).json({ message: "Logged in successfully.", data });
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const {
      body: { email },
    } = req;

    await authService.forgotPassword(email);

    return res.status(200).json({
      message: "A link has been sent to your mail to reset your password.",
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in auth forgot password controller method: ${error}`
    );
    next(error);
  }
};

const resetPassword = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { body: data } = req;

    const user = await authService.resetPassword(data);

    const payload = await authService.login(user);

    return res.status(200).json({
      message: "Your password has been reset successfully.",
      data: payload,
    });
  } catch (error) {
    logger.log(
      "error",
      `Error in auth reset password controller method: ${error}`
    );
    next(error);
  }
};

export { signUp, login, forgotPassword, resetPassword };
