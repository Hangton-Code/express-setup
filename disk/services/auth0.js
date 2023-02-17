"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAuth0VerificationEmail = exports.getAuth0UserInfo = exports.getAuth0LogInUrl = void 0;
require("dotenv").config();
const axios_1 = __importDefault(require("axios"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
/*
Here is services about base auth (oauth, logout, etc)
*/
const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
const AUTH0_CLIENT_ID = process.env.AUTH0_CLIENT_ID;
const AUTH0_CLIENT_SECRET = process.env.AUTH0_CLIENT_SECRET;
const AUTH0_REDIRECT_URI = process.env.AUTH0_REDIRECT_URI;
const getAuth0LogInUrl = () => {
    const params = new URLSearchParams({
        response_type: "code",
        client_id: AUTH0_CLIENT_ID,
        redirect_uri: AUTH0_REDIRECT_URI,
        scope: "profile email openid",
        prompt: "login", // to require user to field in the form every time login (dismiss the SSO)
    }).toString();
    const url = `https://${AUTH0_DOMAIN}/authorize?${params}`;
    return url;
};
exports.getAuth0LogInUrl = getAuth0LogInUrl;
function getAuth0UserInfo(code) {
    return __awaiter(this, void 0, void 0, function* () {
        // get id token to the user profile by code returned
        const id_token = yield (0, axios_1.default)({
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
            return res.data.id_token;
        });
        // id_token contain all user info
        return jsonwebtoken_1.default.decode(id_token);
    });
}
exports.getAuth0UserInfo = getAuth0UserInfo;
/*
Here is services about Auth0 Management Api (email verification, auth0's profile setting)
*/
const AUTH0_IDENTIFIER = process.env.AUTH0_API_IDENTIFIER;
let AUTH0_API_ACCESS_TOKEN = null;
let AUTH0_API_ACCESS_TOKEN_EXPIRED_IN = new Date().getTime();
function getAuth0ApiAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const current_time = new Date().getTime();
        if (AUTH0_API_ACCESS_TOKEN_EXPIRED_IN > current_time)
            return AUTH0_API_ACCESS_TOKEN;
        const { access_token, expires_in } = yield (0, axios_1.default)({
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
        }).then((res) => res.data);
        AUTH0_API_ACCESS_TOKEN = access_token;
        AUTH0_API_ACCESS_TOKEN_EXPIRED_IN = new Date(current_time + expires_in).getTime();
        console.log(`\n Server Log: Api access token is reloaded <${new Date()}> \n`);
        return access_token;
    });
}
function sendAuth0VerificationEmail(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const apiAccessToken = yield getAuth0ApiAccessToken();
        return yield (0, axios_1.default)({
            url: `https://${AUTH0_DOMAIN}/api/v2/jobs/verification-email`,
            method: "POST",
            data: {
                user_id: userId,
            },
            headers: {
                Authorization: `Bearer ${apiAccessToken}`,
            },
        });
    });
}
exports.sendAuth0VerificationEmail = sendAuth0VerificationEmail;
