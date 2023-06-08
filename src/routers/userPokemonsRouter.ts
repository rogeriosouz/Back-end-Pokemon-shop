import { Router } from "express";
import UserPokemonsControllers from "../controllers/UserPokemonsControllers";
import authentication from "../middleware/userMiddleware";

const userPokemonsRouter = Router();

userPokemonsRouter.get(
  "/user/pokemons",
  authentication,
  UserPokemonsControllers.index
);

export default userPokemonsRouter;
