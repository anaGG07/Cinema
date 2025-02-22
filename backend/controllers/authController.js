import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { cookieConfig } from "../config/cookieConfig.js";

// En authController.js
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario incluyendo el campo password
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar si es un usuario de OAuth intentando hacer login tradicional
    if (user.authType !== 'local') {
      return res.status(400).json({ 
        message: "Este correo está registrado con " + user.authType + ". Por favor, use ese método para iniciar sesión."
      });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("token", token, cookieConfig);


    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        authType: user.authType
      }
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Controlador para el registro de usuarios
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Verificar si el usuario o email ya existen
    const existingUser = await User.findOne({ 
      $or: [
        { username },
        { email: email.toLowerCase() }
      ]
    });

    if (existingUser) {
      return res.status(409).json({ 
        message: existingUser.username === username 
          ? "El nombre de usuario ya está en uso" 
          : "El email ya está registrado" 
      });
    }

    // Crear y guardar el nuevo usuario
    const user = new User({ 
      username, 
      email: email.toLowerCase(), 
      password 
    });

    await user.save();
    res.status(201).json({ message: "Usuario registrado exitosamente" });

  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

const logout = (req, res) => {
  res.cookie("token", "", { ...cookieConfig, maxAge: 0 });

  res.json({ message: "Sesión cerrada exitosamente" });
};

// Actualizar también las rutas de OAuth
export const handleOAuthCallback = (req, res) => {
  
  const token = jwt.sign({ userId: req.user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.cookie("token", token, cookieConfig);
  res.redirect(process.env.FRONTEND_URL || "http://localhost:5173");

};

// Exportar las funciones
export { login, logout, register };
