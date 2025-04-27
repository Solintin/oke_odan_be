import {
  create,
  update,
  remove,
  get,
  index,
} from "@src/controllers/user.controller";
import { Router } from "express";
import {
  validateRequestBody,
  validateParamId,
} from "@src/middlewares/system.middleware";
import validateUserAccess from "@src/middlewares/auth.middleware";
import authValidator from "@src/validations/auth.validator";

const router = Router({ mergeParams: true });
// const taskController = new TaskController();

router.get(
  "/",
  //  validateUserAccess,
  index
);

router.post(
  "/",
  validateRequestBody(authValidator.createUser),
  // validateUserAccess,
  create
);

router.patch(
  "/:userId",
  validateParamId("userId"),
  // validateUserAccess,
  validateRequestBody(authValidator.updateUser),
  update
);

router.delete(
  "/:userId",
  // validateUserAccess,
  validateParamId("userId"),
  remove
);

router.get(
  "/:userId",
  // validateUserAccess,
  validateParamId("userId"),
  get
);

export default router;
