import { Router } from "express";
import { body, query } from "express-validator";
import {
  CallbackController,
  LogOutController,
  RefreshTokenController,
  VerificationEmailController,
} from "../controllers/authController";
import { use } from "../helpers/errorHandler";
import requiredAuth from "../middlewares/requiredAuth";
import validationHandler from "../middlewares/validationHandler";
import { UserType } from "../models/User";

const router = Router();

router.get("/info", requiredAuth, (req, res) => {
  res.json({
    user: req.user,
    profile: req.userProfile,
  });
});
router.get(
  "/callback",
  query("code").isString(),
  validationHandler,
  use(CallbackController)
);
router.post(
  "/log_out",
  body("refreshToken").isJWT(),
  validationHandler,
  use(LogOutController)
);
router.post(
  "/refresh_token",
  body("refreshToken").isJWT(),
  validationHandler,
  use(RefreshTokenController)
);
router.post(
  "/verification_email",
  body("veToken").isJWT(),
  validationHandler,
  use(VerificationEmailController)
);

export default router;
