import { API_ROUTES } from "../config/apiRoutes";
import { useFetch } from "../hooks/useFetch";

const MovieReviews = ({ movieId }) => {
  const {
    data: reviews,
    loading,
    error,
  } = useFetch(
    () =>
      fetch(API_ROUTES.REVIEWS.MOVIE_REVIEWS(movieId), {
        credentials: "include",
      }).then((res) => res.json()),
    [movieId]
  );

  return (
    <div className="space-y-4">
      <ReviewForm movieId={movieId} />
      {reviews?.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};

export default MovieReviews;