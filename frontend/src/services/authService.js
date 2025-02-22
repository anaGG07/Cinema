
import { API_ROUTES } from "../config/apiRoutes";

export const fetchFromBackend = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (response.status === 401 && endpoint === API_ROUTES.USER.PROFILE) {
      return null;
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    
    if (endpoint.includes('/api/users/me')) {
      return null;
    }
    
    if (!(error.message === "Usuario no encontrado" && endpoint === API_ROUTES.USER.PROFILE)) {
      console.error(`Error en fetchFromBackend(${endpoint}):`, error);
    }
    throw error;
  }
};

export const login = (email, password) =>
  fetchFromBackend(API_ROUTES.AUTH.LOGIN, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const register = (username, email, password) =>
  fetchFromBackend(API_ROUTES.AUTH.REGISTER, {
    method: "POST",
    body: JSON.stringify({ username, email, password }),
  });

export const logout = () =>
  fetchFromBackend(API_ROUTES.AUTH.LOGOUT, { method: "POST" });

export const fetchUser = async () => {
  try {
    const data = await fetchFromBackend(API_ROUTES.USER.PROFILE);
    return data;
  } catch (error) {
    return null;
  }
};

export const loginWithGoogle = () => {
  window.location.href = `${
    API_ROUTES.AUTH.GOOGLE
  }?callbackUrl=${encodeURIComponent(window.location.origin + "/login")}`;
};
