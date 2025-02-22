import express from "express";
import passport from "../config/passport.js";
import { login, logout, register, handleOAuthCallback } from "../controllers/authController.js";

const router = express.Router();

// Rutas existentes
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);

// Rutas de Google
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: process.env.FRONTEND_URL + "/login",
  }),
  handleOAuthCallback
);


export default router;
