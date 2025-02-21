import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, Star, Heart, LogOut } from "lucide-react";
import { ROUTES } from "../router/paths";

const ProfilePage = () => {
  const { user, logout } = useAuth();

  return (
    <div
      className="min-h-screen pt-20 pb-10 relative overflow-hidden"
      style={{ background: "#0A051A" }}
    >
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 right-20 w-96 h-96 bg-[#9B4DFF] rounded-full opacity-20 blur-[100px]"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#FF2DAF] rounded-full opacity-20 blur-[80px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] rounded-full mx-auto flex items-center justify-center mb-4">
              <User className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {user?.username}
            </h1>
          </div>

          <div className="grid gap-4">
            <Link
              to={ROUTES.USER_REVIEWS}
              className="bg-[#1A0B2E] p-6 rounded-xl border border-[#FF2DAF20] hover:border-[#FF2DAF] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <Star className="w-8 h-8 text-[#FF2DAF]" />
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Mis Reseñas
                  </h2>
                  <p className="text-gray-400">
                    Gestiona tus opiniones sobre películas
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to={ROUTES.FAVORITES}
              className="bg-[#1A0B2E] p-6 rounded-xl border border-[#FF2DAF20] hover:border-[#FF2DAF] transition-all duration-300"
            >
              <div className="flex items-center gap-4">
                <Heart className="w-8 h-8 text-[#FF2DAF]" />
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Mis Favoritos
                  </h2>
                  <p className="text-gray-400">
                    Accede a tu lista de películas favoritas
                  </p>
                </div>
              </div>
            </Link>

            <button
              onClick={logout}
              className="bg-[#1A0B2E] p-6 rounded-xl border border-[#FF2DAF20] hover:border-[#FF2DAF] transition-all duration-300 w-full text-left"
            >
              <div className="flex items-center gap-4">
                <LogOut className="w-8 h-8 text-[#FF2DAF]" />
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Cerrar Sesión
                  </h2>
                  <p className="text-gray-400">Salir de tu cuenta</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 