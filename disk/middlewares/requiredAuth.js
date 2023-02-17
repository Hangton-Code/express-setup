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
const errorHandler_1 = require("../helpers/errorHandler");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const JWT_ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_TOKEN_SECRET;
const requiredAuth = (0, errorHandler_1.use)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const access_token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!access_token)
        throw new errorHandler_1.APIError("Unauthorizated", {
            statusCode: 401,
        });
    const { userId } = jsonwebtoken_1.default.verify(access_token, JWT_ACCESS_TOKEN_SECRET);
    req.user = yield User_1.User.findOne({
        where: {
            id: userId,
        },
    });
    next();
}));
exports.default = requiredAuth;
