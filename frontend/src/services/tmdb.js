import { API_ROUTES } from "../config/apiRoutes";

// Variables de entorno
const API_TOKEN = import.meta.env.VITE_API_TOKEN;
const API_BASE_URL = import.meta.env.VITE_BASE_URL;
const IMAGE_BASE_URL = import.meta.env.VITE_BASE_IMAGE_URL;

// Tamaños de imágenes disponibles
export const IMAGE_SIZES = {
  POSTER: "w500",
  BACKDROP: "original",
};

// Función para obtener la URL de una imagen
export const getImageUrl = (path, size = IMAGE_SIZES.POSTER) => {
  return API_ROUTES.MOVIES.IMAGE(path, size);
};

// Función de solicitud genérica a la API de TMDB
const fetchFromAPI = async (endpoint, options = {}, customConfig = {}) => {
  try {
    const baseConfig = {
      api_key: API_TOKEN,
      language: customConfig.language || "es-ES",
    };

    // Si hay un método POST, no incluir los parámetros en la URL
    const url = customConfig.method === 'POST' 
      ? `${API_BASE_URL}${endpoint}`
      : `${API_BASE_URL}${endpoint}?${new URLSearchParams({
          ...baseConfig,
          ...options
        })}`;

    const response = await fetch(url, {
      method: customConfig.method || 'GET',
      headers: customConfig.headers || {},
      body: customConfig.body,
      credentials: customConfig.credentials || 'same-origin'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en fetchFromAPI(${endpoint}):`, error);
    throw error;
  }
};


// Obtener películas populares
export const getPopularMovies = (page = 1) =>
  fetchFromAPI(API_ROUTES.MOVIES.POPULAR, { page });

// Obtener detalles de una película
export const getMovieDetails = (id) =>
  fetchFromAPI(API_ROUTES.MOVIES.DETAILS(id));

// Buscar películas con filtros
export const searchMovies = (query, options = {}) => {
  const params = {
    page: options.page || 1,
    sort_by: options.sort_by || "popularity.desc",
  };

  // Si hay un término de búsqueda, usar la ruta de búsqueda, si no, usar "discover"
  const endpoint = query?.trim() ? API_ROUTES.MOVIES.SEARCH : "/discover/movie";

  if (query?.trim()) params.query = query.trim();
  if (options.year) params.primary_release_year = options.year;
  if (options.genre) params.with_genres = options.genre;
  if (options.rating) params["vote_average.gte"] = options.rating;

  return fetchFromAPI(endpoint, params);
};


// Obtener videos de una película
export const getMovieVideos = async (id) => {
  const videos = await fetchFromAPI(API_ROUTES.MOVIES.VIDEOS(id), {}, "es-ES");

  if (!videos.results.length) {
    return await fetchFromAPI(API_ROUTES.MOVIES.VIDEOS(id), {}, "en-US");
  }
  return videos;
};

// Obtener lista de géneros
export const getGenres = () => fetchFromAPI(API_ROUTES.MOVIES.GENRES);

// Obtener películas por género
export const getMoviesByGenre = (genreId, page = 1) => {
  return fetchFromAPI("/discover/movie", {
    with_genres: genreId,
    page,
    sort_by: "popularity.desc",
  });
};

// Crear una reseña de película
export const createMovieReview = async (movieId, reviewData) => {
  try {
    const response = await fetch(API_ROUTES.REVIEWS.CREATE(movieId), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(reviewData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }

    return data;
  } catch (error) {
    console.error('Error al crear la reseña:', error);
    throw error;
  }
};

// Obtener reseñas de una película
export const getMovieReviews = async (movieId) => {
  try {
    const response = await fetch(API_ROUTES.REVIEWS.MOVIE_REVIEWS(movieId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error al obtener las reseñas:', error);
    throw error;
  }
};
