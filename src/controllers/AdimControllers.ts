import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import prisma from "../services/prisma.service";
import { validSchema } from "../utils/validSchemaZod";

class AdimControllers {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    const schemaCreateAdim = z.object({
      email: z.string().email(),
      password: z.string().min(1),
    });

    const [error, data] = validSchema({ email, password }, schemaCreateAdim);

    if (error) {
      return res.status(400).json({ data });
    }

    const adim = await prisma.adim.findFirst({
      where: {
        email: data.email,
      },
    });

    if (!adim) {
      return res.status(400).json({ message: "Error Adim inválido" });
    }

    const comparePassword = bcrypt.compareSync(data.password, adim.password);

    if (!comparePassword) {
      return res.status(400).json({ message: "Error Adim inválido" });
    }

    const token = jwt.sign(
      { adimId: adim.id, permission: adim.permission },
      process.env.SECRET_ADIM as string,
      {
        expiresIn: process.env.TOKEN_DAYS_ADIM,
      }
    );

    return res.status(200).json({
      token,
      message: "Adim logado com sucesso",
    });
  }

  async create(req: any, res: Response) {
    try {
      const adimId = req.adimId;
      const { name, email, password, permission } = req.body;
      const schemaCreateAdim = z.object({
        adimId: z.string().uuid(),
        name: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(1),
        permission: z.string(),
      });

      const [error, data] = validSchema(
        { adimId, name, email, password, permission },
        schemaCreateAdim
      );

      if (error) {
        return res.status(400).json({ data });
      }

      const adimValidate = await prisma.adim.findMany({
        where: {
          email: data.email,
        },
      });

      if (adimValidate.length >= 1) {
        return res.status(400).json({ Error: "Adim ja cadastrado!" });
      }

      const adim = await prisma.adim.findUnique({
        where: {
          id: adimId,
        },
      });

      if (!adim) {
        return res.status(404).json({ Error: "Adim not found" });
      }

      if (adim.permission !== "master") {
        return res
          .status(400)
          .json({ Error: "You not permission create adim!" });
      }

      const newAdim = await prisma.adim.create({
        data: {
          email: data.email,
          name: data.name,
          password: bcrypt.hashSync(data.password, 10),
          permission: data.permission,
        },
      });

      return res.status(200).json({ newAdim });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "error internal servidor!" });
    }
  }
}

export default new AdimControllers();
