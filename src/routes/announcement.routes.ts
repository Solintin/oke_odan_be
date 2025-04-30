import {
  create,
  update,
  remove,
  get,
  index,
  published,
  scheduled,
} from "@src/controllers/announcement.controller";
import { Router } from "express";
import {
  validateRequestBody,
  validateParamId,
} from "@src/middlewares/system.middleware";
import validateUserAccess from "@src/middlewares/auth.middleware";
import announcementValidator from "@src/validations/announcement.validator";

const router = Router({ mergeParams: true });
// const taskController = new TaskController();

router.get(
  "/",
  //  validateUserAccess,
  index
);
router.get(
  "/scheduled",
  //  validateUserAccess,
  scheduled
);
router.get(
  "/published",
  //  validateUserAccess,
  published
);

router.post(
  "/",
  validateRequestBody(announcementValidator.create),
  // validateUserAccess,
  create
);

router.patch(
  "/:announcementId",
  validateParamId("announcementId"),
  // validateUserAccess,
  validateRequestBody(announcementValidator.update),
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
