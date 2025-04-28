import bullBoardUtil from "@src/utils/bullBoardUtil";
import { Router } from "express";

class devRoutes {
  public router: Router;
  constructor() {
    this.router = Router();
    this.routes();
  }

  public routes(): void {
    this.router.use("/queue-board", bullBoardUtil.getRouter());
  }
}

export default new devRoutes().router;
