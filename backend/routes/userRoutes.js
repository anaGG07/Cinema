import express from "express";
import { getUserProfile, getUserReviews, getFavorites, toggleFavorite } from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";


const router = express.Router();


// Aplicar authMiddleware a todas las rutas
router.use(authMiddleware);

// Rutas protegidas
router.get("/me", getUserProfile);
router.get("/favorites", getFavorites);
router.post("/favorites/:movieId", toggleFavorite);
router.get("/reviews", getUserReviews);


export default router;
