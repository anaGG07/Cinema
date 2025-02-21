import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import { getMovieDetails, getMovieVideos } from "../services/tmdb";
import { getYouTubeTrailerUrl } from "../config/apiRoutes";
import ReviewSection from "../components/ReviewSection";
import { useFavorites } from "../hooks/useFavorites";
import LoadingSpinner from "../components/LoadingSpinner";
import MovieImage from "../components/MovieImage";
import { Heart, Star, Play, X } from "lucide-react";
import { API_ROUTES } from "../config/apiRoutes";

const MovieDetail = () => {
  const { id } = useParams();
  const [trailer, setTrailer] = useState(null);
  const [trailerLoading, setTrailerLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [showReviews, setShowReviews] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const [isFavoriteLocal, setIsFavoriteLocal] = useState(false);

  const {
    data: movie,
    loading,
    error,
  } = useFetch(() => getMovieDetails(Number(id)), [id]);

  // Efecto para verificar si la película está en favoritos
  useEffect(() => {
    if (movie) {
      setIsFavoriteLocal(isFavorite(movie.id));
    }
  }, [movie, isFavorite]);

  // Efecto para cargar el trailer
  useEffect(() => {
    const fetchTrailer = async () => {
      setTrailerLoading(true);
      try {
        const response = await getMovieVideos(id);
        if (response.results && response.results.length > 0) {
          const trailerVideo = response.results.find(
            (video) =>
              video.type === "Trailer" &&
              video.site === "YouTube" &&
              !video.name.toLowerCase().includes("anuncio")
          );
          setTrailer(trailerVideo || response.results[0] || null);
        }
      } catch (error) {
        console.error("Error fetching trailer:", error);
      } finally {
        setTrailerLoading(false);
      }
    };

    if (!loading && !error) {
      fetchTrailer();
    }
  }, [id, loading, error]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!movie) return <div>No se encontró la película</div>;

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-fixed relative"
      style={{
        backgroundImage: `url(${API_ROUTES.MOVIES.IMAGE(movie.backdrop_path, "original")})`,
      }}
    >
      {/* Overlay con gradiente */}
      <div 
        className="absolute inset-0" 
        style={{ 
          background: "linear-gradient(to bottom, rgba(10, 5, 26, 0.9) 0%, rgba(10, 5, 26, 0.95) 100%)"
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Póster */}
            <div className="md:col-span-1">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition-all duration-300" />
                <div className="relative bg-[#1A0B2E] rounded-2xl overflow-hidden border border-[#FF2DAF20] hover:border-[#FF2DAF] transition-all duration-300">
                  <MovieImage
                    path={movie.poster_path}
                    alt={movie.title}
                    className="w-full h-[600px]"
                  />
                </div>
              </div>
            </div>

            {/* Detalles */}
            <div className="md:col-span-2 space-y-8 px-4">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-4 items-center text-[#B4A9CD] text-lg">
                <span>{movie.release_date?.split("-")[0]}</span>
                <span>•</span>
                <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
                <span>•</span>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {movie.genres?.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-5 py-2 rounded-full bg-[#1A0B2E] border border-[#FF2DAF40] text-[#FFB4E1] text-sm"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>

              <p className="text-[#B4A9CD] text-lg leading-relaxed">
                {movie.overview}
              </p>

              <div className="flex flex-wrap gap-6 pt-4">
                {trailer && (
                  <button
                    onClick={() => setShowTrailer(true)}
                    className="flex items-center gap-3 px-8 py-4 rounded-full 
                      bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] 
                      text-white font-semibold text-lg
                      hover:from-[#FF6AC2] hover:to-[#B366FF]
                      transition-all duration-300
                      shadow-lg hover:shadow-[0_0_20px_rgba(255,45,175,0.4)]"
                  >
                    <Play className="w-6 h-6" />
                    Ver Trailer
                  </button>
                )}

                <button
                  onClick={() => {
                    toggleFavorite(movie.id);
                    setIsFavoriteLocal(!isFavoriteLocal);
                  }}
                  className={`flex items-center gap-3 px-8 py-4 rounded-full 
                    border-2 font-semibold text-lg transition-all duration-300
                    ${
                      isFavoriteLocal
                        ? "border-[#FF2DAF] text-[#FF2DAF] bg-[#FF2DAF20]"
                        : "border-[#B4A9CD] text-[#B4A9CD] hover:border-[#FF2DAF] hover:text-[#FF2DAF]"
                    }`}
                >
                  <Heart className={`w-6 h-6 ${isFavoriteLocal ? "fill-[#FF2DAF]" : ""}`} />
                  {isFavoriteLocal ? "En Favoritos" : "Añadir a Favoritos"}
                </button>
              </div>

              <div className="pt-10">
                <button
                  onClick={() => setShowReviews(!showReviews)}
                  className="text-[#FF2DAF] hover:text-[#FF6AC2] transition-colors font-semibold text-lg"
                >
                  {showReviews ? "Ocultar reseñas" : "Ver reseñas"}
                </button>
                {showReviews && (
                  <div className="mt-6">
                    <ReviewSection movieId={id} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal del Trailer */}
      {showTrailer && trailer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div className="relative w-full max-w-4xl mx-4">
            <button
              onClick={() => setShowTrailer(false)}
              className="absolute -top-12 right-0 text-white hover:text-[#FF2DAF] transition-colors"
            >
              <X className="w-8 h-8" />
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full rounded-2xl"
                src={getYouTubeTrailerUrl(trailer.key)}
                title="Trailer"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetail;
