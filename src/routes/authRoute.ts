import { Router } from "express";
import {
  CallbackController,
  RefreshTokenController,
  VerificationEmailController,
} from "../controllers/authController";
import { use } from "../helpers/errorHandler";
import requiredAuth from "../middlewares/requiredAuth";
import { UserType } from "../models/User";
import { getAuth0LogInUrl } from "../services/auth0";

const router = Router();

router.get("/log_in", (req, res) => {
  res.redirect(getAuth0LogInUrl());
});
router.get("/callback", use(CallbackController));
router.post("/refresh_token", use(RefreshTokenController));
router.post("/verification_email", use(VerificationEmailController));
router.get("/info", use(requiredAuth), (req, res) => {
  res.json({ ...req.user.toJSON(), refreshTokens: [] } as UserType);
});

export default router;
