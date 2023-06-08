import cors from "cors";
import express, { Express, json } from "express";
import { resolve } from "node:path";

import adimRouter from "./routers/adimRouter";
import attributeRouter from "./routers/attributeRouter";
import coinsRouter from "./routers/coinsRouter";
import pokemonRouter from "./routers/pokemonRouter";
import recoveryUserRouter from "./routers/recoveryUserRouter";
import uploadRouter from "./routers/uploadRouter";
import userPokemonsRouter from "./routers/userPokemonsRouter";
import userRouter from "./routers/userRouter";

class App {
  server: Express;

  constructor() {
    this.server = express();
    this.middleware();
    this.router();
  }

  middleware() {
    this.server.use(json());
    this.server.use(cors());
    this.server.use(
      "/files",
      express.static(resolve(__dirname, "..", "uploads"))
    );
  }

  router() {
    this.server.use(userRouter);
    this.server.use(userPokemonsRouter);
    this.server.use(recoveryUserRouter);
    this.server.use(adimRouter);
    this.server.use(pokemonRouter);
    this.server.use(attributeRouter);
    this.server.use(uploadRouter);
    this.server.use(coinsRouter);
  }
}

export default new App().server;

// enable open new abb
// Workbench › Editor: Enable Preview
