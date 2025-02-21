import cors from "cors";

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : [
      "http://localhost:5174",
      "http://localhost:5173",
      "http://localhost:80",
      "http://localhost",
      "http://localhost:4000",
      "http://frontend:5173",
      "https://accounts.google.com",
      "http://localhost:4000/api/auth/google/callback",
    ];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true); 
    }
    if (
      allowedOrigins.includes(origin) ||
      process.env.NODE_ENV === "production"
    ) {
      return callback(null, origin);
    }

    console.warn(`Intento de acceso bloqueado por CORS: ${origin}`);
    return callback(new Error("CORS bloqueado: origen no permitido"));
  },
  credentials: true, // Permitir cookies (para autenticación basada en cookies)
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
};

export default cors(corsOptions);
