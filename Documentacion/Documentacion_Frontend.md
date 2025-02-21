# 🎬 CineClub - Documentación

## 📖 Descripción General
CineClub es una aplicación web que permite a los usuarios **explorar, buscar y gestionar sus películas favoritas**. Los usuarios pueden **registrarse, iniciar sesión y realizar reseñas sobre las películas**. La aplicación está construida con **React (Frontend)** y se integra con **The Movie Database (TMDB)** para obtener información actualizada sobre películas.

---

## 🚀 Tecnologías Utilizadas

### **Frontend**
- ⚛️ **React.js** (con Vite y React Router)
- 🎨 **TailwindCSS** (para los estilos y diseño moderno)
- 🔄 **Context API** (para gestión de estado global de autenticación y favoritos)
- 🌐 **Fetch API** (para comunicarse con la API de TMDB y el backend)
- 🔔 **Sonner** (para notificaciones visuales)

---

## 📌 Funcionalidades Clave
- 🔍 **Buscar películas** por nombre o género.
- ⭐ **Agregar y gestionar favoritos**.
- 📝 **Escribir y ver reseñas de películas**.
- 👤 **Registro e inicio de sesión con JWT y OAuth (Google, GitHub)**.
- 🏆 **Explorar películas populares y de distintos géneros**.
- 🖥 **Modo protegido para rutas de usuario autenticado**.

---

## 📌 Estructura del Proyecto
```
📂 cineclub-frontend
 ├── 📂 src
 │   ├── 📂 components
 │   ├── 📂 config
 │   │   ├── apiRoutes.js
 │   ├── 📂 context
 │   │   ├── AuthContext.jsx
 │   │   ├── FavoritesContext.jsx
 │   ├── 📂 hooks
 │   │   ├── useFavorites.js
 │   │   ├── useFetch.js
 │   ├── 📂 layouts
 │   │   ├── RootLayout.jsx
 │   ├── 📂 pages
 │   ├── 📂 router
 │   │   ├── index.jsx
 │   │   ├── paths.js
 │   ├── 📂 services
 │   │   ├── tmdb.js
 │   ├── App.jsx
 │   ├── main.jsx
 │   ├── index.html
 
```

---


## 📌 API Integrada
El frontend consume la API proporcionada por el backend. Algunos endpoints utilizados incluyen:

### 📍 **Películas**
#### 🔹 **Obtener películas populares**
**Endpoint:** `GET /api/movies/popular`

#### 🔹 **Buscar películas**
**Endpoint:** `GET /api/movies/search?query=nombre`

### 📍 **Favoritos**
#### 🔹 **Obtener favoritos del usuario**
**Endpoint:** `GET /api/user/favorites`

#### 🔹 **Agregar a favoritos**
**Endpoint:** `POST /api/user/favorites/{id}`

#### 🔹 **Eliminar de favoritos**
**Endpoint:** `DELETE /api/user/favorites/{id}`

### 📍 **Reseñas**
#### 🔹 **Obtener reseñas de una película**
**Endpoint:** `GET /api/movies/{id}/reviews`

#### 🔹 **Crear reseña**
**Endpoint:** `POST /api/movies/{id}/review`
```json
{
  "rating": 5,
  "content": "Gran película!"
}
```

---

## 🛠 Autor y Créditos
📌 **Desarrollado por:** Ana María García García.

