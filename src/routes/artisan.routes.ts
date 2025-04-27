import {
  create,
  update,
  remove,
  get,
  index,
} from "@src/controllers/artisan.controller";
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
  validateRequestBody(authValidator.createArtisan),
  // validateUserAccess,
  create
);

router.patch(
  "/:artisanId",
  validateParamId("artisanId"),
  // validateUserAccess,
  validateRequestBody(authValidator.updateArtisan),
  update
);

router.delete(
  "/:artisanId",
  // validateUserAccess,
  validateParamId("artisanId"),
  remove
);

router.get(
  "/:artisanId",
  // validateUserAccess,
  validateParamId("artisanId"),
  get
);

export default router;
