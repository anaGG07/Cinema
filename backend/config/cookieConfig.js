export const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 24 * 60 * 60 * 1000, // 1 día
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  domain:
    process.env.NODE_ENV === "production" ? ".tudominio.com" : "localhost",
  path: "/",
}; 