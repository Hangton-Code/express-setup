"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_auth0_1 = __importDefault(require("passport-auth0"));
const passport_1 = __importDefault(require("passport"));
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_REDIRECT_URI = process.env.AUTH0_REDIRECT_URI;
// Set up Auth0 authentication strategy
const auth0Strategy = new passport_auth0_1.default({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    callbackURL: AUTH0_REDIRECT_URI,
}, (accessToken, refreshToken, extraParams, profile, done) => {
    // Here, you can handle what happens when a user logs in successfully
    // In this example, we're just returning the user's profile
    console.log(profile);
    done(null, profile);
});
passport_1.default.use(auth0Strategy);
exports.default = passport_1.default;
