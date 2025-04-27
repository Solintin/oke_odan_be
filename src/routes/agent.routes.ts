import {
  create,
  update,
  remove,
  get,
  index,
} from "@src/controllers/agent.controller";
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
  validateRequestBody(authValidator.createAgent),
  // validateUserAccess,
  create
);

router.patch(
  "/:agentId",
  validateParamId("agentId"),
  // validateUserAccess,
  // validateRequestBody(authValidator.update),
  update
);

router.delete(
  "/:agentId",
  // validateUserAccess,
  validateParamId("agentId"),
  remove
);

router.get(
  "/:agentId",
  // validateUserAccess,
  validateParamId("agentId"),
  get
);

export default router;
