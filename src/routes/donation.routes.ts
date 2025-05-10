import {
  create,
  update,
  remove,
  get,
  index,
  getMyDonation,
} from "@src/controllers/donation.controller";
import { Router } from "express";
import {
  validateRequestBody,
  validateParamId,
} from "@src/middlewares/system.middleware";
import validateUserAccess from "@src/middlewares/auth.middleware";
import donationValidator from "@src/validations/donation.validator";

const router = Router({ mergeParams: true });

router.get(
  "/",
  //  validateUserAccess,
  index
);
router.get("/mydonation", validateUserAccess, getMyDonation);

router.post(
  "/",
  validateRequestBody(donationValidator.create),
  // validateUserAccess,
  create
);

router.patch(
  "/:donationId",
  validateParamId("donationId"),
  // validateUserAccess,
  validateRequestBody(donationValidator.update),
  update
);

router.delete(
  "/:donationId",
  // validateUserAccess,
  validateParamId("donationId"),
  remove
);

router.get(
  "/:donationId",
  // validateUserAccess,
  validateParamId("donationId"),
  get
);

export default router;
