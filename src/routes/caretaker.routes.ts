import {
  create,
  update,
  remove,
  get,
  index,
} from "@src/controllers/caretaker.controller";
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
  validateRequestBody(authValidator.createCareTakerAgent),
  // validateUserAccess,
  create
);

router.patch(
  "/:careTakerId",
  validateParamId("careTakerId"),
  // validateUserAccess,
  validateRequestBody(authValidator.updateCareTaker),
  update
);

router.delete(
  "/:careTakerId",
  // validateUserAccess,
  validateParamId("careTakerId"),
  remove
);

router.get(
  "/:careTakerId",
  // validateUserAccess,
  validateParamId("careTakerId"),
  get
);

export default router;
