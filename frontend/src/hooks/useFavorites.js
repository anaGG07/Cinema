import { useState, useEffect } from "react";
import { fetchFavorites, toggleFavorite } from "../services/favoritesService";
import { useAuth } from "../context/AuthContext"; 

export const useFavorites = () => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = async () => {
    if (!isAuthenticated) return;

    try {
      setLoading(true);
      const data = await fetchFavorites();
      setFavorites(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  
  const isFavorite = (movieId) => {
    return favorites.some((favorite) => favorite.id === movieId);
  };

  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]); // Solo cargar cuando el usuario está autenticado

  return {
    favorites,
    loading,
    error,
    isFavorite,
    toggleFavorite,
    refetch: loadFavorites,
  };
};
