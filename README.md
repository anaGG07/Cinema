# 🎬 VideoClub App - Documentación

## 📖 Descripción General
Esta es una aplicación web que permite a los usuarios **explorar, buscar y guardar películas favoritas**. Desarrollada con una arquitectura moderna, ofrece una experiencia de usuario completa e interactiva.

La aplicación utiliza **React (Frontend)** y **Node.js con Express (Backend)**, junto con **MongoDB** como base de datos, integrándose con **TheMovieDB API** para obtener datos de películas en tiempo real.

---

## 🚀 Tecnologías Utilizadas

### **Frontend**
- ⚛️ **React.js** (con Vite y React Router v7)
- 🎨 **TailwindCSS 4.0** (diseño moderno y responsive)
- 🔄 **Context API** (gestión de estado global)
- 🌐 **Fetch API** (comunicación con backend)
- 🔒 **React Router** (protección de rutas)

### **Backend**
- 🌐 **Node.js con Express**
- 🛢️ **MongoDB con Mongoose**
- 🔑 **JWT (JSON Web Token)** 
- 🍪 **Cookies HTTPOnly** (autenticación segura)
- 🔐 **Passport.js** (autenticación OAuth)
- 🐳 **Docker** (contenedorización)

---

## 📌 Funcionalidades Clave
- 🎥 **Exploración de películas populares**
- 🔍 **Búsqueda de películas**
- ⭐ **Sistema de películas favoritas**
- 💬 **Sistema de reseñas**
- 👤 **Autenticación múltiple** (Local, Google, GitHub)
- 🔒 **Protección de rutas**
- 🌈 **Diseño responsive y moderno**

---

## 🔥 Características Técnicas Destacadas

### 🚀 Autenticación Avanzada
- **Múltiples métodos de inicio de sesión**:
  - Registro local
  - Inicio de sesión con Google
  - Inicio de sesión con GitHub
- **Tokens JWT con cookies HTTPOnly**
- **Protección contra ataques CSRF**

### 🔒 Seguridad
- Almacenamiento seguro de contraseñas (bcrypt)
- Validación de datos en backend
- Middleware de autenticación
- Scopes de OAuth limitados
- Gestión segura de sesiones

### 🌐 Integración con TheMovieDB
- Obtención dinámica de datos de películas
- Almacenamiento en caché de información
- Búsqueda y filtrado avanzado

### 💾 Gestión de Estado
- **Context API** para estado global
- Gestión de favoritos en tiempo real
- Actualización dinámica de la interfaz

---

## 📌 Estructura del Proyecto
```
📂 videoclub-app
 ├── 📂 backend
 │   ├── 📂 config
 │   │   ├── passport.js
 │   │   ├── cors.js
 │   │   └── db.js
 │   ├── 📂 controllers
 │   ├── 📂 models
 │   ├── 📂 routes
 │   ├── 📂 middlewares
 │   ├── Dockerfile
 │   └── .env
 │
 ├── 📂 frontend
 │   ├── 📂 src
 │   │   ├── 📂 components
 │   │   ├── 📂 context
 │   │   ├── 📂 pages
 │   │   ├── 📂 services
 │   │   └── 📂 utils
 │   ├── Dockerfile
 │   └── .env
 │
 ├── docker-compose.yml
 └── README.md
```

---

## 📥 Instalación y Configuración

### **1️⃣ Clonar el Repositorio**
```bash
git clone https://github.com/anaGG07/videoclub-app.git
cd videoclub-app
```

### **2️⃣ Configurar Backend**
1. Instalar dependencias:
```bash
cd backend
npm install
```

2. Configurar variables de entorno (.env):
```bash
PORT=4000
MONGODB_URI=mongodb://mongodb:27017/videoclub
JWT_SECRET=tu_secret_seguro
TMDB_API_KEY=tu_api_key_themoviedb
```

### **3️⃣ Configurar Frontend**
1. Instalar dependencias:
```bash
cd frontend
npm install
```

2. Configurar variables de entorno (.env):
```bash
VITE_API_URL=http://localhost:4000/api
```

### **Ejecución con Docker**
```bash
# En la raíz del proyecto
docker-compose up --build
```

### **Ejecución sin Docker**
1. Iniciar Backend:
```bash
cd backend
npm start
```

2. Iniciar Frontend:
```bash
cd frontend
npm run dev
```

---

## 🔍 Endpoints Principales de API

### 🔐 Autenticación
- `POST /api/auth/register`: Registro de usuario
- `POST /api/auth/login`: Inicio de sesión
- `POST /api/auth/logout`: Cierre de sesión
- `GET /api/auth/google`: Inicio de sesión con Google
- `GET /api/auth/github`: Inicio de sesión con GitHub

### 🎬 Películas
- `GET /api/movies/popular`: Películas populares
- `GET /api/movies/search`: Búsqueda de películas
- `GET /api/movies/:id`: Detalles de película

### ⭐ Favoritos
- `POST /api/movies/:movieId/favorite`: Añadir a favoritos
- `DELETE /api/movies/:movieId/favorite`: Eliminar de favoritos
- `GET /api/movies/user/favorites`: Obtener favoritos del usuario

### 💬 Reseñas
- `POST /api/movies/:movieId/review`: Añadir reseña
- `GET /api/movies/:movieId/reviews`: Obtener reseñas de película

---

## 🛡 Seguridad y Buenas Prácticas

### Protección de Rutas
- Middleware de autenticación
- Tokens JWT con expiración
- Cookies HTTPOnly
- Scopes de OAuth limitados

### Validación de Datos
- Esquemas de Mongoose
- Validación de entrada en controladores
- Manejo de errores centralizado

---

## 🛠 Autor y Créditos
📌 **Desarrollado por:** Ana María García

📌 **Datos de películas:** [TheMovieDB](https://www.themoviedb.org/)

