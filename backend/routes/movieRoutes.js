import express from "express";
import {
  getPopularMovies,
  searchMovies,
  getMovieDetails,
  getGenres,
  getMovieReviews,
  addReview,
  deleteMovieReview,
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
router.post("/:movieId/review", addReview);
router.delete("/:movieId/review", deleteMovieReview);

export default router;
