import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_ROUTES } from "../config/apiRoutes";
import { fetchFromBackend } from "../services/authService";
import { useAuth } from './AuthContext';

// 1. Crear el contexto
const FavoritesContext = createContext(null);

// 2. Crear el hook personalizado FUERA del Provider
export const FavoritesProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadFavorites = async () => {
    if (!isAuthenticated) return;

    try {
      
      setError(null);
      setLoading(true);
      const data = await fetchFromBackend(API_ROUTES.USER.FAVORITES);
      setFavorites(data || []);

    } catch (err) {
      
      setError("Error al cargar los favoritos");
      setFavorites([]);

    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = async (movieId) => {

    try {
      setError(null);
      const response = await fetchFromBackend(API_ROUTES.USER.TOGGLE_FAVORITE(movieId), {
        method: "POST",
      });
      
      if (response.isFavorite) {
        setFavorites(prev => [...prev, { id: movieId }]);

      } else {
        setFavorites(prev => prev.filter(fav => fav.id !== movieId));
      }
      
    } catch (err) {
      setError("Error al actualizar favoritos");
    }
  };

  const isFavorite = (movieId) => {
    return isAuthenticated && favorites.some(fav => fav.id === movieId);
  };

  useEffect(() => {
    loadFavorites();
  }, [isAuthenticated]);

  return (
    <FavoritesContext.Provider 
      value={{
        favorites,
        loading,
        error,
        isFavorite,
        toggleFavorite: handleToggleFavorite,
        refetch: loadFavorites
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

// 3. Crear y exportar el Provider
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites debe ser usado dentro de un FavoritesProvider');
  }
  return context;
};