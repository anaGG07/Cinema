import React, { useState, useEffect } from "react";
import { searchMovies, getGenres } from "../services/tmdb";
import { Search, Sliders, X } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import { Link } from "react-router-dom";
import { Film } from "lucide-react";
import MovieImage from '../components/MovieImage';

const SearchPage = () => {
  const [query, setQuery] = useState("");
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    year: "",
    genre: "",
    rating: "",
    sort_by: "popularity.desc",
  });
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const loadGenres = async () => {

      try {
        const response = await getGenres();
        setGenres(response.genres || []);

      } catch (error) {
        console.error("Error loading genres:", error);
      }
    };
    loadGenres();
  }, []);

  const performSearch = async (searchQuery, currentFilters) => {
    setLoading(true);
    setError(null);

    try {

      const searchOptions = {
        ...currentFilters,
        page: 1,
      };

      const response = await searchMovies(searchQuery, searchOptions);
      setMovies(response.results || []);
      setResults(response.results || []);
      setHasSearched(true);

    } catch (err) {
      setError(err.message);

    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setQuery(value);

    const timeoutId = setTimeout(() => {
      performSearch(value, filters);
    }, 500);

    return () => clearTimeout(timeoutId);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    performSearch(query, newFilters);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

  return (
    <div
      className="relative min-h-screen pt-30 pb-10 overflow-hidden"
      style={{ background: "#0A051A" }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">

        <div className="absolute -top-20 right-20 w-96 h-96 bg-[#9B4DFF] rounded-full opacity-20 blur-[100px]"></div>

        <div className="absolute top-30 -left-20 w-72 h-72 bg-[#FF2DAF] rounded-full opacity-20 blur-[80px]"></div>
   
        <div className="absolute top-130 left-250 w-70 h-70 bg-[#FF2DAF] rounded-full opacity-20 blur-[60px] "></div>

        <div className="absolute top-90 left-50 w-96 h-96 bg-[#9B4DFF] rounded-full opacity-15 blur-[100px]"></div>

   
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #FF2DAF10 0.5px, transparent 0.5px)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="relative mb-12">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] opacity-10 blur-xl rounded-2xl"></div>
          <div className="absolute inset-0 bg-[#ff2dae98] opacity-2 blur-md rounded-2xl animate-pulse"></div>

          <div className="relative bg-[#1A0B2E] bg-opacity-40 backdrop-blur-xl rounded-2xl p-8 border border-[#FF2DAF20] shadow-[0_0_15px_rgba(255,45,175,0.15)]">
            <form onSubmit={(e) => { e.preventDefault(); performSearch(query, filters); }} className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4">
                <div className="flex-1 relative group">

               
                  <div className="absolute -top-2 -left-2 w-4 h-4 bg-[#00ffcc] rounded-full blur-md opacity-70"></div>
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#9B4DFF] rounded-full blur-md opacity-70"></div>
                  <div className="absolute -bottom-2 left-1/2 w-4 h-4 bg-[#FF2DAF] rounded-full blur-md opacity-70"></div>

                  <div className="absolute inset-0 bg-gradient-to-r from-[#FF2DAF20] to-[#9B4DFF20] opacity-50 blur-xl rounded-xl"></div>

                  <input
                    type="text"
                    value={query}
                    onChange={handleSearchInput}
                    placeholder="Buscar películas..."
                    className="w-full bg-[#0A051A] bg-opacity-50 text-white placeholder-[#B4A9CD] px-6 py-4 rounded-xl border border-[#FF2DAF40] focus:border-[#FF2DAF] focus:ring-2 focus:ring-[#FF2DAF20] transition-all duration-300 group-hover:border-[#FF2DAF] group-hover:shadow-[0_0_10px_rgba(255,45,175,0.2)] relative z-10"
                  />
                  <button
                    type="submit"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-[#FFB4E1] hover:text-[#FF2DAF] transition-colors duration-300 z-20"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-[#2B1B44] p-4 rounded-xl border border-[#FF2DAF40] hover:bg-[#392B5A] hover:border-[#FF2DAF] transition-all duration-300 hover:shadow-[0_0_15px_rgba(255,45,175,0.2)]"
                >
                  <Sliders className="text-[#FFB4E1] w-5 h-5" />
                </button>
              </div>

              {/* Panel de filtros */}
              {showFilters && (
                <div className="mt-6 p-6 bg-[#1A0B2E] bg-opacity-70 rounded-xl border border-[#FF2DAF20] backdrop-blur-xl shadow-[0_0_20px_rgba(255,45,175,0.1)]">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Selector de Género */}
                    <div className="space-y-2">
                      <label className="block text-[#FFB4E1] text-sm font-medium mb-2">
                        Género
                      </label>
                      <select
                        name="genre"
                        value={filters.genre}
                        onChange={handleFilterChange}
                        className="w-full bg-[#0A051A] bg-opacity-70 text-white border border-[#FF2DAF40] rounded-lg p-3 hover:border-[#FF2DAF] transition-all duration-300 focus:ring-2 focus:ring-[#FF2DAF20] focus:border-[#FF2DAF]"
                      >
                        <option value="">Todos los géneros</option>
                        {genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selector de Año */}
                    <div className="space-y-2">
                      <label className="block text-[#FFB4E1] text-sm font-medium mb-2">
                        Año
                      </label>
                      <select
                        name="year"
                        value={filters.year}
                        onChange={handleFilterChange}
                        className="w-full bg-[#0A051A] bg-opacity-70 text-white border border-[#FF2DAF40] rounded-lg p-3 hover:border-[#FF2DAF] transition-all duration-300 focus:ring-2 focus:ring-[#FF2DAF20] focus:border-[#FF2DAF]"
                      >
                        <option value="">Todos los años</option>
                        {years.map((year) => (
                          <option key={year} value={year}>
                            {year}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Selector de Puntuación */}
                    <div className="space-y-2">
                      <label className="block text-[#FFB4E1] text-sm font-medium mb-2">
                        Puntuación
                      </label>
                      <select
                        name="rating"
                        value={filters.rating}
                        onChange={handleFilterChange}
                        className="w-full bg-[#0A051A] bg-opacity-70 text-white border border-[#FF2DAF40] rounded-lg p-3 hover:border-[#FF2DAF] transition-all duration-300 focus:ring-2 focus:ring-[#FF2DAF20] focus:border-[#FF2DAF]"
                      >
                        <option value="">Todas las puntuaciones</option>
                        {[9, 8, 7, 6, 5, 4, 3, 2, 1].map(rating => (
                          <option key={rating} value={rating}>{rating}+ ⭐</option>
                        ))}
                      </select>
                    </div>

                    {/* Selector para ordenar */}
                    <div className="space-y-2">
                      <label className="block text-[#FFB4E1] text-sm font-medium mb-2">
                        Ordenar por
                      </label>
                      <select
                        name="sort_by"
                        value={filters.sort_by}
                        onChange={handleFilterChange}
                        className="w-full bg-[#0A051A] bg-opacity-70 text-white border border-[#FF2DAF40] rounded-lg p-3 hover:border-[#FF2DAF] transition-all duration-300 focus:ring-2 focus:ring-[#FF2DAF20] focus:border-[#FF2DAF]"
                      >
                        <option value="popularity.desc">Más populares</option>
                        <option value="vote_average.desc">
                          Mejor valoradas
                        </option>
                        <option value="release_date.desc">Más recientes</option>
                        <option value="release_date.asc">Más antiguas</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>

        {/* Sección de resultados mejorada */}
        {loading ? (
          <LoadingSpinner />
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
            {results.map((movie) => (
              <div key={movie.id} className="relative group">
                {/* Efecto de luz en el hover */}
                <div
                  className="absolute -inset-0.5 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] 
                  rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition-all duration-300"
                ></div>

                <div
                  className="relative bg-[#1A0B2E] rounded-2xl overflow-hidden 
                  border border-[#FF2DAF20] hover:border-[#FF2DAF] 
                  transition-all duration-300"
                >
                  <Link to={`/movie/${movie.id}`}>
                    <MovieImage
                      path={movie.poster_path}
                      alt={movie.title}
                      className="w-full h-[400px]"
                    />
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2 hover:text-[#FF2DAF] transition-colors">
                        {movie.title}
                      </h3>
                      <p className="text-[#B4A9CD] line-clamp-3">
                        {movie.overview}
                      </p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mb-8">{error}</div>
        ) : hasSearched && query.trim() ? (
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-6 text-[#FF2DAF] opacity-50">
              <Film className="w-full h-full" />
            </div>
            <h3 className="text-3xl font-bold text-[#FFB4E1] mb-4">
              No se encontraron resultados
            </h3>
            <p className="text-[#B4A9CD] max-w-md mx-auto">
              Intenta con otros términos de búsqueda o ajusta los filtros
            </p>
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 mx-auto mb-6 text-[#FF2DAF] opacity-50 animate-pulse">
              <Search className="w-full h-full" />
            </div>
            <h3 className="text-2xl font-bold text-[#FFB4E1] mb-2">
              Explora el universo cinematográfico
            </h3>
            <p className="text-[#B4A9CD]">
              Descubre películas increíbles en nuestra biblioteca
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
