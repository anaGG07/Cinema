# Documentación del Backend - Aplicación de Cine

## Índice

1. [Descripción General del Proyecto](#descripción-general-del-proyecto)
2. [Stack Tecnológico](#stack-tecnológico)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Sistema de Autenticación](#sistema-de-autenticación)
5. [Endpoints de la API](#endpoints-de-la-api)
6. [Modelos de Base de Datos](#modelos-de-base-de-datos)
7. [Implementaciones de Seguridad](#implementaciones-de-seguridad)
8. [Configuración del Entorno](#configuración-del-entorno)
9. [Pruebas con Thunder Client](#guía-de-pruebas-con-thunder-client)

## Descripción General del Proyecto

Servicio backend desarrollado en Node.js para una aplicación de cine que proporciona información sobre películas, autenticación de usuarios y gestión de contenido cinematográfico. El sistema se integra con la API de TMDB y soporta múltiples métodos de autenticación.

## Stack Tecnológico

- **Entorno de Ejecución**: Node.js 20
- **Framework**: Express.js
- **Base de Datos**: MongoDB
- **Autenticación**: JWT, Passport.js (OAuth de Google)
- **Plataforma de Contenedores**: Docker
- **Gestor de Paquetes**: npm
- **Integración de API**: TMDB API

## Estructura del Proyecto

```
backend/
├── config/
│   ├── cookieConfig.js    # Configuración de cookies
│   ├── cors.js           # Configuración de CORS
│   ├── db.js            # Conexión a base de datos
│   └── passport.js      # Estrategias de autenticación
├── controllers/
│   ├── authController.js  # Lógica de autenticación
│   ├── movieController.js # Gestión de películas
│   └── userController.js  # Gestión de usuarios
├── middlewares/
│   └── authMiddleware.js  # Verificación de JWT
├── models/
│   ├── Movie.js          # Esquema de películas
│   └── User.js           # Esquema de usuarios
├── routes/
│   ├── authRoutes.js     # Rutas de autenticación
│   ├── movieRoutes.js    # Rutas de películas
|   └── userRoutes.js     # Rutas de usuarios
│ 
├── server.js             # Punto de arranque del servidor
└── app.js                # Punto de entrada de la aplicación
```

## Sistema de Autenticación

### Métodos de Autenticación

1. **Autenticación Local**

   - Autenticación basada en JWT
   - Encriptación de contraseñas con bcrypt
   - Gestión segura de cookies

2. **Proveedores OAuth**
   - OAuth 2.0 de Google
   - OAuth de GitHub

### Características de Seguridad

- Cookies HTTP-only
- Protección CORS
- Expiración de tokens JWT
- Encriptación de contraseñas
- Gestión segura de sesiones

## Endpoints de la API

### Rutas de Autenticación

Todas las rutas de autenticación tienen el prefijo `/api/auth`

#### 1. Registro de Usuario

- **Endpoint**: `POST /api/auth/register`
- **Descripción**: Registra un nuevo usuario
- **Cuerpo de la Petición**:
  ```json
  {
    "username": "ejemplo",
    "email": "ejemplo@email.com",
    "password": "contraseña123"
  }
  ```
- **Respuesta**:
  ```json
  {
    "_id": "65a48f7b34abc123",
    "username": "ejemplo",
    "email": "ejemplo@email.com",
    "token": "jwt_token"
  }
  ```

#### 2. Inicio de Sesión

- **Endpoint**: `POST /api/auth/login`
- **Descripción**: Autentica al usuario y devuelve un token
- **Cuerpo de la Petición**:
  ```json
  {
    "email": "ejemplo@email.com",
    "password": "contraseña123"
  }
  ```
- **Respuesta**:
  ```json
  {
    "message": "Inicio de sesión exitoso",
    "token": "jwt_token",
    "user": {
      "id": "user_id",
      "username": "ejemplo",
      "email": "ejemplo@email.com",
      "authType": "local"
    }
  }
  ```

### Rutas de Películas

Todas las rutas de películas tienen el prefijo `/api/movies`

#### 1. Obtener Películas Populares

- **Endpoint**: `GET /api/movies/popular`
- **Descripción**: Obtiene lista de películas populares
- **Parámetros de Consulta**:
  - page (opcional): Número de página para paginación
- **Autenticación**: No requerida

#### 2. Buscar Películas

- **Endpoint**: `GET /api/movies/search`
- **Descripción**: Busca películas por término
- **Parámetros de Consulta**:
  - query: Término de búsqueda
  - page (opcional): Número de página
- **Autenticación**: No requerida

#### 3. Detalles de Película

- **Endpoint**: `GET /api/movies/:id`
- **Descripción**: Obtiene información detallada de una película específica
- **Parámetros**:
  - id: ID de la película en TMDB
- **Autenticación**: Opcional (proporciona datos adicionales específicos del usuario si está autenticado)

### Rutas de Usuario

Todas las rutas de usuario tienen el prefijo `/api/users`

#### 1. Obtener Perfil de Usuario

- **Endpoint**: `GET /api/users/me`
- **Descripción**: Obtiene el perfil del usuario autenticado
- **Autenticación**: Requerida
- **Respuesta**:
  ```json
  {
    "id": "user_id",
    "username": "ejemplo"
  }
  ```

## Modelos de Base de Datos

### Modelo de Usuario

```javascript
{
  username: String (requerido, único),
  email: String (requerido, único),
  password: String (requerido para auth local),
  googleId: String (único, opcional),
  githubId: String (único, opcional),
  authType: String (enum: ["local", "google", "github"]),
  favoriteMovies: [Number],
  reviews: [{
    movieId: Number,
    content: String,
    rating: Number (1-5),
    createdAt: Date
  }]
}
```

### Modelo de Película

```javascript
{
  tmdbId: Number (requerido, único),
  title: String (requerido),
  overview: String (requerido),
  posterPath: String,
  releaseDate: Date,
  popularity: Number,
  comments: [{
    user: ObjectId,
    content: String,
    createdAt: Date
  }],
  favoritedBy: [ObjectId]
}
```

## Implementaciones de Seguridad

### Configuración de CORS

```javascript
const allowedOrigins = [
  "http://localhost:5174",
  "http://localhost:5173",
  // Orígenes adicionales...
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
```

### Seguridad de Cookies

```javascript
const cookieConfig = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  maxAge: 3600000,
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  domain:
    process.env.NODE_ENV === "production" ? ".tudominio.com" : "localhost",
  path: "/",
};
```

## Configuración del Entorno

Variables de entorno requeridas:

```
PORT=4000
MONGODB_URI=mongodb://mongodb:27017/cinema_db
JWT_SECRET=tu_clave_secreta_jwt
TMDB_API_KEY=tu_clave_api_tmdb
GOOGLE_CLIENT_ID=tu_client_id_de_google
GOOGLE_CLIENT_SECRET=tu_client_secret_de_google
```


## Guía de Pruebas con Thunder Client

### Configuración del Entorno

1. Crear un nuevo entorno en Thunder Client
2. Configurar variables:

```
TOKEN: [se actualizará automáticamente tras login]
```

## Rutas Auth

1. **Registro de Usuario**

- Método: POST
- URL: `http://localhost:4000/api/auth/register`
- Body:

  ```json
  {
    "username": "ejemplo",
    "email": "ejemplo@email.com",
    "password": "contraseña123"
  }
  ```

- Response:
  ```javascript
    {
        "message": "Usuario registrado exitosamente"
    }
  ```

1. **Inicio de Sesión**

- Método: POST
- URL: `http://localhost:4000/api/auth/login`
- Headers:
  ```
  Content-Type: application/json
  ```
- Body:
  ```json
  {
    "email": "ejemplo@email.com",
    "password": "contraseña123"
  }
  ```
- Response:
  ```javascript
    {
    "message": "Inicio de sesión exitoso",
    "token": "JWT",
    "user": {
        "id": "67b836302d55b51fa48ee8a7",
        "username": "ejemplo",
        "email": "ejemplo@email.com",
        "authType": "local"
        }
    }
  ```

2. **Inicio de Sesión OAuth**

- Método: GET
- URL: http://localhost:4000/api/auth/google
- No requiere headers ni body ya que redirige al flujo de OAuth de Google

### El usuario es redirigido a la página de login de Google

Después de autenticarse en Google, el usuario es redirigido a:
`http://localhost:4000/api/auth/google/callback`

Finalmente, el usuario es redirigido a:
`http://localhost:5173/login?token={JWT}`

- Response:

```javascript
{
    "message": "Inicio de sesión exitoso",
    "token": "JWT",
    "user": {
        "id": "67b836302d55b51fa48ee8a7",
        "username": "Nombre de Google",
        "email": "usuario@gmail.com",
        "authType": "google",
        "googleId": "google_id_number"
    }
}
```

Error Response (401):

```Javascript
{
    "message": "Error en autenticación con Google",
    "status": 401,
    "timestamp": "2024-02-20T16:45:32Z"
}
```

> [!NOTE] Notas importantes:
>
> A diferencia del login tradicional, este es un flujo de redirección OAuth.
> El token JWT se envía como query parameter en la URL de redirección final.
> No requiere envío de credenciales directamente ya que las maneja Google.
> El campo authType en la respuesta será "google" en lugar de "local"

## Rutas para User

3. **Obtener el perfil de usuario**

- Método: GET
- URL: `http://localhost:4000/api/users/me`
- Authorization: `Bearer {token}`

- Response:
  ```javascript
    {
        "id": "67b836302d55b51fa48ee8a7",
        "username": "ejemplo"
    }
  ```

4. **Obtener reseñas de usuario**

- Método: GET
- URL: `http://localhost:4000/api/users/me/reviews`
- Authorization: `Bearer {token}`

- Response:

```javascript
[
  {
    movieId: 1160956,
    content: "ESTE ES EL COMENTARIO QUE REALIZA EL USUARIO (RESEÑA)",
    rating: 3,
    _id: "67b793df4966b4149ddc982f",
    createdAt: "2025-02-20T20:43:11.168Z",
    movie: {
      adult: false,
      backdrop_path: "/u7AZ5CdT2af8buRjmYCPXNyJssd.jpg",
      belongs_to_collection: {
        id: 1421776,
        name: "熊猫计划（系列）",
        poster_path: "/rO62kjEpxKoi22euZlM11o2hRJe.jpg",
        backdrop_path: null,
      },
      budget: 0,
      genres: [
        {
          id: 28,
          name: "Acción",
        },
        {
          id: 35,
          name: "Comedia",
        },
      ],
      homepage: "",
      id: 1160956,
      imdb_id: "tt28630624",
      origin_country: ["CN"],
      original_language: "zh",
      original_title: "熊猫计划",
      overview: "descripción original de la API",
      popularity: 1320.538,
      poster_path: "/sul3eKDF9rb0wn2Q9wFfv61lOGi.jpg",
      production_companies: [
        {
          id: 30324,
          logo_path: "/dgwcWHsusZtDCDJ7rUikk452lBd.png",
          name: "Emei Film Studio",
          origin_country: "CN",
        },
        {
          id: 126771,
          logo_path: null,
          name: "Mandarin Motion Pictures",
          origin_country: "HK",
        },
        {
          id: 96956,
          logo_path: null,
          name: "Maoyan Entertainment",
          origin_country: "CN",
        },
        {
          id: 155372,
          logo_path: null,
          name: "Wishart Media",
          origin_country: "CN",
        },
      ],
      production_countries: [
        {
          iso_3166_1: "CN",
          name: "China",
        },
      ],
      release_date: "2024-10-01",
      revenue: 42333207,
      runtime: 99,
      spoken_languages: [
        {
          english_name: "English",
          iso_639_1: "en",
          name: "English",
        },
        {
          english_name: "Arabic",
          iso_639_1: "ar",
          name: "العربية",
        },
        {
          english_name: "Mandarin",
          iso_639_1: "zh",
          name: "普通话",
        },
      ],
      status: "Released",
      tagline: "",
      title: "Panda Plan",
      video: false,
      vote_average: 7.2,
      vote_count: 119,
    },
  },
];
```

5. **Obtener peliculas favoritas del usuario autenticado**

- Método: GET
- URL: `http://localhost:4000/api/users/me/reviews`
- Authorization: `Bearer {token}`

- Response:

```javascript
[
  {
    adult: false,
    backdrop_path: "/u7AZ5CdT2af8buRjmYCPXNyJssd.jpg",
    belongs_to_collection: {
      id: 1421776,
      name: "熊猫计划（系列）",
      poster_path: "/rO62kjEpxKoi22euZlM11o2hRJe.jpg",
      backdrop_path: null,
    },
    budget: 0,
    genres: [
      {
        id: 28,
        name: "Acción",
      },
      {
        id: 35,
        name: "Comedia",
      },
    ],
    homepage: "",
    id: 1160956,
    imdb_id: "tt28630624",
    origin_country: ["CN"],
    original_language: "zh",
    original_title: "熊猫计划",
    overview: "Descripción",
    popularity: 1320.538,
    poster_path: "/sul3eKDF9rb0wn2Q9wFfv61lOGi.jpg",
    production_companies: [
      {
        id: 30324,
        logo_path: "/dgwcWHsusZtDCDJ7rUikk452lBd.png",
        name: "Emei Film Studio",
        origin_country: "CN",
      },
      {
        id: 126771,
        logo_path: null,
        name: "Mandarin Motion Pictures",
        origin_country: "HK",
      },
      {
        id: 96956,
        logo_path: null,
        name: "Maoyan Entertainment",
        origin_country: "CN",
      },
      {
        id: 155372,
        logo_path: null,
        name: "Wishart Media",
        origin_country: "CN",
      },
    ],
    production_countries: [
      {
        iso_3166_1: "CN",
        name: "China",
      },
    ],
    release_date: "2024-10-01",
    revenue: 42333207,
    runtime: 99,
    spoken_languages: [
      {
        english_name: "English",
        iso_639_1: "en",
        name: "English",
      },
      {
        english_name: "Arabic",
        iso_639_1: "ar",
        name: "العربية",
      },
      {
        english_name: "Mandarin",
        iso_639_1: "zh",
        name: "普通话",
      },
    ],
    status: "Released",
    tagline: "",
    title: "Panda Plan",
    video: false,
    vote_average: 7.2,
    vote_count: 119,
  },
];
```


## Rutas para Movies

1. **Búsqueda de Películas Populares**

- Método: GET
- URL: http://localhost:4000/api/movies/popular?page=1
- Respuesta:

```javascript
{
  "page": 1,
  "results": [
    {
      "adult": false,
      "backdrop_path": "/cVh8Af7a9JMOJl75ML3Dg2QVEuq.jpg",
      "genre_ids": [
        12,
        10751,
        16
      ],
      "id": 762509,
      "original_language": "en",
      "original_title": "Mufasa: The Lion King",
      "overview": "Rafiki debe transmitir la leyenda de Mufasa a la joven cachorro de león Kiara, hija de Simba y Nala, y con Timón y Pumba prestando su estilo característico. Mufasa, un cachorro huérfano, perdido y solo, conoce a un simpático león llamado Taka, heredero de un linaje real. Este encuentro casual pone en marcha un viaje de un extraordinario grupo de inadaptados que buscan su destino.",
      "popularity": 3353.171,
      "poster_path": "/dmw74cWIEKaEgl5Dv3kUTcCob6D.jpg",
      "release_date": "2024-12-18",
      "title": "Mufasa: El rey león",
      "video": false,
      "vote_average": 7.463,
      "vote_count": 1175
    }... Resto de películas

]
```

2. **Búsqueda de Películas por nombe y/o página**

- Método: GET
- URL: http://localhost:4000/api/movies/search?query=matrix
- Descripción: Esta url obtiene un listado de peliculas que coinciden con el texto introducido en el input, si se introduce "matrix" aparecerán todas las pelúclas que conténgan esta palabra en el título.
- URL: http://localhost:4000/api/movies/search?query=matrix&page=2
- Descripción: Esta url obtiene un listado de peliculas que coinciden con el texto introducido en el input pero solo las contenidas en la página 2.

> [!NOTE] Ambas muestran el total de páginas que contienen peiculas con un titulo similar al introducido y la cantidad exacta de películas que contienen esa palabra.

- Respuesta:

```javascript
{
  "page": 2,
  "results": [
    {
      "adult": false,
      "backdrop_path": null,
      "genre_ids": [
        878,
        14,
        27
      ],
      "id": 259464,
      "original_language": "en",
      "original_title": "V-World Matrix",
      "overview": "Descripcion",
      "popularity": 1.506,
      "poster_path": "/4SU8oBoLRos8ZQQhuVMjTEJh3xU.jpg",
      "release_date": "1999-01-01",
      "title": "V-World Matrix",
      "video": false,
      "vote_average": 4.75,
      "vote_count": 4
    },
    {
      "adult": false,
      "backdrop_path": null,
      "genre_ids": [
        16
      ],
      "id": 393587,
      "original_language": "en",
      "original_title": "Matrix III",
      "overview": "Descripcion",
      "popularity": 0.278,
      "poster_path": "/5OwWTs0guJwcIXFgZdiDqtXLiFm.jpg",
      "release_date": "1972-11-01",
      "title": "Matrix III",
      "video": false,
      "vote_average": 7.3,
      "vote_count": 7
    },
    {
      "adult": false,
      "backdrop_path": null,
      "genre_ids": [
        99
      ],
      "id": 684729,
      "original_language": "en",
      "original_title": "Descripcion",
      "popularity": 1.028,
      "poster_path": "/zkpzfTyF7BjadH1PZKlC6kueWXf.jpg",
      "release_date": "2004-12-07",
      "title": "The Matrix Reloaded: Car Chase",
      "video": false,
      "vote_average": 7,
      "vote_count": 7
    }... Resto de películas
  ],
  "total_pages": 5,
  "total_results": 87
}
```

3. **Mostrar detalles de una película**

- Método: GET
- URL: http://localhost:4000/api/movies/603
- Descripción:

- Respuesta:

```javascript
{
  {
  "adult": false,
  "backdrop_path": "/icmmSD4vTTDKOq2vvdulafOGw93.jpg",
  "belongs_to_collection": {
    "id": 2344,
    "name": "Matrix - Colección",
    "poster_path": "/roEEKejljtahGx75nYwSlYougS9.jpg",
    "backdrop_path": "/bRm2DEgUiYciDw3myHuYFInD7la.jpg"
  },
  "budget": 63000000,
  "genres": [
    {
      "id": 28,
      "name": "Acción"
    },
    {
      "id": 878,
      "name": "Ciencia ficción"
    }
  ],
  "homepage": "",
  "id": 603,
  "imdb_id": "tt0133093",
  "origin_country": [
    "US"
  ],
  "original_language": "en",
  "original_title": "The Matrix",
  "overview": "Descripción",
  "popularity": 119.799,
  "poster_path": "/2P14LNK2zDBf84tF016blkz4Q4C.jpg",
  "production_companies": [
    {
      "id": 79,
      "logo_path": "/at4uYdwAAgNRKhZuuFX8ShKSybw.png",
      "name": "Village Roadshow Pictures",
      "origin_country": "US"
    },
    {
      "id": 372,
      "logo_path": null,
      "name": "Groucho II Film Partnership",
      "origin_country": ""
    },
    {
      "id": 1885,
      "logo_path": "/xlvoOZr4s1PygosrwZyolIFe5xs.png",
      "name": "Silver Pictures",
      "origin_country": "US"
    },
    {
      "id": 174,
      "logo_path": "/zhD3hhtKB5qyv7ZeL4uLpNxgMVU.png",
      "name": "Warner Bros. Pictures",
      "origin_country": "US"
    }
  ],
  "production_countries": [
    {
      "iso_3166_1": "US",
      "name": "United States of America"
    }
  ],
  "release_date": "1999-03-31",
  "revenue": 463517383,
  "runtime": 138,
  "spoken_languages": [
    {
      "english_name": "English",
      "iso_639_1": "en",
      "name": "English"
    }
  ],
  "status": "Released",
  "tagline": "Bienvenido al mundo real.",
  "title": "Matrix",
  "video": false,
  "vote_average": 8.221,
  "vote_count": 26060,
  "videos": []
   }
}
```

4. **Añadir una reseña a una película**

- Método: POST
- URL: `http://localhost:4000/api/movies/603/review`
- Authorization: `Bearer {token}`

- Body:

```json
{
  "content": "Excelente película",
  "rating": 5
}
```

- Response:

```javascript
    {
        "message": "Reseña añadida correctamente"
    }
```

5. **Mostrar reseñas de una película**

- Método: GET
- URL: `http://localhost:4000/api/movies/603/reviews`
- Descripción:

- Respuesta:

```javascript
[
  {
    "username": "ana",
    "content": "Excelente película",
    "rating": 5,
    "createdAt": "2025-02-21T09:19:21.718Z"
  }
]
```

6. **Alternar peliculas favoritas**

- Método: POST
- URL: `http://localhost:4000/api/movies/603/favorite`
- Authorization: `Bearer {token}`

- Respuestas:

```javascript
    {
        "message": "Película añadida a favoritos",
        "isFavorite": true
    }

    ó

    {
        "message": "Película eliminada de favoritos",
        "isFavorite": false
    }
```


7. **Obtener géneros**

- Método: GET
- URL: `http://localhost:4000/api/movies/genres`
- Authorization: `Bearer {token}`

- Respuestas:

```javascript
   {
  "genres": [
    {
      "id": 28,
      "name": "Acción"
    },
    {
      "id": 12,
      "name": "Aventura"
    },
    {
      "id": 16,
      "name": "Animación"
    },
    {
      "id": 35,
      "name": "Comedia"
    },
    {
      "id": 80,
      "name": "Crimen"
    },
    {
      "id": 99,
      "name": "Documental"
    },
    {
      "id": 18,
      "name": "Drama"
    },
    {
      "id": 10751,
      "name": "Familia"
    },
    {
      "id": 14,
      "name": "Fantasía"
    },
    {
      "id": 36,
      "name": "Historia"
    },
    {
      "id": 27,
      "name": "Terror"
    },
    {
      "id": 10402,
      "name": "Música"
    },
    {
      "id": 9648,
      "name": "Misterio"
    },
    {
      "id": 10749,
      "name": "Romance"
    },
    {
      "id": 878,
      "name": "Ciencia ficción"
    },
    {
      "id": 10770,
      "name": "Película de TV"
    },
    {
      "id": 53,
      "name": "Suspense"
    },
    {
      "id": 10752,
      "name": "Bélica"
    },
    {
      "id": 37,
      "name": "Western"
    }
  ]
}
```
