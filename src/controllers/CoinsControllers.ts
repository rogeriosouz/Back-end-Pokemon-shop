import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../services/prisma.service";
import { validSchema } from "../utils/validSchemaZod";

class CoinsControllers {
  async index(req: Request, res: Response) {
    try {
      const coins = await prisma.coins.findMany({
        select: {
          id: true,
          name: true,
          price: true,
          coinsQuant: true,
        },
      });

      return res.status(200).json(coins);
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error interno no servidor" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, price, coinsQuant, description } = req.body;
      const schemaCoins = z.object({
        name: z.string().min(1),
        price: z.number().min(1),
        description: z.string().min(1),
        coinsQuant: z.number().min(1),
      });

      const [error, data] = validSchema(
        { name, price, coinsQuant, description },
        schemaCoins
      );

      if (error) {
        return res.status(400).json({ data });
      }

      const coinsValidate = await prisma.coins.findFirst({
        where: {
          name: data.name,
          OR: {
            description: data.description,
          },
        },
      });

      if (coinsValidate) {
        return res.status(400).json({ error: "Error coins ja cadastrado" });
      }

      const coins = await prisma.coins.create({
        data: {
          name: data.name,
          price: data.price,
          coinsQuant: data.coinsQuant,
          description: data.description,
        },
      });

      return res.status(201).json({ coins });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error interno no servidor" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { name, price, description, coinsQuant } = req.body;
      const { id } = req.params;

      const schemaParams = z.object({
        id: z.string().uuid(),
      });

      const [errorParams, dataParams] = validSchema({ id }, schemaParams);

      if (errorParams) {
        return res.status(400).json({ dataParams });
      }

      const schemaCoins = z.object({
        name: z.string().optional(),
        coinsQuant: z.number().optional(),
        price: z.number().optional(),
        description: z.string().optional(),
      });

      const [error, data] = validSchema(
        { name, price, description, id, coinsQuant },
        schemaCoins
      );

      if (error) {
        return res.status(400).json({ data });
      }

      const coins = await prisma.coins.findUnique({
        where: {
          id: dataParams.id,
        },
      });

      if (!coins) {
        return res.status(404).json({ error: "Error coins not found" });
      }

      if (data.name) {
        const validCoins = await prisma.coins.findFirst({
          where: {
            NOT: {
              id: dataParams.id,
            },
            name: data.name,
          },
        });

        if (validCoins) {
          return res
            .status(400)
            .json({ message: "Error coins cannot have the same name" });
        }
      }

      await prisma.coins.update({
        where: {
          id: dataParams.id,
        },
        data,
      });

      return res.status(200).json({ message: "Coins editado com sucesso!" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error interno no servidor" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const schemaCoins = z.object({
        id: z.string().uuid(),
      });

      const [error, data] = validSchema({ id }, schemaCoins);

      if (error) {
        return res.status(400).json({ data });
      }

      const coins = await prisma.coins.findUnique({
        where: {
          id,
        },
      });

      if (!coins) {
        return res.status(404).json({ error: "Error coins not found" });
      }

      await prisma.coins.delete({
        where: {
          id,
        },
      });

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error interno no servidor" });
    }
  }

  async purchase(req: any, res: Response) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const purchaseSchema = z.object({
        id: z.string().uuid(),
      });

      const [error, data] = validSchema({ id }, purchaseSchema);

      if (error) {
        return res.status(400).json({
          data,
        });
      }

      const coins = await prisma.coins.findUnique({
        where: {
          id: data.id,
        },
      });

      if (!coins) {
        return res.status(404).json({
          error: "coins not found!",
        });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });

      if (!user) {
        return res.status(404).json({
          error: "User not found!",
        });
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          coins: user.coins + coins.coinsQuant,
        },
      });

      return res.status(200).json({
        message: "Compra feita com sucesso",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error interno no servidor" });
    }
  }
}

export default new CoinsControllers();
