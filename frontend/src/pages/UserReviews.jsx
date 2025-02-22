import React from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb";
import { API_ROUTES } from "../config/apiRoutes";
import { useFetch } from "../hooks/useFetch";
import { Star, Film, ArrowRight } from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";

const UserReviews = () => {
  const {
    data: reviews,
    loading,
    error,
  } = useFetch(
    () =>
      fetch(API_ROUTES.USER.REVIEWS, {
        credentials: "include",
      }).then((res) => {
        if (!res.ok) throw new Error("Error al cargar las reseñas");
        return res.json();
      }),
    []
  );

  // Loading State
  if (loading) {
    return <LoadingSpinner />;
  }

  // Error State
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
            Error al cargar las reseñas
          </h3>
          <p className="text-[#B4A9CD] max-w-md mx-auto">{error.message}</p>
        </div>
      </div>
    );
  }

  // Empty State
  if (!reviews || reviews.length === 0) {
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
            <Film className="w-full h-full" />
          </div>
          <h3 className="text-4xl font-bold text-[#FFB4E1] mb-4">
            No tienes reseñas aún
          </h3>
          <p className="text-[#B4A9CD] max-w-md mx-auto mb-8">
            ¡Explora películas increíbles y comparte tu opinión!
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

  // Reviews List
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

      <div className="container mx-auto px-4 relative z-10">
        <h1 className="text-5xl font-bold text-white mb-12 text-center">
          Mis Reseñas
        </h1>

        <div className="grid gap-8 max-w-4xl mx-auto">
          {Array.isArray(reviews) &&
            reviews.map((review, index) => (
              <div
                key={`${review.movieId}-${review.createdAt}`}
                className="relative group"
              >
                {/* Glowing border effect */}
                <div
                  className="absolute -inset-0.5 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] 
                  rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition-all duration-300"
                ></div>

                <div
                  className="relative bg-[#1A0B2E] rounded-2xl p-6 border border-[#FF2DAF20] 
                  overflow-hidden transition-all duration-300 
                  hover:border-[#FF2DAF] hover:shadow-[0_0_20px_rgba(255,45,175,0.2)]"
                >
                  <div className="flex items-center gap-6">
                    <Link
                      to={`/movie/${review.movie.id}`}
                      className="flex-shrink-0 transform group-hover:scale-105 transition-transform"
                    >
                      <img
                        src={getImageUrl(review.movie.poster_path)}
                        alt={review.movie.title}
                        className="w-40 rounded-lg shadow-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <Link
                        to={`/movie/${review.movie.id}`}
                        className="text-3xl font-bold text-white 
                        hover:text-[#FF2DAF] transition-colors"
                      >
                        {review.movie.title}
                      </Link>
                      <div className="flex items-center mt-3 mb-4">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-6 h-6 ${
                              index < review.rating
                                ? "text-yellow-400"
                                : "text-gray-600"
                            }`}
                            fill={index < review.rating ? "#FFD700" : "none"}
                          />
                        ))}
                      </div>
                      <p className="text-gray-300 mb-4 italic">
                        "{review.content}"
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-400">
                          {new Date(review.createdAt).toLocaleDateString(
                            "es-ES",
                            {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }
                          )}
                        </span>
                        <Link
                          to={`/movie/${review.movie.id}`}
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
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UserReviews;
