import dotenv from "dotenv";
import mongoose from "mongoose";

// Cargar variables de entorno
dotenv.config();

// Función para conectar a MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Conectado a MongoDB");
  } catch (error) {
    console.error("Error de conexión a MongoDB:", error);
    process.exit(1); // Salir del proceso con un código de error
  }
};

export default connectDB;
