import express from "express";
import {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  toggleFavorite,
  getFavorites,
  addReview,
  getMovieReviews,
  getGenres,
} from "../controllers/movieController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas públicas
router.get("/popular", getPopularMovies);
router.get("/search", searchMovies);
router.get("/genres", getGenres);
router.get("/:id", getMovieDetails);
router.get("/:movieId/reviews", getMovieReviews);

// Rutas protegidas 
router.use(authMiddleware);
router.get("/user/favorites", getFavorites);
router.post("/:movieId/favorite", toggleFavorite); 
router.post("/:movieId/review", addReview);

export default router;
