import { Router } from "express";
import { body, query } from "express-validator";
import {
  CallbackController,
  RefreshTokenController,
  VerificationEmailController,
} from "../controllers/authController";
import { use } from "../helpers/errorHandler";
import requiredAuth from "../middlewares/requiredAuth";
import validationHandler from "../middlewares/validationHandler";
import { UserType } from "../models/User";
import { getAuth0LogInUrl } from "../services/auth0";

const router = Router();

router.get("/log_in", (req, res) => {
  res.redirect(getAuth0LogInUrl());
});
router.get(
  "/callback",
  query("code").isString(),
  validationHandler,
  use(CallbackController)
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
router.get("/info", requiredAuth, (req, res) => {
  res.json({ ...req.user.toJSON(), refreshTokens: [] } as UserType);
});

export default router;
