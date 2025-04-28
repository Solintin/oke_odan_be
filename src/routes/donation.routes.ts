import { Router } from "express";
import systemMiddleware from "@src/middlewares/system.middleware";
import DonationController from "@src/controllers/donation.controller";
import donationValidator from "@src/validations/donation.validator";

class donationRoutes extends DonationController {
  public router: Router;

  constructor() {
    super();
    this.router = Router({ mergeParams: true });
    this.routes();
  }

  public routes() {
    /**
     * @swagger
     * /api/v1/volunteer:
     *   get:
     *     summary: Get all volunteers
     *     tags: [Volunteers]
     *     description: Retrieve a list of all users
     *     responses:
     *       200:
     *         description: A list of users
     */
    this.router.get("/", this.index.bind(this));

    this.router.post(
      "/",
      systemMiddleware.validateRequestBody(donationValidator.create),
      this.create.bind(this)
    );
    this.router.patch(
      "/:donationId",
      systemMiddleware.validateParamId("donationId"),
      systemMiddleware.validateRequestBody(donationValidator.update),
      this.update.bind(this)
    );
    this.router.delete(
      "/:donationId",
      systemMiddleware.validateParamId("donationId"),
      this.delete.bind(this)
    );
    this.router.get(
      "/:donationId",
      systemMiddleware.validateParamId("donationId"),
      this.get.bind(this)
    );
  }
}

export default new donationRoutes().router;
