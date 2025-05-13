import {
  create,
  update,
  remove,
  get,
  index,
  current,
} from "@src/controllers/paymentdetail.controller";
import { Router } from "express";
import {
  validateRequestBody,
  validateParamId,
} from "@src/middlewares/system.middleware";
// import validateUserAccess from "@src/middlewares/auth.middleware";
import paymentdetailValidator from "@src/validations/paymentdetail.validator";

const router = Router({ mergeParams: true });

router.get(
  "/",
  //  validateUserAccess,
  index
);

router.get(
  "/current",
  // validateUserAccess,
  current
);

router.post(
  "/",
  validateRequestBody(paymentdetailValidator.create),
  // validateUserAccess,
  create
);

router.patch(
  "/:paymentDetailId",
  validateParamId("paymentDetailId"),
  // validateUserAccess,
  validateRequestBody(paymentdetailValidator.update),
  update
);

router.delete(
  "/:paymentDetailId",
  // validateUserAccess,
  validateParamId("paymentDetailId"),
  remove
);

router.get(
  "/:paymentDetailId",
  // validateUserAccess,
  validateParamId("paymentDetailId"),
  get
);

export default router;
