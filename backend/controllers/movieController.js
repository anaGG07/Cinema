import User from "../models/User.js";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;


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
    return null; // Evita que la API se rompa y devuelve null en caso de error
  }
};

// Obtener películas populares
export const getPopularMovies = async (req, res) => {
  const data = await fetchFromTMDB("/movie/popular", {
    page: req.query.page || 1,
  });
  if (!data)
    return res
      .status(500)
      .json({ message: "Error al obtener películas populares" });
  res.json(data);
};

// Buscar películas
export const searchMovies = async (req, res) => {
  const { query, page = 1 } = req.query;
  if (!query)
    return res
      .status(400)
      .json({ message: "Se requiere un término de búsqueda" });

  const data = await fetchFromTMDB("/search/movie", { query, page });
  if (!data)
    return res
      .status(500)
      .json({ message: "Error en la búsqueda de películas" });
  res.json(data);
};

// Obtener detalles de una película
export const getMovieDetails = async (req, res) => {
  const { id } = req.params;
  const movieData = await fetchFromTMDB(`/movie/${id}`);
  if (!movieData)
    return res
      .status(500)
      .json({ message: "Error al obtener detalles de la película" });

  if (req.userId) {
    const user = await User.findById(req.userId);
    movieData.isFavorite = user?.favoriteMovies.includes(Number(id));
  }

  // Obtener trailers de la película
  const videos = await fetchFromTMDB(`/movie/${id}/videos`);
  movieData.videos = videos?.results || [];

  res.json(movieData);
};

// Obtener géneros de películas
export const getGenres = async (req, res) => {
  const genres = await fetchFromTMDB("/genre/movie/list");
  if (!genres)
    return res.status(500).json({ message: "Error al obtener géneros" });
  res.json(genres);
};


// Añadir una reseña a una película
export const addReview = async (req, res) => {
  const { movieId } = req.params;
  const { content, rating } = req.body;

  if (!content || !rating) {
    return res
      .status(400)
      .json({ message: "Se requiere contenido y valoración" });
  }

  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

  const existingReview = user.reviews.find(
    (r) => r.movieId === Number(movieId)
  );
  if (existingReview) {
    return res
      .status(400)
      .json({ message: "Ya has publicado una reseña para esta película" });
  }

  user.reviews.push({ movieId: Number(movieId), content, rating });
  await user.save();

  res.status(201).json({ message: "Reseña añadida correctamente" });
};

// Obtener reseñas de una película
export const getMovieReviews = async (req, res) => {
  const { movieId } = req.params;
  const users = await User.find({ "reviews.movieId": Number(movieId) }).select(
    "username reviews"
  );

  const reviews = users.flatMap((user) =>
    user.reviews
      .filter((review) => review.movieId === Number(movieId))
      .map((review) => ({
        username: user.username,
        content: review.content,
        rating: review.rating,
        createdAt: review.createdAt,
      }))
  );

  res.json(reviews);
};
