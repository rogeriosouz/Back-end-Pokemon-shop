import { Request, Response } from "express";
import console from "node:console";
import { z } from "zod";
import prisma from "../services/prisma.service";
import { validSchema } from "../utils/validSchemaZod";

class PokemonController {
  async search(req: Request, res: Response) {
    try {
      const { page, pageSize, ordemPrice } = req.query;
      const { search } = req.body;

      const schemaSearchNavigation = z.object({
        page: z.string().transform((page) => {
          return Number(page)
        }), 
        pageSize: z.string().transform((pageSize) => {
          return Number(pageSize)
        }), 
        ordemPrice: z.enum(['asc', 'desc']),
        search: z.string().min(1)
      });

      const [error, data] = validSchema({ page, pageSize, ordemPrice, search }, schemaSearchNavigation);

      if (error) {
        return res.status(400).json({ data });
      }
      
      const skip = (data.page - 1) * data.pageSize;
      const take = data.pageSize;

      const pokemons = await prisma.pokemon.findMany({
        where: {
          OR: [
            {
              title: {
                contains: data.search,
              },
            },
            {
              title: {
                equals: data.search,
              }
            },
            {
              attributes: {
                some: {
                  name: data.search // Procura por atributos com nome correspondente à palavra-chave de pesquisa
                }
              }
            }
          ]
        },
        distinct: 'id',
        select: {
          id: true,
          price: true,
          quant: true,
          amount: true,
          title: true,
          url: true,
          attributes: {
            select: {
              id: true,
              name: true,
              colorRex: true,
            },
          },
        },
        orderBy: {
          price: data.ordemPrice,
        },
        take: take,
        skip: skip,
      })


      const totalCount = await prisma.pokemon.count({
        where: {
          OR: [
            {
              title: {
                contains: data.search
              }
            },
            {
              attributes: {
                some: {
                  name: data.search
                }
              }
            }
          ]
        }
      });
    
      const totalPages = Math.ceil(totalCount / data.pageSize);
      const nextPage = data.page < totalPages;
      const prevPage = data.page >= totalPages;

      return res.status(200).json({ totalPages, nextPage, prevPage, pokemons });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Error interno no servidor" });
    }
  }
  async index(req: Request, res: Response) {
    try {
      const { page, pageSize, ordemPrice } = req.query;

      const schemaQueryNavigation = z.object({
        page: z.string().transform((page) => {
          return Number(page)
        }), 
        pageSize: z.string().transform((pageSize) => {
          return Number(pageSize)
        }), 
        ordemPrice: z.enum(['asc', 'desc'])
      });

      const [error, data] = validSchema({ page, pageSize, ordemPrice }, schemaQueryNavigation);

      if (error) {
        return res.status(400).json({ data });
      }

      const skip = (data.page - 1) * data.pageSize;
      const take = data.pageSize;
      
      const pokemons = await prisma.pokemon.findMany({
        select: {
          id: true,
          price: true,
          quant: true,
          amount: true,
          title: true,
          url: true,
          attributes: {
            select: {
              id: true,
              name: true,
              colorRex: true,
            },
          },
        },
        orderBy: {
          price: data.ordemPrice,
        },
        take: take,
        skip: skip,
      });

    
      const total = await prisma.pokemon.count();
      const totalPages = Math.ceil(total / data.pageSize);
      const nextPage = data.page < totalPages;
      const prevPage = data.page >= totalPages;

      return res.status(200).json({ totalPages, nextPage, prevPage, pokemons });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Error interno no servidor" });
    }
  }

  async show(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const schemaIdShowPokemon = z.object({
        id: z.string().uuid(),
      });

      const [error, data] = validSchema({ id }, schemaIdShowPokemon);

      if (error) {
        return res.status(400).json({ data });
      }

      const pokemon = await prisma.pokemon.findUnique({
        select: {
          id: true,
          title: true,
          price: true,
          url: true,
          quant: true,
          amount: true,
          attributes: {
            select: {
              id: true,
              name: true,
              colorRex: true,
            },
          },
        },
        where: {
          id: data.id,
        },
      });

      if (!pokemon) {
        return res.status(404).json({
          message: "Error pokemon not found!",
        });
      }

      return res.status(200).json({ pokemon });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Error interno no servidor" });
    }
  }

  async create(req: Request, res: Response) {
    try {
      const { price, quant, title, url, attributes } = req.body;

      const schemaCreatePokemon = z.object({
        url: z.string().url(),
        price: z.number().min(1),
        quant: z.number().min(1),
        title: z.string(),
        attributes: z.string().transform((attribute) => {
          const newAtributes: { id: string }[] = [];
          const atributesAll = attribute?.split(",");

          atributesAll?.map((atribute) => {
            newAtributes.push({ id: atribute.trim() });
          });

          const atributes = newAtributes.filter(
            (attribute) => attribute.id.length >= 1
          );

          const newAttributes = {
            connect: atributes,
          };

          return newAttributes;
        }),
      });

      const [error, data] = validSchema(
        { price, quant, title, url, attributes },
        schemaCreatePokemon
      );

      if (error) {
        return res.status(400).json({ data });
      }

      const pokemon = await prisma.pokemon.findFirst({
        where: {
          title: data.title,
        },
      });

      if (pokemon) {
        return res.status(400).json({ message: "Error pokemon ja cadastrado" });
      }

  
      await prisma.pokemon.create({
        data: {
          price: data.price,
          attributes: data.attributes,
          quant: data.quant,
          title: data.title,
          url: data.url,
          amount: 0,
        },
      });

      return res.status(202).json({ message: "Pokemon criado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Error interno no servidor" });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const { price, quant, title, url, attributes } = req.body;
      const { id } = req.params;

      const schemaIdParams = z.object({
        id: z.string().uuid(),
      });

      const [errorParams, dataParams] = validSchema({ id }, schemaIdParams);

      if (errorParams) {
        return res.status(400).json({ dataParams });
      }

      const schemaCreatePokemon = z.object({
        url: z.string().url().optional(),
        price: z.number().optional(),
        quant: z.number().optional(),
        title: z.string().optional(),
        attributes: z.string().optional().transform((attribute) => {
          const newAtributes: { id: string }[] = [];
          const atributesAll = attribute?.split(",");

          atributesAll?.map((atribute) => {
            newAtributes.push({ id: atribute.trim() });
          });

          const atributes = newAtributes.filter(
            (attribute) => attribute.id.length >= 1
          );

          const newAttributes = {
            connect: atributes,
          };

          return newAttributes;
        }),
      });

      const [error, data] = validSchema(
        { price, quant, title, url, attributes },
        schemaCreatePokemon
      );


      if (error) {
        return res.status(400).json({ error: data });
      }



      const pokemon = await prisma.pokemon.findUnique({
        where: {
          id,
        },
      });

      if (!pokemon) {
        return res
          .status(404)
          .json({ message: "Error pokemon não encontrado" });
      }

      if (data.title) {
        const validPokemons = await prisma.pokemon.findMany({
          where: {
            NOT: {
              id: dataParams.id,
            },
            title: data.title,
          },
        });

        if (validPokemons.length >= 1) {
          return res
            .status(400)
            .json({ message: "Error Pokemons cannot have the same title" });
        }
      }

    

      await prisma.pokemon.update({
        where: {
          id: dataParams.id,
        },
        data,
      });

      return res.status(200).json({ message: "Pokemon editado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Error interno no servidor" });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const schemaCreatePokemon = z.object({
        id: z.string().uuid(),
      });

      const [error, data] = validSchema({ id }, schemaCreatePokemon);

      if (error) {
        return res.status(400).json({ data });
      }

      const pokemon = await prisma.pokemon.findUnique({
        where: {
          id: data.id,
        },
      });

      if (!pokemon) {
        return res
          .status(400)
          .json({ message: "Error pokemon não encontrado" });
      }

      await prisma.pokemon.delete({
        where: {
          id: data.id,
        },
      });

      return res.status(200).json({ message: "Pokemon deletado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Error interno no servidor" });
    }
  }

  async purchase(req: any, res: Response) {
    try {
      const { pokemonId } = req.body;
      const schemaPurchase = z.object({
        pokemonId: z.string().uuid(),
      });

      const [error, data] = validSchema({ pokemonId }, schemaPurchase);

      if (error) {
        return res.status(400).json({ data });
      }

      const userID = req.userId;

      const user = await prisma.user.findUnique({
        where: {
          id: userID,
        },
      });

      if (!user) {
        return res.status(404).json({ message: "error user not found" });
      }

      const pokemon = await prisma.pokemon.findUnique({
        select: {
          id: true,
          price: true,
          quant: true,
          title: true,
          url: true,
          amount: true,
          attributes: {
            select: {
              id: true,
            },
          },
        },
        where: {
          id: data.pokemonId,
        },
      });

      if (!pokemon) {
        return res.status(404).json({ message: "Error pokemon not found" });
      }

      if (pokemon.quant <= 0) {
        return res
          .status(400)
          .json({ message: "Error pokemon não esta em stock" });
      }

      if (pokemon.price > user.coins) {
        return res
          .status(400)
          .json({ message: "Error você não possui coins suficiente" });
      }

      await prisma.userPokemon.create({
        data: {
          title: pokemon.title,
          url: pokemon.url,
          attributes: {
            connect: pokemon.attributes,
          },
          user: {
            connect: {
              id: userID,
            },
          },
        },
      });

      await prisma.pokemon.update({
        where: {
          id: data.pokemonId,
        },
        data: {
          quant: pokemon.quant - 1,
          amount: pokemon.amount + 1
        },
      });

      await prisma.user.update({
        where: {
          id: userID,
        },
        data: {
          coins: user.coins - pokemon.price,
        },
      });

      return res.status(200).json({
        message: "Sucesso pokemon comprado com sucesso!",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ Error: "Error interno no servidor" });
    }
  }
}

export default new PokemonController();
