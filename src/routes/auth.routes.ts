import {
  signUp,
  login,
  forgotPassword,
  resetPassword,
} from "@src/controllers/auth.controller";
import { Router } from "express";
import AuthValidator from "@src/validations/auth.validator";
import { validateRequestBody } from "@src/middlewares/system.middleware";
import { UserType } from "@src/interfaces/enum.interface";

const router = Router({ mergeParams: true });

router.post(
  "/register/user",
  validateRequestBody(AuthValidator.createUser),
  signUp(UserType.USER)
);
router.post(
  "/auth/forgotpassword",
  validateRequestBody(AuthValidator.ForgotPassword),
  forgotPassword
);
router.post(
  "/auth/resetpassword",
  validateRequestBody(AuthValidator.ResetPassword),
  resetPassword
);

router.post("/login", validateRequestBody(AuthValidator.login), login);

export default router;
