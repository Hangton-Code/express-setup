"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth0ManagementClient = exports.auth0AuthClient = void 0;
const auth0_1 = __importDefault(require("auth0"));
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const auth0AuthClient = new auth0_1.default.AuthenticationClient({
    clientId: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    domain: AUTH0_DOMAIN,
});
exports.auth0AuthClient = auth0AuthClient;
const auth0ManagementClient = new auth0_1.default.ManagementClient({
    clientId: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    domain: AUTH0_DOMAIN,
});
exports.auth0ManagementClient = auth0ManagementClient;
