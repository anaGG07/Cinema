// src/context/AuthContext.jsx
import { createContext, useState, useContext, useEffect } from "react";
import { router } from "../router";
import {
  login,
  register,
  logout,
  fetchUser,
  loginWithGoogle,
} from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {

      try {
        const userData = await fetchUser();
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        }

      } catch (error) {
        console.error("Error checking auth:", error);

      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (email, password) => {

    try {
      const data = await login(email, password);

      const userData = await fetchUser();
      setUser(userData);

      setIsAuthenticated(true);
      router.navigate("/");

    } catch (error) {
      throw error;
    }
  };

  const handleLogout = async () => {

    try {
      await logout();

    } finally {

      setUser(null);
      setIsAuthenticated(false);
      router.navigate("/");
    }
  };

  const handleRegister = async (username, email, password) => {

    try {
      await register(username, email, password);
      router.navigate("/login");

    } catch (error) {
      throw new Error("Error registrando usuario");
    }
  };

  const handleAuthError = (error, defaultMessage) => {
    if (error.response?.status === 409) {
      return "El usuario ya existe";

    } else if (error.response?.status === 401) {
      return "Credenciales inválidas";
      
    } else {
      return defaultMessage || "Ocurrió un error durante la autenticación";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF2DAF]"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
        handleAuthError,
        loginWithGoogle,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};
