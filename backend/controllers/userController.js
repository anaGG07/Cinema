import User from "../models/User.js";
import { fetchFromTMDB } from "./movieController.js";


// Obtener el perfil del usuario autenticado
const getUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.userId).select("-password"); 

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json({ id: user._id, username: user.username });

  } catch (error) {
    res.status(500).json({ message: "Error al obtener los datos del usuario" });
  }
};

// Obtener las reseñas del usuario autenticado
const getUserReviews = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const reviewsWithMovies = [];

    for (const review of user.reviews) {
      // Obtener los detalles de la película de TMDB usando el tmdbMovieId
      const movieData = await fetchFromTMDB(`/movie/${review.tmdbMovieId}`);

      reviewsWithMovies.push({
        ...review.toObject(),
        movie: movieData,
      });
    }

    res.json(reviewsWithMovies);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener las reseñas del usuario" });
  }
};


// Obtener las películas favoritas del usuario autenticado
const getFavorites = async (req, res) => {
  try {

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const favorites = await Promise.all(
      user.favoriteMovies.map(async (movieId) => {
        return await fetchFromTMDB(`/movie/${movieId}`);
      })
    );

    const validFavorites = favorites.filter((movie) => movie !== null);
    res.json(validFavorites);

  } catch (error) {

    console.error("Error en getFavorites:", error);
    res.status(500).json({ message: "Error al obtener favoritos" });
  }
};


// Añadir o eliminar una película de favoritos
const toggleFavorite = async (req, res) => {

  try {

    const { movieId } = req.params;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const movieIdNum = Number(movieId);
    const isFavorite = user.favoriteMovies.includes(movieIdNum);

    if (isFavorite) {
      user.favoriteMovies = user.favoriteMovies.filter(
        (id) => id !== movieIdNum
      );
    } else {
      user.favoriteMovies.push(movieIdNum);
    }

    await user.save();

    res.json({
      message: isFavorite
        ? "Película eliminada de favoritos"
        : "Película añadida a favoritos",
      isFavorite: !isFavorite,
    });

  } catch (error) {
    console.error("Error en toggleFavorite:", error);
    res.status(500).json({ message: "Error al actualizar favoritos" });
  }
};


export {  getUserProfile, getUserReviews, getFavorites, toggleFavorite };
