import { Router } from "express";
import systemMiddleware from "@src/middlewares/system.middleware";
import blogController from "@src/controllers/blog.controller";
import blogValidator from "@src/validations/blog.validator";

class blogRoutes extends blogController {
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
      systemMiddleware.validateRequestBody(blogValidator.create),
      this.create.bind(this)
    );
    this.router.patch(
      "/:blogId",
      systemMiddleware.validateParamId("blogId"),
      systemMiddleware.validateRequestBody(blogValidator.update),
      this.update.bind(this)
    );
    this.router.delete(
      "/:blogId",
      systemMiddleware.validateParamId("blogId"),
      this.delete.bind(this)
    );
    this.router.get(
      "/:blogId",
      systemMiddleware.validateParamId("blogId"),
      this.get.bind(this)
    );
  }
}

export default new blogRoutes().router;
