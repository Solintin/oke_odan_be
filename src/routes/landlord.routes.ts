import {
  create,
  update,
  remove,
  get,
  index,
} from "@src/controllers/landlord.controller";
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
  validateRequestBody(authValidator.createLandlord),
  // validateUserAccess,
  create
);

router.patch(
  "/:landLordId",
  validateParamId("landLordId"),
  // validateUserAccess,
  validateRequestBody(authValidator.updateLandlord),
  update
);

router.delete(
  "/:landLordId",
  // validateUserAccess,
  validateParamId("landLordId"),
  remove
);

router.get(
  "/:landLordId",
  // validateUserAccess,
  validateParamId("landLordId"),
  get
);

export default router;
