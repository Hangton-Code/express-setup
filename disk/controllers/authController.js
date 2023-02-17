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
exports.VerificationEmailController = exports.RefreshTokenController = exports.CallbackController = void 0;
const User_1 = require("../models/User");
const auth0_1 = require("../services/auth0");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorHandler_1 = require("../helpers/errorHandler");
const JWT_REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_TOKEN_SECRET;
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const JWT_VE_TOKEN_SECRET = process.env.JWT_VE_TOKEN_SECRET; // ve stands for "verification email"
const VERIFICATION_EMAIL_URL = `${process.env.CLIENT_URL}/auth/verification_email`;
function CallbackController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const code = req.query.code;
        const auth0User = yield (0, auth0_1.getAuth0UserInfo)(code);
        // if email is not verified
        if (!auth0User.email_verified) {
            const veToken = jsonwebtoken_1.default.sign({
                userId: auth0User.sub,
                usage: "verification email (sending) token",
            }, JWT_VE_TOKEN_SECRET, {
                expiresIn: 60 * 60, //  1 hour
            });
            return res.redirect(`${VERIFICATION_EMAIL_URL}?veToken=${veToken}`);
        }
        // find or create
        const [user, created] = yield User_1.User.findOrCreate({
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
        const newRefreshToken = jsonwebtoken_1.default.sign({
            userId: id,
            usage: "refresh token",
        }, JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: "90d", //  90 days
        });
        yield user.update({
            refreshTokens: [...refreshTokens, newRefreshToken],
        });
        // return
        res.redirect(`${process.env.CLIENT_URL}/auth/token?refresh_token=${newRefreshToken}`);
    });
}
exports.CallbackController = CallbackController;
function RefreshTokenController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const refreshToken = req.body.refreshToken;
        const { userId } = jsonwebtoken_1.default.verify(refreshToken, JWT_REFRESH_TOKEN_SECRET);
        const user = yield User_1.User.findOne({
            where: {
                id: userId,
            },
        });
        if (!user)
            throw new errorHandler_1.APIError("User does not exist", {
                statusCode: 400,
            });
        const refreshTokens = user.getDataValue("refreshTokens");
        if (!refreshTokens.includes(refreshToken)) {
            throw new errorHandler_1.APIError("This refresh token is no longer available", {
                statusCode: 400,
            });
        }
        // generate
        const newRefreshToken = jsonwebtoken_1.default.sign({
            userId,
            usage: "refresh token",
        }, JWT_REFRESH_TOKEN_SECRET, {
            expiresIn: "90d", //  90 days
        });
        const newAccessToken = jsonwebtoken_1.default.sign({
            userId,
            usage: "access token",
        }, JWT_ACCESS_TOKEN_SECRET, {
            expiresIn: 20 * 60, //  20 minutes
        });
        yield user.update({
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
    });
}
exports.RefreshTokenController = RefreshTokenController;
function VerificationEmailController(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const veToken = req.body.veToken;
        const { userId } = jsonwebtoken_1.default.verify(veToken, JWT_VE_TOKEN_SECRET);
        yield (0, auth0_1.sendAuth0VerificationEmail)(userId);
        res.end();
    });
}
exports.VerificationEmailController = VerificationEmailController;
