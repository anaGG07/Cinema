import { cookieConfig } from "./config/cookieConfig.js";
import cookieParser from "cookie-parser";
import express from "express";
import session from "express-session";
import connectDB from "./config/db.js";
import passport from "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import cors from "./config/cors.js";

const app = express();

app.use(express.json());
app.use(cors);
app.use(cookieParser());

// Añadir configuración de express-session antes de passport
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: cookieConfig, // Usar la configuración externa
  })
);

// Inicializar Passport y la sesión de Passport
app.use(passport.initialize());
app.use(passport.session());

// Conectar a MongoDB
connectDB();

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/movies", movieRoutes);

export default app;
