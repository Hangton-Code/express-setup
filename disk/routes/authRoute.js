"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const errorHandler_1 = require("../helpers/errorHandler");
const requiredAuth_1 = __importDefault(require("../middlewares/requiredAuth"));
const auth0_1 = require("../services/auth0");
const router = (0, express_1.Router)();
router.get("/log_in", (req, res) => {
    res.redirect((0, auth0_1.getAuth0LogInUrl)());
});
router.get("/callback", (0, errorHandler_1.use)(authController_1.CallbackController));
router.post("/refresh_token", (0, errorHandler_1.use)(authController_1.RefreshTokenController));
router.post("/verification_email", (0, errorHandler_1.use)(authController_1.VerificationEmailController));
router.get("/info", (0, errorHandler_1.use)(requiredAuth_1.default), (req, res) => {
    res.json(Object.assign(Object.assign({}, req.user.toJSON()), { refreshTokens: [] }));
});
exports.default = router;
