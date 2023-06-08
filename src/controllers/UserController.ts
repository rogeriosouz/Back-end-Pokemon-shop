import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import Mail from "../services/Mail";
import prisma from "../services/prisma.service";
import { validSchema } from "../utils/validSchemaZod";
import { validTokenForgotPassword } from "../utils/validTokenForgotPassword";

class UserController {
  async create(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;

      const schemaUserCreate = z.object({
        name: z.string().min(4),
        email: z.string().email(),
        password: z.string().min(4),
      });

      const [error, data] = validSchema(
        { name, email, password },
        schemaUserCreate
      );

      if (error) {
        return res.status(404).json({ message: data });
      }

      const users = await prisma.user.findMany({
        where: {
          email: data.email,
        },
      });

      if (users.length >= 1) {
        return res.status(400).json({ message: "Error usuario já cadastrado" });
      }

      await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: bcrypt.hashSync(data.password, 10),
          coins: Number(process.env.COINS_FREE),
        },
      });

      return res.status(202).json({ message: "Usuario criado com sucesso" });
    } catch (error: any) {
      console.log(error);

      return res.status(500).json({ message: "Error interno no servidor" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const schemaUserLogin = z.object({
        email: z.string().email(),
        password: z.string().min(4),
      });

      const [error, data] = validSchema({ email, password }, schemaUserLogin);

      if (error) {
        return res.status(404).json({ message: data });
      }

      const user = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Error usuário não encontrado" });
      }

      const comparePassword = bcrypt.compareSync(data.password, user.password);

      if (!comparePassword) {
        return res.status(400).json({ message: "Error usuário inválido" });
      }

      const token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          coins: user.coins,
        },
        process.env.SECRET as string,
        {
          expiresIn: process.env.TOKEN_DAYS,
        }
      );

      return res.status(200).json({
        token,
        message: "User logado com sucesso",
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: "Error interno no servidor" });
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const schemaForgotPassword = z.object({
        email: z.string().email(),
      });

      const [error, data] = validSchema({ email }, schemaForgotPassword);

      if (error) {
        return res.status(404).json({ message: data });
      }

      const user = await prisma.user.findFirst({
        where: {
          email: data.email,
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Error usuário não encontrado" });
      }

      const token = jwt.sign(
        {
          userId: user.id,
        },
        process.env.SECRET_FORGOT_PASSWORD as string,
        {
          expiresIn: process.env.TOKEN_DAYS_FORGOT,
        }
      );

      await Mail.sendMail(data.email, token);

      return res.status(200).json({
        message:
          "Um e-mail foi enviado para seu e-mail, com as instruções de redefinição de sua senha!",
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: "Error interno no servidor" });
    }
  }

  async recoveryPassword(req: Request, res: Response) {
    try {
      const { password, confirmPassword } = req.body;
      const { token } = req.params;

      const schemaRecoveryPassword = z
        .object({
          password: z.string().min(4),
          confirmPassword: z.string().min(4),
          token: z.string(),
        })
        .refine(
          (data) => {
            return data.password === data.confirmPassword;
          },
          {
            path: ["confirmPassword"],
            message: "As senha precisam ser iguais",
          }
        );

      const [error, data] = validSchema(
        { password, confirmPassword, token },
        schemaRecoveryPassword
      );

      if (error) {
        return res.status(400).json({ message: data });
      }

      const isTokenForgotValid = validTokenForgotPassword(data.token);

      if (!isTokenForgotValid) {
        return res.status(400).json({ message: "Error token expirou" });
      }

      const tokenInvalid = await prisma.invalidTokens.findFirst({
        where: {
          token: data.token,
        },
      });

      if (tokenInvalid) {
        return res.status(400).json({
          message: "Error token invalido",
        });
      }

      const jwtUserForgot: any = jwt.decode(data.token);

      const user = await prisma.user.findUnique({
        where: {
          id: jwtUserForgot.userId,
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Error usuário não encontrado" });
      }

      const comparePassword = bcrypt.compareSync(data.password, user.password);

      if (comparePassword) {
        return res.status(400).json({ message: "Error usuário inválido" });
      }

      await prisma.invalidTokens.create({
        data: {
          token: data.token,
        },
      });

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: bcrypt.hashSync(data.password, 10),
        },
      });

      return res.status(200).json({
        message: "Senha modificada com sucesso",
      });
    } catch (error: any) {
      console.log(error);
      return res.status(500).json({ message: "Error interno no servidor" });
    }
  }

  async update(req: any, res: Response) {
    try {
      const { name } = req.body;
      const userID = req.userId;

      const schemaUpdateUser = z.object({
        name: z.string().min(4),
      });

      const [error, data] = validSchema({ name }, schemaUpdateUser);

      if (error) {
        return res.status(404).json({ message: data });
      }

      const user = await prisma.user.findUnique({
        where: {
          id: userID,
        },
      });

      if (!user) {
        return res
          .status(404)
          .json({ message: "Error usuário não encontrado" });
      }

      const validUser = await prisma.user.findFirst({
        where: {
          NOT: {
            id: userID,
          },

          name: data.name,
        },
      });

      if (validUser) {
        return res
          .status(400)
          .json({ error: "Error Users cannot have the same name" });
      }

      await prisma.user.update({
        where: {
          id: userID,
        },
        data: {
          name: data.name,
        },
      });

      return res.status(200).json({});
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error interno no servidor" });
    }
  }

  async updatePassword(req: any, res: Response) {
    try {
      const { password, newPassword, confirmPassword } = req.body;
      const id = req.userId;

      const schemaUserCreate = z
        .object({
          password: z.string().min(4),
          newPassword: z.string().min(4),
          confirmPassword: z.string().min(4),
          id: z.string().uuid(),
        })
        .refine(
          (data) => {
            return data.newPassword === data.confirmPassword;
          },
          {
            path: ["confirmPassword"],
            message: "As senha precisam ser iguais",
          }
        );

      const [error, data] = validSchema(
        { password, confirmPassword, newPassword, id },
        schemaUserCreate
      );

      if (error) {
        return res.status(404).json({ message: data });
      }

      const user = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      if (!user) {
        return res
          .status(400)
          .json({ message: "Error usuário não encontrado" });
      }

      const compareAntPassword = bcrypt.compareSync(
        data.password,
        user.password
      );

      if (!compareAntPassword) {
        return res.status(400).json({ message: "Error password inválido" });
      }

      const compareNewPassword = bcrypt.compareSync(
        data.newPassword,
        user.password
      );

      if (compareNewPassword) {
        return res.status(400).json({ message: "Error password inválido" });
      }

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          password: bcrypt.hashSync(data.newPassword, 10),
        },
      });

      return res.status(200).json({
        message: "Senha modificada com sucesso",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Error interno no servidor" });
    }
  }
}

export default new UserController();
