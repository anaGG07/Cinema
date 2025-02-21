import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getPopularMovies, getImageUrl } from "../services/tmdb";

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        const data = await getPopularMovies();
        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const movie = data.results[randomIndex];
          setBackgroundImage(getImageUrl(movie.backdrop_path, "original"));
        }
      } catch (error) {
        console.error("Error al obtener imagen de fondo:", error);
      }
    };

    fetchRandomMovie();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validaciones antes de enviar el formulario
    if (!formData.username.trim())
      return setError("El nombre de usuario es requerido");
    if (!formData.email.trim()) return setError("El email es requerido");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email))
      return setError("El email no es válido");

    if (formData.password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres");
    if (formData.password !== formData.confirmPassword)
      return setError("Las contraseñas no coinciden");

    try {
      await register(formData.username, formData.email, formData.password);
      navigate("/login"); // Redirigir al login tras el registro
    } catch (err) {
      setError(err.message || "Error durante el registro. Intenta de nuevo.");
      console.error("Error en el registro:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden pt-10">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: "scale(1.1)",
        }}
      >
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-gradient-to-br bg-[#1A0B2E]/90"></div>
      </div>

      {/* Contenedor con efecto glassmorphism */}
      <div className="relative z-10 w-[400px] h-[550px] p-5 mx-auto mb-15">
        <div
          className="bg-white/10 rounded-full border border-white/20 shadow-2xl p-10 h-full flex flex-col justify-center"
          style={{
            boxShadow: "0 0 20px #FF2DAF40, 0 0 60px #9B4DFF40",
          }}
        >
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-2">
              Únete a VideoClub
            </h2>
            <p className="text-[#FFB4E1] text-sm">
              Crea tu cuenta y comienza a disfrutar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-3 py-2 rounded-lg">
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              {/* Input de Username */}
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Nombre de usuario"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm
                         text-white placeholder-gray-300 focus:outline-none focus:ring-1 
                         focus:ring-[#FF2DAF] focus:border-transparent"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      username: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Input de Email */}
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm
                         text-white placeholder-gray-300 focus:outline-none focus:ring-1
                         focus:ring-[#FF2DAF] focus:border-transparent"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                />
              </div>

              {/* Input de Password */}
              <div>
                <input
                  type="password"
                  name="password"
                  placeholder="Contraseña"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm
                         text-white placeholder-gray-300 focus:outline-none focus:ring-1
                         focus:ring-[#FF2DAF] focus:border-transparent"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      password: e.target.value,
                    }))
                  }
                />
              </div>

              {/* Input de Confirmar Password */}
              <div>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirmar Contraseña"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-sm
                         text-white placeholder-gray-300 focus:outline-none focus:ring-1
                         focus:ring-[#FF2DAF] focus:border-transparent"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            {/* Botón de submit con gradiente neón */}
            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-medium text-sm text-white
                     bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] hover:from-[#FF6AC2] hover:to-[#B366FF]"
            >
              Crear Cuenta
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-[#B4A9CD] text-xs">
              ¿Ya tienes una cuenta?{" "}
              <Link to="/login" className="text-[#FF2DAF] hover:text-[#FF6AC2]">
                Inicia sesión aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
