import { Request, Response } from "express";
import { z } from "zod";
import prisma from "../services/prisma.service";
import { validSchema } from "../utils/validSchemaZod";

class AttributeControllers {
  async index(req: Request, res: Response) {
    try {
      const attributes = await prisma.attribute.findMany({
        select: {
          id: true,
          name: true,
          colorRex: true,
        },
      });

      return res.status(200).json({ attributes });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "error internal servidor!" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { name, colorRex } = req.body;
      const schemaCreateAdim = z.object({
        name: z.string().min(1),
        colorRex: z.string().min(1),
      });

      const [error, data] = validSchema({ name, colorRex }, schemaCreateAdim);

      if (error) {
        return res.status(400).json({ data });
      }

      const validAttribute = await prisma.attribute.findMany({
        where: {
          name: data.name,
          OR: {
            colorRex: data.colorRex,
          },
        },
      });

      if (validAttribute.length >= 1) {
        return res.status(400).json({
          message: "Error attributor ja cadastrado!",
        });
      }

      const atributes = await prisma.attribute.create({
        data: {
          name: data.name,
          colorRex: data.colorRex,
        },
      });

      return res.status(202).json({ atributes });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "error internal servidor!" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { name, colorRex } = req.body;
      const { id } = req.params;

      const schemaIdParams = z.object({
        id: z.string().uuid(),
      });

      const [errorParams, dataParams] = validSchema({ id }, schemaIdParams);

      if (errorParams) {
        return res.status(400).json({ dataParams });
      }

      const schemaCreateAdim = z.object({
        name: z.string().optional(),
        colorRex: z.string().optional(),
      });

      const [error, data] = validSchema(
        { name, colorRex, id },
        schemaCreateAdim
      );

      if (error) {
        return res.status(400).json({ data });
      }

      const attribute = await prisma.attribute.findUnique({
        where: {
          id: dataParams.id,
        },
      });

      if (!attribute) {
        return res.status(404).json({ message: "Error attribute no found" });
      }

      if (data.name || data.colorRex) {
        const attributeValidation = await prisma.attribute.findMany({
          where: {
            NOT: {
              id: dataParams.id,
            },
            OR: {
              colorRex: data.colorRex,
              name: data.name,
            },
          },
        });

        if (attributeValidation.length >= 1) {
          return res.status(400).json({
            message:
              "Error attribute não pode ter os mesmo nome ou o mesmo colorRex!",
          });
        }
      }

      const newAttributes = await prisma.attribute.update({
        where: {
          id: dataParams.id,
        },
        data,
      });

      return res.status(200).json({ attribute: newAttributes });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "error internal servidor!" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const schemaCreateAdim = z.object({
        id: z.string().uuid(),
      });

      const [error, data] = validSchema({ id }, schemaCreateAdim);

      if (error) {
        return res.status(400).json({ data });
      }

      const attribute = await prisma.attribute.findUnique({
        where: {
          id: data.id,
        },
      });

      if (!attribute) {
        return res.status(404).json({
          message: "Error attribute not found!",
        });
      }

      await prisma.attribute.delete({
        where: {
          id: data.id,
        },
      });

      return res
        .status(200)
        .json({ message: "Attributo deletado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "error internal servidor!" });
    }
  }
}

export default new AttributeControllers();
