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
git clone https://github.com/anaGG07/Cinema.git
cd cinema
```

### **2️⃣ Configurar Backend**
1. Instalar dependencias:
```bash
cd backend
npm install
```

### **3️⃣ Configurar Frontend**
Instalar dependencias:
```bash
cd frontend
npm install
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

## 🛢️ Acceso a MongoDB desde Docker Desktop

Acceder al contenedor:
```bash
docker exec -it mongodb mongosh
```

Mediante interfaz:

![Mediante interfaz](Documentacion\img\image.png)

Comandos útiles:


```bash
# Mostrar bases de datos
show dbs

# Usar base de datos
use cinema_db

# Mostrar colecciones
show collections

# Ver usuarios registrados
db.users.find().pretty()

# Ver usuarios que tienen al menos una reseña
db.users.find({ reviews: { $exists: true, $ne: [] } })

# Ver favoritos de un usuario
db.users.find({ _id: ObjectId("ID_USUARIO") }, { favoriteMovies: 1 })

# Ver peliculas registradas
db.movies.find().pretty()

# Ver peliculas que tienen al menos una reseña
db.movies.find({ reviews: { $exists: true, $ne: [] } })

# Ver todas las reseñas de una pelicula concreta
db.movies.find({ tmdbId: <id_tmdb> }, { reviews: 1, title: 1 })
# db.movies.find({ tmdbId: 939243 }, { reviews: 1, title: 1 })
```


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

