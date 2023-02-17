import { NextFunction, Request, Response } from "express";
import { APIError, use } from "../helpers/errorHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;

const requiredAuth = use(
  async (req: Request, res: Response, next: NextFunction) => {
    const access_token = req.headers.authorization?.split(" ")[1];
    if (!access_token)
      throw new APIError("Unauthorizated", {
        statusCode: 401,
      });

    const { userId } = jwt.verify(access_token, JWT_ACCESS_TOKEN_SECRET) as {
      userId: string;
    };

    req.user = await User.findOne({
      where: {
        id: userId,
      },
    });

    next();
  }
);

export default requiredAuth;
