import React from "react";
import { Link } from "react-router-dom";
import { Film } from "lucide-react";

const ErrorPage = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "#0A051A" }}
    >
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Punto de luz superior derecha */}
        <div className="absolute -top-20 right-20 w-96 h-96 bg-[#9B4DFF] rounded-full opacity-20 blur-[100px]"></div>

        {/* Punto de luz inferior izquierda */}
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-[#FF2DAF] rounded-full opacity-20 blur-[80px]"></div>

        {/* Patrón de puntos */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, #FF2DAF10 0.5px, transparent 0.5px)`,
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center">
        <div className="w-32 h-32 mx-auto mb-6 text-[#FF2DAF] opacity-50">
          <Film className="w-full h-full" />
        </div>

        <h1 className="text-9xl font-extrabold mb-4">
          <span className="bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] bg-clip-text text-transparent">
            404
          </span>
        </h1>

        <p className="text-2xl text-[#FFB4E1] mb-8">
          ¡Vaya! La página que buscas no existe.
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 px-8 py-4 rounded-full 
                   bg-gradient-to-r from-[#FF2DAF] to-[#9B4DFF] 
                   text-white font-semibold 
                   hover:from-[#FF6AC2] hover:to-[#B366FF]
                   transition-all duration-300 
                   shadow-lg hover:shadow-[0_0_20px_rgba(255,45,175,0.4)]"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  );
};

export default ErrorPage;
