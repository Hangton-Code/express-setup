# Auth0 Set-up

### First of all

1. Create new application in auth0 dashboard

### In Application Page `applications / application / <name> / settings`

1. Set the value in `.env` file
2. Change redirect url to `http(s)://{ServerDomain}/api/auth/callback`

### In Api Page `applications / apis / <name> / settings`

1. Set the value in `.env` file
2. Go to `/ Machine to Machine Applications`
3. Enable the application by name
4. In further, turn on all the permission required, and then update

# Env

```
PORT=5000
CLIENT_URL=http://localhost:3000

# db (sequelize)
DB_DATABASE_NAME=auth
DB_DATABASE_USER=admin
DB_DATABASE_PASSWORD=admin
DB_DIALECT=sqlite
DB_HOST=./db.sqlite

# auth0

AUTH0_REDIRECT_URI=
# refer to Application Page
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
# refer to Api Page
AUTH0_API_IDENTIFIER=


# jwt
JWT_ACCESS_TOKEN_SECRET=
JWT_REFRESH_TOKEN_SECRET=
JWT_VE_TOKEN_SECRET=
```
