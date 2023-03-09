import { NextFunction, Request, Response } from "express";
import { APIError, use } from "../helpers/errorHandler";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { auth0ManagementClient } from "../utils/auth0";
import redisClient from "../utils/redis";
import { Auth0UserInfo, UserProfile } from "../types";

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

    const redisKey = `user-profile|${userId}`;

    req.userProfile = await redisClient
      .get(redisKey)
      .then(async (dataString) => {
        if (dataString) return JSON.parse(dataString) as Auth0UserInfo;

        const auth0UserInfo = (await auth0ManagementClient.getUser({
          id: userId,
        })) as Auth0UserInfo;

        const profile = {
          created_at: auth0UserInfo.created_at,
          email: auth0UserInfo.email,
          name: auth0UserInfo.name,
          nickname: auth0UserInfo.nickname,
          picture: auth0UserInfo.picture,
          updated_at: auth0UserInfo.updated_at,
        } as UserProfile;

        await redisClient.set(redisKey, JSON.stringify(profile), {
          // in second
          EX: 30 * 60,
        });

        return profile;
      });

    next();
  }
);

export default requiredAuth;
