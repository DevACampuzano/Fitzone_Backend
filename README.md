# FitZone Backend

API REST para la gestión de clases de fitness y reservas de gimnasio, desarrollada con Node.js, Express y Sequelize.

## 📁 Estructura del Proyecto

```
FitZone_backend/
├── src/
│   ├── common/
│   │   ├── interface/      # Tipos TypeScript (db, models, general)
│   │   ├── middlewares/    # Middlewares (JWT, validaciones)
│   │   └── utils/          # Utilidades (email)
│   ├── config/
│   │   ├── environment/    # Variables de entorno
│   │   └── server/         # Configuración del servidor
│   ├── controllers/        # Lógica de negocio
│   │   ├── user.ts         # Gestión de usuarios
│   │   ├── category.ts     # Gestión de categorías
│   │   ├── schedule.ts     # Gestión de horarios
│   │   └── notification.ts # Gestión de notificaciones
│   ├── models/            # Modelos de base de datos (Sequelize)
│   │   ├── user.ts
│   │   ├── class.ts
│   │   ├── category.ts
│   │   ├── schedule.ts
│   │   └── user-schedule.ts
│   ├── routers/           # Definición de rutas
│   │   ├── user.ts        # /users
│   │   ├── category.ts    # /categories
│   │   └── schedule.ts    # /schedules
│   └── public/            # Archivos estáticos
│       ├── index.html     # Página de inicio
│       └── 404.html       # Página de error
└── package.json
```

## 🚀 Instalación y Configuración

### Prerrequisitos

- Bun
- MySQL/MariaDB

### Variables de Entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000
NODE_ENV=
AUTH_JWT_SECRET=

# Base de Datos
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_DIALECT=
DB_PORT=
SQ_LOGGING=

# SSL (Opcional)
URL_CERTIFICADO=

# Email (Nodemailer)
NODEMAILER_SERVICE=
NODEMAILER_USER=
NODEMAILER_PASSWORD=

# firebase
FIREBASE_API_KEY=
FIREBASE_PRIVATE_KEY_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_AUTH_URI=
FIREBASE_TOKEN_URI=
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=
FIREBASE_CLIENT_X509_CERT_URL=
FIREBASE_UNIVERSE_DOMAIN=
```

### Instalación

1. **Clonar el repositorio**

   ```bash
   git clone https://github.com/DevACampuzano/Fitzone_Backend
   cd FitZone_backend
   ```

2. **Instalar dependencias**

   ```bash
   bun install
   ```

3. **Configurar base de datos**

   - Crear la base de datos MySQL
   - Configurar las variables de entorno

4. **Ejecutar migraciones/sincronización**
   ```bash
   bun start
   # El servidor sincronizará automáticamente los modelos
   ```

## 🎯 Ejecución

### Desarrollo

```bash
bun run dev
# El servidor se ejecutará en http://localhost:3000
```

### Producción

```bash
bun start
```

### Con HTTPS

Si tienes certificados SSL configurados en `URL_CERTIFICADO`, el servidor se ejecutará automáticamente en HTTPS.

## 📡 API Endpoints

### Autenticación

```http
POST /users/create     # Registro de usuario
POST /users/login      # Inicio de sesión
```

### Usuarios

```http
GET  /users/progress   # Progreso del usuario (requiere JWT)
```

### Categorías

```http
GET  /categories       # Obtener todas las categorías (requiere JWT)
```

### Horarios/Clases

```http
GET  /schedules        # Obtener horarios disponibles (requiere JWT)
```

### Ejemplo de Respuesta

```json
{
  "status": true,
  "message": "Success",
  "data": {}
}
```

## 🔐 Autenticación

El API utiliza JWT (JSON Web Tokens) para la autenticación:

- **Header requerido**: `access-token: <jwt_token>`
- **Duración del token**: 12 horas
- **Middleware**: [`validateJWT`](src/common/middlewares/validate-jwt.ts)

## 🗄️ Base de Datos

### Modelos Principales

- **Users**: Usuarios del sistema
- **Category**: Categorías de clases
- **Class**: Clases de fitness
- **Schedule**: Horarios de clases
- **UserSchedule**: Reservas de usuarios

### Relaciones

<image src="./doc/image/MER.png">

## 🏗️ Tecnologías

- **Framework**: Express.js
- **ORM**: Sequelize
- **Base de Datos**: MySQL/MariaDB
- **Autenticación**: JWT + bcrypt
- **Validación**: express-validator
- **Email**: Nodemailer
- **Otros**:
  - CORS
  - Morgan (logging)
  - Compression
  - Body-parser

## 📋 Funcionalidades

- ✅ Registro y autenticación de usuarios
- ✅ Gestión de categorías de clases
- ✅ Visualización de horarios disponibles
- ✅ Sistema de reservas
- ✅ Progreso del usuario
- ✅ Envío de emails
- ✅ Soporte HTTPS
- ✅ Validación de datos
- ✅ Manejo de errores centralizado

## 🔧 Comandos Útiles

```bash
# Desarrollo con recarga automática
bun run dev

# Producción
bun start
```

## 🛡️ Seguridad

- Encriptación de contraseñas con bcrypt
- Validación JWT en rutas protegidas
- Validación de campos con express-validator
- CORS configurado
- Soporte SSL/HTTPS

## 📱 Integración

Este backend está diseñado para trabajar con la aplicación móvil React Native de FitZone. Ver repositorio: [FitZone](https://github.com/DevACampuzano/Fitzone)

## 🤝 Desarrollo

### Estructura de Controladores

Los controladores siguen el patrón:

```typescript
export class ExampleController {
  private model: ModelSeq;

  constructor() {
    this.model = db.Example;
  }

  async method() {
    return {
      code: 200,
      response: {
        status: true,
        data: {},
      },
    };
  }
}
```

### Códigos de Error

Cada módulo tiene códigos de error específicos:

- `USER_001`, `USER_002`, etc.
- `CATEGORY_001`, `CATEGORY_002`, etc.
- `SCHEDULE_001`, `SCHEDULE_002`, etc.
