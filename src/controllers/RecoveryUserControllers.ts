import { Response } from "express";
import prisma from "../services/prisma.service";
class RecoveryUserControllers {
  async index(req: any, res: Response) {
    try {
      const userId = req.userId;
      const user = await prisma.user.findUnique({
        select: {
          name: true,
          id: true,
          coins: true,
          email: true,
        },
        where: {
          id: userId,
        },
      });

      if (!userId) {
        return res.status(404).json({ message: "Error user not found!" });
      }

      return res.status(200).json({ user });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: "Error internal servidor!" });
    }
  }
}

export default new RecoveryUserControllers();
