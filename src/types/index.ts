type Auth0UserIdentity = {
  connection: string;
  provider: string;
  user_id: string;
  isSocial: false;
};

type Auth0UserInfo = {
  created_at: string;
  email: string;
  email_verified: boolean;
  identities: Auth0UserIdentity[];
  name: string;
  nickname: string;
  picture: string;
  updated_at: string;
  user_id: string;
  last_ip: string;
  last_login: string;
  logins_count: number;
};

type UserProfile = {
  email: string;
  name: string;
  nickname: string;
  picture: string;
  created_at: string;
  updated_at: string;
};

export { Auth0UserInfo, UserProfile };
