require("dotenv").config();
import axios from "axios";
import jwt from "jsonwebtoken";

/* 
Here is services about base auth (oauth, logout, etc)
*/

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN as string;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID as string;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET as string;
const AUTH0_REDIRECT_URI = process.env.AUTH0_REDIRECT_URI as string;

// const getAuth0LogInUrl = () => {
//   const params = new URLSearchParams({
//     response_type: "code",
//     client_id: AUTH0_CLIENT_ID,
//     redirect_uri: AUTH0_REDIRECT_URI,
//     scope: "profile email openid",
//     prompt: "login", // to require user to field in the form every time login (dismiss the SSO)
//   }).toString();

//   const url = `https://${AUTH0_DOMAIN}/authorize?${params}`;

//   return url;
// };

type Auth0UserInfo = {
  sub: string;
  given_name: string;
  family_name: string;
  nickname: string;
  name: string;
  picture: string;
  locale: string;
  updated_at: string;
  email: string;
  email_verified: boolean;
};

async function getAuth0UserInfo(code: string) {
  // get id token to the user profile by code returned
  const id_token = await axios({
    method: "POST",
    url: `https://${AUTH0_DOMAIN}/oauth/token`,
    data: {
      grant_type: "authorization_code",
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      code: code,
      redirect_uri: AUTH0_REDIRECT_URI,
    },
  }).then((res) => {
    return res.data.id_token as string;
  });

  // id_token contain all user info
  return jwt.decode(id_token) as Auth0UserInfo;
}

/*
Here is services about Auth0 Management Api (email verification, auth0's profile setting)
*/

const AUTH0_IDENTIFIER = process.env.AUTH0_API_IDENTIFIER as string;
let AUTH0_API_ACCESS_TOKEN: string | null = null;
let AUTH0_API_ACCESS_TOKEN_EXPIRED_IN = new Date().getTime();

async function getAuth0ApiAccessToken() {
  const current_time = new Date().getTime();
  if (AUTH0_API_ACCESS_TOKEN_EXPIRED_IN > current_time)
    return AUTH0_API_ACCESS_TOKEN as string;

  const { access_token, expires_in } = await axios({
    url: `https://${AUTH0_DOMAIN}/oauth/token`,
    method: "POST",
    data: {
      grant_type: "client_credentials",
      // remember to turn on the "machine to machine application" in dashboard / application / APIS
      client_id: AUTH0_CLIENT_ID,
      client_secret: AUTH0_CLIENT_SECRET,
      // the identifier can be found in dashboard / application / APIS / settings page
      audience: AUTH0_IDENTIFIER,
    },
  }).then(
    (res) =>
      res.data as {
        access_token: string;
        expires_in: number;
      }
  );

  AUTH0_API_ACCESS_TOKEN = access_token;
  AUTH0_API_ACCESS_TOKEN_EXPIRED_IN = new Date(
    current_time + expires_in
  ).getTime();

  console.log(`\n Server Log: Api access token is reloaded <${new Date()}> \n`);

  return access_token;
}

async function sendAuth0VerificationEmail(userId: string) {
  const apiAccessToken = await getAuth0ApiAccessToken();
  return await axios({
    url: `https://${AUTH0_DOMAIN}/api/v2/jobs/verification-email`,
    method: "POST",
    data: {
      user_id: userId,
    },
    headers: {
      Authorization: `Bearer ${apiAccessToken}`,
    },
  });
}

export { getAuth0UserInfo, sendAuth0VerificationEmail };
