import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // useNavigate (hook)
import { useAuth } from "../context/AuthContext";
import { getPopularMovies, getImageUrl } from "../services/tmdb";
import { loginWithGoogle } from "../services/authService";


const LoginPage = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [redirectToHome, setRedirectToHome] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    const fetchRandomMovie = async () => {
      try {
        const data = await getPopularMovies();
        if (data.results && data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.results.length);
          const movie = data.results[randomIndex];
          const backdropPath = getImageUrl(movie.backdrop_path, "original");
          setBackgroundImage(backdropPath);
        }
      } catch (error) {
        console.error("Error fetching background image:", error);
      }
    };

    fetchRandomMovie();

    // Solo ejecutar `checkOAuth()` si hay un token en la URL
    const urlParams = new URLSearchParams(window.location.search);
    const oauthToken = urlParams.get("token");

    if (oauthToken) {
      const checkOAuth = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/me`,
            {
              credentials: "include",
            }
          );

          if (response.ok) {
            setRedirectToHome(true);
          }
        } catch (error) {
          console.error("Error checking OAuth auth:", error);
        }
      };

      checkOAuth();
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!formData.email.trim()) {
      setError("El email es requerido");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("El email no es válido");
      return;
    }
    
    if (!formData.password) {
      setError("La contraseña es requerida");
      return;
    }
    
    try {
      await login(formData.email.toLowerCase(), formData.password);
      navigate("/"); 
    } catch (err) {
      setError(err.message);
    }
  };

  if (redirectToHome) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Fondo con imagen */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat blur-sm"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          transform: "scale(1.1)",
        }}
      >
        {/* Overlay con gradiente */}
        <div className="absolute inset-0 bg-[#1A0B2E]/90"></div>
      </div>

      {/* Contenedor con efecto glassmorphism */}
      <div className="relative z-10 w-[450px] h-[560px] p-6 mx-auto">
        <div
          className="bg-white/10 rounded-full border border-white/20 shadow-2xl p-10 h-full flex flex-col justify-center  hover:shadow-[0_0_30px_rgba(255,45,175,0.2)]"
          style={{
            boxShadow: "0 0 20px #FF2DAF40, 0 0 60px #9B4DFF40",
          }}
        >
          <div className="text-center space-y-2 mb-8">
            <h2 className="text-2xl font-bold">
              <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                Bienvenido a
              </span>{" "}
              <span className="bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] bg-clip-text text-transparent">
                VideoClub
              </span>
            </h2>
            <p className="text-[#B4A9CD]">Disfruta de las mejores películas</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 text-sm px-3 py-2 rounded-lg">
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
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
            </div>

            <button
              type="submit"
              className="w-full px-4 py-2 rounded-lg font-medium text-sm text-white 
                     bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] hover:from-[#FF6AC2] hover:to-[#B366FF]"
            >
              Iniciar Sesión
            </button>

            {/* Línea separadora con gradiente */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 text-[#B4A9CD] text-xs bg-[#1A0B2E]/50">
                  O continúa con
                </span>
              </div>
            </div>

            {/* Botones de redes sociales */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={loginWithGoogle}
                className="flex items-center justify-center px-3 py-2 border border-white/20
             rounded-lg bg-white/10 hover:bg-white/20 text-sm transition-all duration-300"
              >
                <svg className="h-4 w-4 text-white mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Google
              </button>
            </div>
          </form>

          <div className="mt-4 text-center">
            <p className="text-[#B4A9CD] text-xs">
              ¿No tienes una cuenta?{" "}
              <Link
                to="/register"
                className="text-[#FF2DAF] hover:text-[#FF6AC2]"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
