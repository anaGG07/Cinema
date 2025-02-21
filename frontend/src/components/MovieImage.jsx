import React from 'react';
import { API_ROUTES } from "../config/apiRoutes";

const MovieImage = ({ path, alt, className, size = "w500" }) => {
  const imageUrl = API_ROUTES.MOVIES.IMAGE(path, size);

  return (
    <div className={`relative ${className}`}>
      {!path ? (
        <div className="absolute inset-0 bg-[#1A0B2E] flex items-center justify-center">
          <div className="text-[#FF2DAF] opacity-50">
            <svg
              className="w-24 h-24"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
          </div>
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = API_ROUTES.MOVIES.IMAGE(null, size);
          }}
        />
      )}
    </div>
  );
};

export default MovieImage; 