import {
  create,
  update,
  remove,
  get,
  index,
} from "@src/controllers/contact.controller";
import { Router } from "express";
import {
  validateRequestBody,
  validateParamId,
} from "@src/middlewares/system.middleware";
import validateUserAccess from "@src/middlewares/auth.middleware";
import contactValidator from "@src/validations/contact.validator";

const router = Router({ mergeParams: true });
// const taskController = new TaskController();

router.get(
  "/",
  //  validateUserAccess,
  index
);

router.post(
  "/",
  validateRequestBody(contactValidator.create),
  // validateUserAccess,
  create
);

router.patch(
  "/:announcementId",
  validateParamId("announcementId"),
  // validateUserAccess,
  validateRequestBody(contactValidator.update),
  update
);

router.delete(
  "/:announcementId",
  // validateUserAccess,
  validateParamId("announcementId"),
  remove
);

router.get(
  "/:announcementId",
  // validateUserAccess,
  validateParamId("announcementId"),
  get
);

export default router;
