import { Response } from "express";
import prisma from "../services/prisma.service";
class UserPokemonsControllers {
  async index(req: any, res: Response) {
    try {
      const userId = req.userId;

      const pokemons = await prisma.userPokemon.findMany({
        where: {
          userId,
        },
        select: {
          id: true,
          title: true,
          url: true,
          attributes: {
            select: {
              name: true,
              colorRex: true,
            },
          },
          create_at: true,
        },
      });

      return res.status(200).json({ pokemons });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error internal servidor!" });
    }
  }
}

export default new UserPokemonsControllers();
