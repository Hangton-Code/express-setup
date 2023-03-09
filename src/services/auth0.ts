require("dotenv").config();
import jwt from "jsonwebtoken";
import { auth0AuthClient, auth0ManagementClient } from "../utils/auth0";

/* 
Here is services about base auth (oauth, logout, etc)
*/

type Auth0OauthUserInfo = {
  nickname: string;
  name: string;
  picture: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
  iss: string;
  aud: string;
  iat: number;
  exp: number;
  sub: string;
  auth_time: number;
  sid: string;
};

const AUTH0_REDIRECT_URI = process.env.AUTH0_REDIRECT_URI as string;

async function getAuth0UserInfoByCode(code: string) {
  // get id token to the user profile by code returned
  const { id_token } = (await auth0AuthClient.oauth?.authorizationCodeGrant({
    code,
    redirect_uri: AUTH0_REDIRECT_URI,
  })) as {
    access_token: string;
    id_token: string;
    scope: string;
    expires_in: number;
    token_type: string;
  };

  // id_token contain all user info
  return jwt.decode(id_token) as Auth0OauthUserInfo;
}

/*
Here is services about Auth0 Management Api (email verification, auth0's profile setting)
*/

async function sendAuth0VerificationEmail(userId: string) {
  return await auth0ManagementClient.sendEmailVerification({
    user_id: userId,
  });
}

export { getAuth0UserInfoByCode, sendAuth0VerificationEmail };
