import {
  create,
  update,
  remove,
  get,
  index,
  projectOverviewMetrics,
} from "@src/controllers/project.controller";
import { Router } from "express";
import {
  validateRequestBody,
  validateParamId,
} from "@src/middlewares/system.middleware";
import validateUserAccess from "@src/middlewares/auth.middleware";
import projectValidator from "@src/validations/project.validator";

const router = Router({ mergeParams: true });
// const taskController = new TaskController();

router.get(
  "/",
  //  validateUserAccess,
  index
);
router.get(
  "/overview",
  //  validateUserAccess,
  projectOverviewMetrics
);

router.post(
  "/",
  validateRequestBody(projectValidator.create),
  // validateUserAccess,
  create
);

router.patch(
  "/:projectId",
  validateParamId("projectId"),
  // validateUserAccess,
  validateRequestBody(projectValidator.update),
  update
);

router.delete(
  "/:projectId",
  // validateUserAccess,
  validateParamId("projectId"),
  remove
);

router.get(
  "/:projectId",
  // validateUserAccess,
  validateParamId("projectId"),
  get
);

export default router;
