import jwt from "jsonwebtoken";

// Middleware para verificar el token JWT
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Acceso denegado, no autenticado" });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = verified.userId;
    next();
  } catch (err) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
};

export default authMiddleware;
