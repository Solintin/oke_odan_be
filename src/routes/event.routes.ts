import { Router } from "express";
import eventValidator from "@src/validations/event.validator";

import {
  create,
  update,
  remove,
  get,
  index,
} from "@src/controllers/event.controller";
import {
  validateRequestBody,
  validateParamId,
} from "@src/middlewares/system.middleware";
import validateUserAccess from "@src/middlewares/auth.middleware";

const router = Router({ mergeParams: true });
// const taskController = new TaskController();

router.get(
  "/",
  //  validateUserAccess,
  index
);

router.post(
  "/",
  validateRequestBody(eventValidator.create),
  // validateUserAccess,
  create
);

router.patch(
  "/:eventId",
  validateParamId("eventId"),
  // validateUserAccess,
  validateRequestBody(eventValidator.update),
  update
);

router.delete(
  "/:eventId",
  // validateUserAccess,
  validateParamId("eventId"),
  remove
);

router.get(
  "/:eventId",
  // validateUserAccess,
  validateParamId("eventId"),
  get
);

export default router;
