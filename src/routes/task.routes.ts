import {
  create,
  update,
  remove,
  get,
  index,
} from "@src/controllers/task.controller";
import { Router } from "express";
import TaskValidator from "@src/validations/task.validator";
import {
  validateRequestBody,
  validateParamId,
} from "@src/middlewares/system.middleware";
import validateUserAccess from "@src/middlewares/auth.middleware";

const router = Router({ mergeParams: true });
// const taskController = new TaskController();

router.get("/", validateUserAccess, index);

router.post(
  "/",
  validateRequestBody(TaskValidator.create),
  validateUserAccess,
  create
);

router.patch(
  "/:taskId",
  validateParamId("taskId"),
  validateRequestBody(TaskValidator.update),
  update
);

router.delete(
  "/:taskId",
  validateUserAccess,
  validateParamId("taskId"),
  remove
);

router.get("/:taskId", validateUserAccess, validateParamId("taskId"), get);

export default router;
