import { createBrowserRouter, Navigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { useAuth } from "../context/AuthContext";

import { ROUTES } from "./paths";

// Layouts
import RootLayout from "../layouts/RootLayout";

// Pages
import ErrorPage from "../pages/ErrorPage";
import Favorites from "../pages/Favorites";
import Home from "../pages/Home";
import MovieDetail from "../pages/MovieDetail";
import Search from "../pages/Search";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import UserReviews from "../pages/UserReviews";
import ProfilePage from "../pages/ProfilePage";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: ROUTES.MOVIE_DETAIL.replace("/", ""),
        element: (
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.LOGIN.replace("/", ""),
        element: <LoginPage />,
      },
      {
        path: ROUTES.REGISTER.replace("/", ""),
        element: <RegisterPage />,
      },
      {
        path: ROUTES.SEARCH.replace("/", ""),
        element: (
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.USER_REVIEWS.replace("/", ""),
        element: (
          <ProtectedRoute>
            <UserReviews />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.FAVORITES.replace("/", ""),
        element: (
          <ProtectedRoute>
            <Favorites />
          </ProtectedRoute>
        ),
      },
      {
        path: ROUTES.PROFILE.replace("/", ""),
        element: (
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);

export default router;
