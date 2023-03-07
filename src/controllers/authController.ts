import { Request, Response } from "express";
import { User } from "../models/User";
import {
  getAuth0UserInfo,
  sendAuth0VerificationEmail,
} from "../services/auth0";
import jwt from "jsonwebtoken";
import { APIError } from "../helpers/errorHandler";

const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET as string;
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET as string;
const JWT_VE_TOKEN_SECRET = process.env.JWT_VE_TOKEN_SECRET as string; // ve stands for "verification email"
const EMAIL_VERIFICATION_URL = `${process.env.CLIENT_URL}/auth/email_verification`;

async function CallbackController(req: Request, res: Response) {
  const code = req.query.code as string;

  const auth0User = await getAuth0UserInfo(code);

  // if email is not verified
  if (!auth0User.email_verified) {
    const veToken = jwt.sign(
      {
        userId: auth0User.sub,
        email: auth0User.email,
        usage: "verification email (sending) token",
      },
      JWT_VE_TOKEN_SECRET,
      {
        expiresIn: 60 * 60, //  1 hour
      }
    );

    return res.redirect(`${EMAIL_VERIFICATION_URL}?veToken=${veToken}`);
  }

  // find or create
  const [user] = await User.findOrCreate({
    where: { id: auth0User.sub },
    defaults: {
      id: auth0User.sub,
      avatar_url: auth0User.picture,
      email: auth0User.email,
      name: auth0User.name,
      refreshTokens: [],
    },
  });

  // generate new refreshToken
  const id = user.getDataValue("id");
  const refreshTokens = user.getDataValue("refreshTokens");
  const newRefreshToken = jwt.sign(
    {
      userId: id,
      usage: "refresh token",
    },
    JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "90d", //  90 days
    }
  );
  await user.update({
    refreshTokens: [...refreshTokens, newRefreshToken],
  });

  // return
  res.redirect(
    `${process.env.CLIENT_URL}/auth/callback?refresh_token=${newRefreshToken}`
  );
}

async function RefreshTokenController(req: Request, res: Response) {
  const refreshToken = req.body.refreshToken;

  const { userId } = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET) as {
    userId: string;
  };

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  if (!user)
    throw new APIError("User does not exist", {
      statusCode: 400,
    });

  const refreshTokens = user.getDataValue("refreshTokens");
  if (!refreshTokens.includes(refreshToken)) {
    throw new APIError("This refresh token is no longer available", {
      statusCode: 400,
    });
  }

  // generate
  const newRefreshToken = jwt.sign(
    {
      userId,
      usage: "refresh token",
    },
    JWT_REFRESH_TOKEN_SECRET,
    {
      expiresIn: "90d", //  90 days
    }
  );
  const newAccessToken = jwt.sign(
    {
      userId,
      usage: "access token",
    },
    JWT_ACCESS_TOKEN_SECRET,
    {
      expiresIn: 20 * 60, //  20 minutes
    }
  );

  await user.update({
    // delete old, update new
    refreshTokens: [
      ...refreshTokens.filter((e) => e !== refreshToken),
      newRefreshToken,
    ],
  });

  res.json({
    refreshToken: newRefreshToken,
    accessToken: newAccessToken,
  });
}

async function LogOutController(req: Request, res: Response) {
  const refreshToken = req.body.refreshToken;

  const { userId } = jwt.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET) as {
    userId: string;
  };

  const user = await User.findOne({
    where: {
      id: userId,
    },
  });
  if (!user) throw new APIError("Invalid User");

  const refreshTokens = user.getDataValue("refreshTokens");
  await user.update({
    refreshTokens: refreshTokens.filter((v) => v !== refreshToken),
  });

  res.end();
}

async function VerificationEmailController(req: Request, res: Response) {
  const veToken = req.body.veToken as string;

  const { userId } = jwt.verify(veToken, JWT_VE_TOKEN_SECRET) as {
    userId: string;
  };

  await sendAuth0VerificationEmail(userId);

  res.end();
}

export {
  CallbackController,
  LogOutController,
  RefreshTokenController,
  VerificationEmailController,
};
