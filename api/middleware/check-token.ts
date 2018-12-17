import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_KEY;

export const validateToken = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (authorization) {
    try {
      await jwt.verify(authorization, typeof secretKey !== "undefined" ? secretKey : "secret");
      next();
    } catch (decodeErr) {
      res.send({ status: 401, message: "Invalid token" })
    }
  } else {
    res.send({ status: 401, message: "Unauthorized" })
  }
};
