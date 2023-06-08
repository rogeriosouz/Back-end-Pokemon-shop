import { Router } from "express";
import AttributeControllers from "../controllers/AttributeControllers";
import authenticationAdim from "../middleware/adimMiddleware";

const attributeRouter = Router();

attributeRouter.get(
  "/attributes",
  authenticationAdim,
  AttributeControllers.index
);

attributeRouter.post(
  "/attributes",
  authenticationAdim,
  AttributeControllers.create
);

attributeRouter.put(
  "/attributes/:id",
  authenticationAdim,
  AttributeControllers.update
);

attributeRouter.delete(
  "/attributes/:id",
  authenticationAdim,
  AttributeControllers.delete
);

export default attributeRouter;
