import { Router } from "express";
import RecoveryUserControllers from "../controllers/RecoveryUserControllers";
import authentication from "../middleware/userMiddleware";

const recoveryUserRouter = Router();

recoveryUserRouter.get(
  "/recovery",
  authentication,
  RecoveryUserControllers.index
);

export default recoveryUserRouter;
