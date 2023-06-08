import { Router } from "express";
import AdimControllers from "../controllers/AdimControllers";
import authenticationAdim from "../middleware/adimMiddleware";

const adimRouter = Router();

adimRouter.post(
  "/auth/adim/register",
  authenticationAdim,
  AdimControllers.create
);

adimRouter.post("/auth/adim/login", AdimControllers.login);

export default adimRouter;
