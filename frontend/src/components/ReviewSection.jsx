import React, { useState, useEffect } from "react";
import { Star, Send, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { createMovieReview, getMovieReviews } from "../services/tmdb";
import Toast from "./Toast";

const ReviewSection = ({ movieId }) => {
  const { isAuthenticated, user } = useAuth();
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [userReviews, setUserReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Verificar si el usuario ya tiene una reseña
  const userHasReview = isAuthenticated && user && 
    userReviews.some(review => review.userId === user._id);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!movieId) return;
      
      setLoading(true);

      try {
        const reviews = await getMovieReviews(movieId);
        setUserReviews(reviews);

      } catch (error) {
        console.error("Error al cargar las reseñas:", error);

      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [movieId, user, isAuthenticated]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !movieId || rating === 0) return;

    setSubmitting(true);
    
    try {
      const reviewData = {
        content: newReview,
        rating: rating,
        movieId: parseInt(movieId),
        username: user.username
      };

      const response = await createMovieReview(movieId, reviewData);

      setUserReviews(prev => [...prev, {
        ...reviewData,
        _id: response._id,
        userId: user._id,
        createdAt: new Date().toISOString()
      }]);
      
      setNewReview("");
      setRating(0);
      setToastMessage("Reseña publicada con éxito");
      setShowToast(true);

    } catch (error) {
      setToastMessage(error.message);
      setShowToast(true);

    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Fecha no disponible';
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando reseñas...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Reseñas</h2>

      {isAuthenticated ? (
        !userHasReview ? (
          <form onSubmit={handleSubmitReview} className="space-y-4">
            <div className="flex items-center space-x-2">
              {Array.from({ length: 5 }).map((_, star) => (
                <button
                  key={`rating-star-${star + 1}`}
                  type="button"
                  onClick={() => setRating(star + 1)}
                  onMouseEnter={() => setHoveredStar(star + 1)}
                  onMouseLeave={() => setHoveredStar(0)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star + 1 <= (hoveredStar || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-400"
                    }`}
                  />
                </button>
              ))}
            </div>

            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Escribe tu reseña..."
              className="w-full p-3 bg-[#1A0B2E] border border-[#FF2DAF20] rounded-lg 
                       text-white placeholder-gray-400 focus:border-[#FF2DAF] 
                       focus:ring-1 focus:ring-[#FF2DAF] transition-all duration-300"
              rows="4"
              required
            />

            <button
              type="submit"
              disabled={submitting || !rating}
              className={`flex items-center justify-center gap-2 px-4 py-2 
                       bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] 
                       rounded-lg text-white font-medium
                       ${
                         submitting || !rating
                           ? "opacity-50 cursor-not-allowed"
                           : "hover:from-[#FF2DAF] hover:to-[#FF2DAF]"
                       }`}
            >
              <Send className="w-4 h-4" />
              {submitting ? "Enviando..." : "Enviar reseña"}
            </button>
          </form>
        ) : (
          <p className="text-[#FF2DAF] text-sm">
            Ya has publicado una reseña para esta película
          </p>
        )
      ) : (
        <p className="text-gray-400 text-sm">
          Inicia sesión para dejar una reseña
        </p>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {userReviews.length > 0 ? (
          userReviews.map((review) => (
            <div
              key={review._id || `${review.userId}-${review.movieId}`}
              className="p-4 bg-[#1A0B2E] border border-[#FF2DAF20] rounded-lg"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#FF2DAF20] flex items-center justify-center">
                    <User className="w-4 h-4 text-[#FF2DAF]" />
                  </div>
                  <div>
                    <p className="font-medium text-white">
                      {review.username || 'Usuario'}
                    </p>
                    <div className="flex items-center">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={`star-${review._id}-${index}`}
                          className={`w-4 h-4 ${
                            index < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-400">
                  {formatDate(review.createdAt)}
                </span>
              </div>
              <p className="mt-2 text-gray-300">{review.content}</p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">
            No hay reseñas todavía. ¡Sé el primero en opinar!
          </p>
        )}
      </div>

      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
};

export default ReviewSection;
