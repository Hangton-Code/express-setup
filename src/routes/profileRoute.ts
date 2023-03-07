import { Router } from "express";
import requiredAuth from "../middlewares/requiredAuth";
import { UserType } from "../models/User";
import { body } from "express-validator";
import validationHandler from "../middlewares/validationHandler";
import {
  editAvatarController,
  editProfileController,
} from "../controllers/profileController";
import upload from "../utils/multer";
import { use } from "../helpers/errorHandler";

const router = Router();

router.get("/me", requiredAuth, (req, res) => {
  res.json({ ...req.user.toJSON(), refreshTokens: [] } as UserType);
});

router.patch(
  "/edit",
  requiredAuth,
  body("name")
    .isString()
    .isLength({
      min: 6,
      max: 30,
    })
    .optional(),
  validationHandler,
  use(editProfileController)
);

const allowedAvatarExt = [".png", ".jpg", ".jpeg", ".gif"];
const maxAvatarSize = 3 * 1024 * 1024; // 3MB
router.patch(
  "/edit/avatar",
  requiredAuth,
  upload(allowedAvatarExt, maxAvatarSize).single("image"),
  body("avatar_url").optional().isURL(),
  validationHandler,
  use(editAvatarController)
);

export default router;
