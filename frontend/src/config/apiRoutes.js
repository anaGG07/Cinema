const BACKEND_API_URL =  import.meta.env.VITE_API_URL;
const TMDB_IMAGE_URL = import.meta.env.VITE_BASE_IMAGE_URL;
const YOUTUBE_BASE_URL = import.meta.env.VITE_YOUTUBE_URL;

export const API_ROUTES = {
  AUTH: {
    REGISTER: `${BACKEND_API_URL}/auth/register`,
    LOGIN: `${BACKEND_API_URL}/auth/login`,
    LOGOUT: `${BACKEND_API_URL}/auth/logout`,
    PROFILE: `${BACKEND_API_URL}/users/me`,
    FAVORITES: `${BACKEND_API_URL}/movies/user/favorites`,
    ADD_TO_FAVORITES: (movieId) =>
      `${BACKEND_API_URL}/movies/${movieId}/favorite`,
    REMOVE_FROM_FAVORITES: (movieId) =>
      `${BACKEND_API_URL}/movies/${movieId}/favorite`,
    GOOGLE: `${BACKEND_API_URL}/auth/google`,
    GOOGLE_CALLBACK: `${BACKEND_API_URL}/auth/google/callback`,
  },

  MOVIES: {
    POPULAR: "/movie/popular",
    DETAILS: (id) => `/movie/${id}`,
    SEARCH: "/search/movie",
    VIDEOS: (id) => `/movie/${id}/videos`,
    IMAGE: (path, size = "w500") =>
      path ? `${TMDB_IMAGE_URL}/${size}${path}` : "/placeholder-movie.jpg",
  },

  REVIEWS: {
    MOVIE_REVIEWS: (movieId) => `${BACKEND_API_URL}/movies/${movieId}/reviews`,
    USER_REVIEWS: `${BACKEND_API_URL}/users/me/reviews`,
    CREATE: (movieId) => `${BACKEND_API_URL}/movies/${movieId}/review`,
    UPDATE: (movieId, reviewId) =>
      `${BACKEND_API_URL}/movies/${movieId}/reviews/${reviewId}`,
    DELETE: (movieId, reviewId) =>
      `${BACKEND_API_URL}/movies/${movieId}/reviews/${reviewId}`,
  },
};

// Función para obtener el trailer de YouTube
export const getYouTubeTrailerUrl = (key) =>
  `https://www.youtube-nocookie.com/embed/${key}`;

