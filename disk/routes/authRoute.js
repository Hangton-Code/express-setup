"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const authController_1 = require("../controllers/authController");
const errorHandler_1 = require("../helpers/errorHandler");
const validationHandler_1 = __importDefault(require("../middlewares/validationHandler"));
const router = (0, express_1.Router)();
router.get("/callback", (0, express_validator_1.query)("code").isString(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.CallbackController));
router.post("/log_out", (0, express_validator_1.body)("refreshToken").isJWT(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.LogOutController));
router.post("/refresh_token", (0, express_validator_1.body)("refreshToken").isJWT(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.RefreshTokenController));
router.post("/verification_email", (0, express_validator_1.body)("veToken").isJWT(), validationHandler_1.default, (0, errorHandler_1.use)(authController_1.VerificationEmailController));
exports.default = router;
