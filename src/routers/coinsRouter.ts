import { Router } from "express";
import CoinsControllers from "../controllers/CoinsControllers";
import authenticationAdim from "../middleware/adimMiddleware";
import authentication from "../middleware/userMiddleware";

const coinsRouter = Router();

coinsRouter.get("/coins", CoinsControllers.index);
coinsRouter.post("/coins", authenticationAdim, CoinsControllers.create);
coinsRouter.put("/coins/:id", authenticationAdim, CoinsControllers.update);
coinsRouter.delete("/coins/:id", authenticationAdim, CoinsControllers.delete);
coinsRouter.post(
  "/coins/purchase/:id",
  authentication,
  CoinsControllers.purchase
);

export default coinsRouter;
