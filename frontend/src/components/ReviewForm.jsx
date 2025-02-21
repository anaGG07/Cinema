import { useState } from "react";
import { API_ROUTES } from "../config/apiRoutes";
import SmallSpinner from "./SmallSpinner";

const ReviewForm = ({ movieId, onReviewSubmitted }) => {
  const [review, setReview] = useState({ content: "", rating: 5 });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch(API_ROUTES.REVIEWS.CREATE(movieId), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(review),
      });

      if (!response.ok) throw new Error("Error al enviar la reseña");

      onReviewSubmitted?.();
      setReview({ content: "", rating: 5 });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-gray-800 p-4 rounded-lg">
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Valoración</label>
        <div className="flex items-center space-x-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setReview((prev) => ({ ...prev, rating: star }))}
              className={`h-8 w-8 ${
                star <= review.rating ? "text-yellow-400" : "text-gray-400"
              }`}
            >
              ★
            </button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-300 mb-2">Tu reseña</label>
        <textarea
          value={review.content}
          onChange={(e) =>
            setReview((prev) => ({ ...prev, content: e.target.value }))
          }
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          rows="4"
          required
          minLength="10"
          maxLength="500"
        ></textarea>
      </div>
      {submitting ? (
        <SmallSpinner />
      ) : (
        <button
          type="submit"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-4 rounded-lg disabled:opacity-50"
        >
          Publicar reseña
        </button>
      )}
    </form>
  );
};

export default ReviewForm;