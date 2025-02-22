import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MovieCarousel from "../components/MovieCarousel";
import { useFetch } from "../hooks/useFetch";
import {
  getPopularMovies,
  getMoviesByGenre,
  getGenres,
} from "../services/tmdb";
import { API_ROUTES } from "../config/apiRoutes";
import { useAuth } from "../context/AuthContext"; 
import { useFavorites } from "../context/FavoritesContext";

const Home = () => {
  const { isAuthenticated } = useAuth(); 
  const {
    favorites,
    toggleFavorite,
    error: favoritesError,
    loading: favoritesLoading,
  } = useFavorites();
  const [page, setPage] = useState(1);
  const [backgroundImage, setBackgroundImage] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [activeCategory, setActiveCategory] = useState({
    id: 0,
    name: "Popular",
  });
  const [genres, setGenres] = useState([]);

  // Función para verificar si una película está en favoritos
  const isFavorite = (movieId) => {
    return isAuthenticated && favorites.some((fav) => fav.id === movieId);
  };


  // Función para obtener películas según la categoría
  const fetchMoviesByCategory = () => {
    if (activeCategory.name === "Popular") {
      return () => getPopularMovies(page);
    }
    return () => getMoviesByGenre(activeCategory.id, page);
  };

  // Cargar géneros al montar el componente
  useEffect(() => {
    const loadGenres = async () => {
      
      try {
        const response = await getGenres();
        setGenres(response.genres);

      } catch (error) {
        console.error("Error al cargar géneros:", error);
      }
    };
    loadGenres();
  }, []);

  const { data, loading, error } = useFetch(fetchMoviesByCategory(), [
    activeCategory.id,
    page,
  ]);

  const handlePageChange = (newPage) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(newPage);
    setBackgroundImage("");
    setSelectedMovie(null);
  };

  // Efecto para establecer la primera película cuando los datos cambian
  useEffect(() => {
    if (data?.results && data.results.length > 0) {
      const firstMovie = data.results[0];
      setSelectedMovie(firstMovie);
      setBackgroundImage(
        `url(${API_ROUTES.MOVIES.IMAGE(firstMovie.backdrop_path, "original")})`
      );
    }
  }, [data, page]);

  const handleMovieHover = (movie) => {
    if (movie.backdrop_path) {
      setSelectedMovie(movie);
      setBackgroundImage(
        `url(${API_ROUTES.MOVIES.IMAGE(movie.backdrop_path, "original")})`
      );
    }
  };

  if (error) {
    return (
      <div className="text-center p-10">
        <h2 className="text-red-600 text-2xl font-bold">
          Error al cargar las películas
        </h2>
        <p className="text-xl font-medium">{error.message}</p>
        <Link to="/" className="text-blue-600">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 pb-20 bg-cover bg-center text-white transition-all duration-500 relative"
      style={{
        backgroundImage,
        backgroundBlendMode: "overlay",
        backgroundColor: "rgba(0,0,0,0.85)",
      }}
    >
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Título con gradiente */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] bg-clip-text text-transparent">
          {selectedMovie ? selectedMovie.title : "Descubre nuevas películas"}
        </h1>

        {/* Categorías sin fondo */}
        <div className="mb-12">
          <div className="grid grid-cols-1 gap-4">
            {/* Primera fila - números pares */}
            <div className="flex flex-wrap justify-center gap-3">
              <button
                onClick={() => {
                  setActiveCategory({ id: 0, name: "Popular" });
                  setPage(1);
                }}
                className={`px-6 py-2 rounded-full transition-all duration-300 ${
                  activeCategory.name === "Popular"
                    ? "bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] text-white shadow-lg shadow-purple-500/30"
                    : "bg-white/10 hover:bg-white/20 text-white/80"
                }`}
              >
                Popular
              </button>
              {genres.map((genre, index) =>
                index % 2 === 0 ? (
                  <button
                    key={genre.id}
                    onClick={() => {
                      setActiveCategory(genre);
                      setPage(1);
                    }}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      activeCategory.id === genre.id
                        ? "bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] text-white shadow-lg shadow-purple-500/30"
                        : "bg-white/10 hover:bg-white/20 text-white/80"
                    }`}
                  >
                    {genre.name}
                  </button>
                ) : null
              )}
            </div>
            {/* Segunda fila - números impares */}
            <div className="flex flex-wrap justify-center gap-3">
              {genres.map((genre, index) =>
                index % 2 !== 0 ? (
                  <button
                    key={genre.id}
                    onClick={() => {
                      setActiveCategory(genre);
                      setPage(1);
                    }}
                    className={`px-6 py-2 rounded-full transition-all duration-300 ${
                      activeCategory.id === genre.id
                        ? "bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] text-white shadow-lg shadow-purple-500/30"
                        : "bg-white/10 hover:bg-white/20 text-white/80"
                    }`}
                  >
                    {genre.name}
                  </button>
                ) : null
              )}
            </div>
          </div>
        </div>

        {/* Contenedor de películas */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2DAF]"></div>
          </div>
        ) : (
          <>
            <MovieCarousel
              movies={data?.results}
              onMovieHover={handleMovieHover}
              showFavoriteButton={isAuthenticated}
              isFavorite={isFavorite}
              toggleFavorite={toggleFavorite}
              isLoading={favoritesLoading}
            />
            {/* Paginación */}
            <div className="flex justify-center mt-12 space-x-4">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] text-white hover:opacity-90
                         disabled:from-gray-600 disabled:to-gray-700"
              >
                Anterior
              </button>
              <span className="self-center px-4 py-2 rounded-full bg-white/10 text-white/80">
                Página {page} de {data?.total_pages || 1}
              </span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === data?.total_pages}
                className="px-6 py-3 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
                         bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] text-white hover:opacity-90
                         disabled:from-gray-600 disabled:to-gray-700"
              >
                Siguiente
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
