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
exports.sendAuth0VerificationEmail = exports.getAuth0UserInfoByCode = void 0;
require("dotenv").config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth0_1 = require("../utils/auth0");
const AUTH0_REDIRECT_URI = process.env.AUTH0_REDIRECT_URI;
function getAuth0UserInfoByCode(code) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        // get id token to the user profile by code returned
        const { id_token } = (yield ((_a = auth0_1.auth0AuthClient.oauth) === null || _a === void 0 ? void 0 : _a.authorizationCodeGrant({
            code,
            redirect_uri: AUTH0_REDIRECT_URI,
        })));
        // id_token contain all user info
        return jsonwebtoken_1.default.decode(id_token);
    });
}
exports.getAuth0UserInfoByCode = getAuth0UserInfoByCode;
/*
Here is services about Auth0 Management Api (email verification, auth0's profile setting)
*/
function sendAuth0VerificationEmail(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield auth0_1.auth0ManagementClient.sendEmailVerification({
            user_id: userId,
        });
    });
}
exports.sendAuth0VerificationEmail = sendAuth0VerificationEmail;
