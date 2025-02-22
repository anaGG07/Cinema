import User from "../models/User.js";
import Movie from "../models/Movie.js";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;

// Función auxiliar para transformar datos de TMDB a nuestro modelo
const transformMovieData = (tmdbData) => ({
  tmdbId: tmdbData.id,
  title: tmdbData.title,
  overview: tmdbData.overview,
  posterPath: tmdbData.poster_path,
  backdropPath: tmdbData.backdrop_path,
  releaseDate: tmdbData.release_date,
  voteAverage: tmdbData.vote_average,
  popularity: tmdbData.popularity,
  genres: tmdbData.genres || [],
  runtime: tmdbData.runtime,
  videos: tmdbData.videos?.results || [],
  lastUpdated: new Date(),
});

export const fetchFromTMDB = async (endpoint, params = {}) => {
  try {
    const queryParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: "es-ES",
      ...params,
    });

    const response = await fetch(`${TMDB_BASE_URL}${endpoint}?${queryParams}`);

    if (!response.ok) {
      throw new Error(
        `Error en TMDB (${response.status}): ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en la solicitud a TMDB: ${endpoint}`, error);
    return null;
  }
};

// Obtener películas populares
export const getPopularMovies = async (req, res) => {
  try {
    const data = await fetchFromTMDB("/movie/popular", {
      page: req.query.page || 1,
    });

    if (!data) {
      return res
        .status(500)
        .json({ message: "Error al obtener películas populares" });
    }

    // Procesar y guardar cada película
    const movies = await Promise.all(
      data.results.map(async (movieData) => {
        // Obtener detalles completos de cada película
        const fullMovieData = await fetchFromTMDB(`/movie/${movieData.id}`);

        // Transformar datos
        const movieDetails = transformMovieData(fullMovieData);

        // Validar que los detalles no sean nulos
        if (!movieDetails) {
          console.error(
            `No se pudieron obtener detalles para la película ${movieData.id}`
          );
          return null;
        }

        let movie = await Movie.findOne({ tmdbId: movieDetails.tmdbId });

        if (movie) {
          Object.assign(movie, movieDetails);
          await movie.save();
        } else {
          movie = await Movie.create(movieDetails);
        }

        return movie;
      })
    );

    // Filtrar películas nulas
    const validMovies = movies.filter((movie) => movie !== null);

    res.json({
      page: data.page,
      results: validMovies,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (error) {
    console.error("Error en getPopularMovies:", error);
    res.status(500).json({ message: "Error al obtener películas populares" });
  }
};

// Buscar películas
export const searchMovies = async (req, res) => {
  try {
    const { query, page = 1 } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ message: "Se requiere un término de búsqueda" });
    }

    const data = await fetchFromTMDB("/search/movie", { query, page });
    if (!data) {
      return res
        .status(500)
        .json({ message: "Error en la búsqueda de películas" });
    }

    // Guardar resultados en la base de datos
    const movies = await Promise.all(
      data.results.map(async (movieData) => {
        let movie = await Movie.findOne({ tmdbId: movieData.id });

        if (!movie) {
          const fullMovieData = await fetchFromTMDB(`/movie/${movieData.id}`);
          movie = await Movie.create(transformMovieData(fullMovieData));
        }

        return movie;
      })
    );

    res.json({
      page: data.page,
      results: movies,
      total_pages: data.total_pages,
      total_results: data.total_results,
    });
  } catch (error) {
    console.error("Error en searchMovies:", error);
    res.status(500).json({ message: "Error en la búsqueda de películas" });
  }
};

// Obtener detalles de una película
export const getMovieDetails = async (req, res) => {
  try {
    const { id } = req.params;
    let movie = await Movie.findOne({ tmdbId: Number(id) });

    if (!movie || movie.needsUpdate()) {
      const movieData = await fetchFromTMDB(`/movie/${id}`);
      const videosData = await fetchFromTMDB(`/movie/${id}/videos`);
      movieData.videos = videosData.results;

      const movieDetails = transformMovieData(movieData);

      if (movie) {
        Object.assign(movie, movieDetails);
        await movie.save();
      } else {
        movie = await Movie.create(movieDetails);
      }
    }

    // Añadir información de favoritos si hay usuario autenticado
    if (req.userId) {
      const user = await User.findById(req.userId);
      movie = movie.toObject();
      movie.isFavorite = user?.favoriteMovies.includes(Number(id));
    }

    res.json(movie);
  } catch (error) {
    console.error("Error en getMovieDetails:", error);
    res
      .status(500)
      .json({ message: "Error al obtener detalles de la película" });
  }
};

// Obtener géneros
export const getGenres = async (req, res) => {
  const genres = await fetchFromTMDB("/genre/movie/list");
  if (!genres) {
    return res.status(500).json({ message: "Error al obtener géneros" });
  }
  res.json(genres);
};


export const addReview = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { content, rating } = req.body;

    if (!content || !rating) {
      return res
        .status(400)
        .json({ message: "Se requiere contenido y valoración" });
    }

    // Buscar el usuario
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Obtener detalles de la película de TMDB
    const movieData = await fetchFromTMDB(`/movie/${movieId}`);
    if (!movieData) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    // Crear o encontrar la película
    let movie = await Movie.findOne({ tmdbId: Number(movieId) });
    if (!movie) {
      movie = await Movie.create(transformMovieData(movieData));
    }

    // Verificar si el usuario ya ha dejado una reseña
    const existingReviewIndex = movie.reviews.findIndex(
      (review) => review.user.toString() === req.userId
    );

    if (existingReviewIndex !== -1) {
      return res
        .status(400)
        .json({ message: "Ya has dejado una reseña para esta película" });
    }

    // Añadir reseña a la película
    const newReview = {
      user: req.userId,
      username: user.username, // Usa el nombre de usuario del modelo de usuario
      content,
      rating,
      createdAt: new Date(),
    };

    movie.reviews.push(newReview);
    await movie.save();

    // Añadir reseña al usuario
    user.reviews.push({
      movieId: movie._id,
      tmdbMovieId: Number(movieId),
      movieTitle: movieData.title,
      content,
      rating,
      createdAt: new Date(),
    });
    await user.save();

    res.status(201).json({
      message: "Reseña añadida correctamente",
      review: newReview,
    });
  } catch (error) {
    console.error("Error al añadir reseña:", error);
    res.status(500).json({ message: "Error al añadir la reseña" });
  }
};

// Obtener reseñas de una película
export const getMovieReviews = async (req, res) => {
  try {
    const { movieId } = req.params;
    const movie = await Movie.findOne({ tmdbId: Number(movieId) });

    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    // Transformar reseñas al formato esperado por el frontend
    const reviews = movie.reviews.map((review) => ({
      username: review.username,
      content: review.content,
      rating: review.rating,
      createdAt: review.createdAt,
    }));

    res.json(reviews);
  } catch (error) {
    console.error("Error al obtener reseñas:", error);
    res.status(500).json({ message: "Error al obtener las reseñas" });
  }
};

export const deleteMovieReview = async (req, res) => {
  try {
    const { movieId } = req.params;

    // Encontrar la película
    const movie = await Movie.findOne({ tmdbId: Number(movieId) });
    if (!movie) {
      return res.status(404).json({ message: "Película no encontrada" });
    }

    // Eliminar reseña de la película
    const reviewIndex = movie.reviews.findIndex(
      (review) => review.user.toString() === req.userId
    );

    if (reviewIndex === -1) {
      return res.status(404).json({ message: "Reseña no encontrada" });
    }

    // Eliminar reseña de la película
    movie.reviews.splice(reviewIndex, 1);
    await movie.save();

    // Eliminar reseña del usuario
    const user = await User.findById(req.userId);
    const userReviewIndex = user.reviews.findIndex(
      (review) => review.tmdbMovieId === Number(movieId)
    );

    if (userReviewIndex !== -1) {
      user.reviews.splice(userReviewIndex, 1);
      await user.save();
    }

    res.json({ message: "Reseña eliminada correctamente" });
  } catch (error) {
    console.error("Error al eliminar reseña:", error);
    res.status(500).json({ message: "Error al eliminar la reseña" });
  }
};