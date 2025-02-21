import React from "react";
import { Link } from "react-router-dom";
import { useFavorites } from "../hooks/useFavorites";
import { getImageUrl } from "../services/tmdb";
import { Film, Heart, ArrowRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const Favorites = () => {
  const { favorites, loading, error, toggleFavorite } = useFavorites();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0A051A" }}
      >
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 text-[#FF2DAF] opacity-50">
            <Film className="w-full h-full" />
          </div>
          <h3 className="text-3xl font-bold text-[#FFB4E1] mb-4">
            Error al cargar los favoritos
          </h3>
          <p className="text-[#B4A9CD] max-w-md mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  if (!favorites || favorites.length === 0) {
    return (
      <div
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: "#0A051A" }}
      >
        {/* Decorative background elements */}
        <div className="absolute -top-20 right-20 w-96 h-96 bg-[#9B4DFF] rounded-full opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#FF2DAF] rounded-full opacity-20 blur-[80px]"></div>

        <div className="text-center relative z-10">
          <div className="w-32 h-32 mx-auto mb-6 text-[#FF2DAF] opacity-50 animate-pulse">
            <Heart className="w-full h-full" />
          </div>
          <h3 className="text-4xl font-bold text-[#FFB4E1] mb-4">
            No tienes películas favoritas
          </h3>
          <p className="text-[#B4A9CD] max-w-md mx-auto mb-8">
            ¡Explora nuestro catálogo y marca las películas que más te gusten!
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full 
            bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] 
            text-white font-semibold 
            hover:from-[#FF6AC2] hover:to-[#B366FF]
            transition-all duration-300 
            shadow-lg hover:shadow-[0_0_20px_rgba(255,45,175,0.4)]"
          >
            Descubrir Películas
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20 pb-10 relative overflow-hidden"
      style={{ background: "#0A051A" }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-20 w-96 h-96 bg-[#9B4DFF] rounded-full opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#FF2DAF] rounded-full opacity-20 blur-[80px]"></div>
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #FF2DAF10 0.5px, transparent 0.5px)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 pb-30 relative z-10">
        <h1 className="text-5xl font-bold text-white mb-12 text-center">
          Mis Favoritos
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="relative group"
            >
              {/* Glowing border effect */}
              <div
                className="absolute -inset-0.5 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] 
                rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition-all duration-300"
              ></div>

              <div
                className="relative bg-[#1A0B2E] rounded-2xl overflow-hidden 
                border border-[#FF2DAF20] hover:border-[#FF2DAF] 
                transition-all duration-300 
                hover:shadow-[0_0_20px_rgba(255,45,175,0.2)]"
              >
                <Link to={`/movie/${movie.id}`}>
                  <img
                    src={getImageUrl(movie.poster_path)}
                    alt={movie.title}
                    className="w-full h-[400px] object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>

                <div className="p-6">
                  <Link
                    to={`/movie/${movie.id}`}
                    className="text-2xl font-bold text-white hover:text-[#FF2DAF] transition-colors line-clamp-2 mb-2"
                  >
                    {movie.title}
                  </Link>
                  
                  <p className="text-[#B4A9CD] line-clamp-3 mb-4">
                    {movie.overview}
                  </p>

                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleFavorite(movie.id)}
                      className="text-[#FF2DAF] hover:text-[#9B4DFF] transition-colors"
                    >
                      <Heart className="w-6 h-6 fill-current" />
                    </button>
                    <Link
                      to={`/movie/${movie.id}`}
                      className="text-[#FF2DAF] hover:text-[#9B4DFF] 
                      flex items-center gap-2 text-sm font-medium"
                    >
                      Ver detalles
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
