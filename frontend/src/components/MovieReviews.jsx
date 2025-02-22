import { useFetch } from "../hooks/useFetch";
import { getMovieReviews } from "../services/tmdb.js"; // Ajusta la ruta según tu estructura de carpetas
import { LoadingSpinner } from "../components/LoadingSpinner.jsx";


const MovieReviews = ({ movieId }) => {
  const {
    data: reviews,
    loading,
    error,
  } = useFetch(() => getMovieReviews(movieId), [movieId]);

   return (
    <div className="space-y-4">
      <ReviewForm movieId={movieId} />
      
      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <div className="text-red-500 p-4">
          Ha ocurrido un error: {error.message}
        </div>
      ) : (
        reviews?.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))
      )}
    </div>
  );
};

export default MovieReviews;
