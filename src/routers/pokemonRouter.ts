import { Router } from "express";
import PokemonController from "../controllers/PokemonController";
import authenticationAdim from "../middleware/adimMiddleware";
import authentication from "../middleware/userMiddleware";

const pokemonRouter = Router();

pokemonRouter.get("/pokemons", PokemonController.index);
pokemonRouter.get("/pokemons/:id", PokemonController.show);

pokemonRouter.post("/pokemons/search", PokemonController.search);

pokemonRouter.put(
  "/pokemons/:id",
  authenticationAdim,
  PokemonController.update
);
pokemonRouter.post("/pokemons", authenticationAdim, PokemonController.create);

pokemonRouter.delete(
  "/pokemons/:id",
  authenticationAdim,
  PokemonController.delete
);

pokemonRouter.post(
  "/pokemons/purchase",
  authentication,
  PokemonController.purchase
);

export default pokemonRouter;
