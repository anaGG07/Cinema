import React, { useState } from "react";
import { Link } from "react-router-dom";
import { getImageUrl } from "../services/tmdb";
import Toast from "./Toast"; 
import SmallSpinner from "./SmallSpinner";
import { useFavorites } from "../context/FavoritesContext";

const MovieCard = ({ movie, showFavoriteButton = false }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const { toggleFavorite, isFavorite } = useFavorites();
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : "N/A";

  const handleFavoriteClick = async (e) => {
    e.preventDefault();

    try {

      setIsProcessing(true);
      await toggleFavorite(movie.id);
      setToastMessage(
        isFavorite(movie.id)
          ? "Película eliminada de favoritos"
          : "Película añadida a favoritos"
      );
      setShowToast(true);

    } catch (error) {

      setToastMessage("Error al gestionar favoritos");
      setShowToast(true);
      
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Link to={`/movie/${movie.id}`} className="block">
        <article className="relative card transform transition-transform duration-300 hover:scale-105">
          <div className="relative aspect-[2/3]">
            <img
              src={getImageUrl(movie.poster_path)}
              alt={movie.title}
              className="object-cover w-full h-full rounded-lg shadow-lg"
            />
            <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white py-1 px-2 rounded">
              ⭐ {rating}
            </div>
            {showFavoriteButton && (
              <button
                onClick={handleFavoriteClick}
                className={`absolute top-2 left-2 p-2 rounded-full transition-colors duration-300 ${
                  isFavorite(movie.id)
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-black/50 hover:bg-black/70"
                }`}
              >
                {isProcessing ? (
                  <SmallSpinner />
                ) : (
                  <svg
                    className="w-5 h-5"
                    fill={isFavorite(movie.id) ? "currentColor" : "none"}
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            )}
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg line-clamp-2 text-white">
              {movie.title}
            </h3>
            <p className="text-sm text-gray-500">
              {movie.release_date && new Date(movie.release_date).getFullYear()}
            </p>
          </div>
        </article>
      </Link>
      {showToast && (
        <Toast
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </>
  );
};

export default MovieCard;
