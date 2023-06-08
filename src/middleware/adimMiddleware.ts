import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";

const authenticationAdim = async (
  req: any,
  res: Response,
  next: NextFunction
) => {
  const method = req.method;

  if (!req.headers.authorization) {
    return res.status(402).json({ Errors: "Token adim not sent" });
  }

  const token = req.headers.authorization.split(" ")[1];

  jwt.verify(
    token as string,
    process.env.SECRET_ADIM as string,
    (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ Errors: "Invalid token adim" });
      }
      req.adimId = decoded.adimId;
      req.permission = decoded.permission;

      if (
        (method === "PUT" || method === "DELETE") &&
        decoded.permission !== "master"
      ) {
        return res
          .status(400)
          .json({ Errors: "You not permission adim! master" });
      }

      if (method === "POST" && decoded.permission === "read") {
        return res
          .status(400)
          .json({ Errors: "You not permission create adim!" });
      }

      next();
    }
  );
};

export default authenticationAdim;
