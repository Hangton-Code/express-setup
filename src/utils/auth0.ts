import auth0 from "auth0";

const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN as string;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID as string;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET as string;

const auth0AuthClient = new auth0.AuthenticationClient({
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  domain: AUTH0_DOMAIN,
});

const auth0ManagementClient = new auth0.ManagementClient({
  clientId: AUTH0_CLIENT_ID,
  clientSecret: AUTH0_CLIENT_SECRET,
  domain: AUTH0_DOMAIN,
});

export { auth0AuthClient, auth0ManagementClient };
