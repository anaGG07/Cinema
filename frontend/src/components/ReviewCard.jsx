import React from "react";

const ReviewCard = ({ review, showMovieInfo = false }) => {
  const { username, content, rating, createdAt, movie } = review;
  const date = new Date(createdAt).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="text-lg font-semibold text-white">{username}</h4>
          {showMovieInfo && movie && (
            <p className="text-gray-400 text-sm">{movie.title}</p>
          )}
          <div className="flex items-center mt-1">
            {[...Array(5)].map((_, index) => (
              <span
                key={index}
                className={`${
                  index < rating ? "text-yellow-400" : "text-gray-600"
                } text-2xl`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
        <span className="text-sm text-gray-400">{date}</span>
      </div>
      <p className="text-gray-300 mt-2">{content}</p>
    </div>
  );
};

export default ReviewCard;