"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const requiredAuth_1 = __importDefault(require("../middlewares/requiredAuth"));
const express_validator_1 = require("express-validator");
const validationHandler_1 = __importDefault(require("../middlewares/validationHandler"));
const profileController_1 = require("../controllers/profileController");
const multer_1 = __importDefault(require("../utils/multer"));
const errorHandler_1 = require("../helpers/errorHandler");
const router = (0, express_1.Router)();
router.get("/me", requiredAuth_1.default, (req, res) => {
    res.json(Object.assign(Object.assign({}, req.user.toJSON()), { refreshTokens: [] }));
});
router.patch("/edit", requiredAuth_1.default, (0, express_validator_1.body)("name")
    .isString()
    .isLength({
    min: 6,
    max: 30,
})
    .optional(), validationHandler_1.default, (0, errorHandler_1.use)(profileController_1.editProfileController));
const allowedAvatarExt = [".png", ".jpg", ".jpeg", ".gif"];
const maxAvatarSize = 3 * 1024 * 1024; // 3MB
router.patch("/edit/avatar", requiredAuth_1.default, (0, multer_1.default)(allowedAvatarExt, maxAvatarSize).single("image"), (0, express_validator_1.body)("avatar_url").optional().isURL(), validationHandler_1.default, (0, errorHandler_1.use)(profileController_1.editAvatarController));
exports.default = router;
