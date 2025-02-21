import { API_ROUTES } from "../config/apiRoutes";
import { fetchFromBackend } from "./authService"; 

// Obtener lista de favoritos solo si el usuario está autenticado
export const fetchFavorites = async () => {
  try {
    const data = await fetchFromBackend(API_ROUTES.AUTH.FAVORITES);
    return data || [];
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    return [];
  }
};

// Agregar o quitar favoritos
export const toggleFavorite = async (movieId) => {
  try {
    await fetchFromBackend(API_ROUTES.AUTH.ADD_TO_FAVORITES(movieId), {
      method: "POST",
    });
    
    return true;
  } catch (error) {
    console.error("Error al modificar favoritos:", error);
    return false;
  }
};
