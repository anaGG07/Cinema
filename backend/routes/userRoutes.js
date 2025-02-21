import express from "express";
import { addUser, getUserProfile, getUserReviews } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// Ruta para añadir usuarios (protegida por autenticación)
router.post("/", addUser);

// Ruta para obtener información del usuario
router.get("/me", authMiddleware, getUserProfile);

// Ruta para obtener las reseñas del usuario
router.get("/me/reviews", authMiddleware, getUserReviews);

export default router;
