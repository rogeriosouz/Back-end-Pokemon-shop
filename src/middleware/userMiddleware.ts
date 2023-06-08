import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const authentication = async (req: any, res: Response, next: NextFunction) => {
  if (!req.headers.authorization) {
    return res.status(402).json({ Errors: "Invalid token" });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(
    token as string,
    process.env.SECRET as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(402).json({ Errors: "Invalid token" });
      }
      req.userId = decoded.userId;

      next();
    }
  );
};

export default authentication;
