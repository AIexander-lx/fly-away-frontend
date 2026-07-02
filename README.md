# Fly Away Frontend

Frontend en React + TypeScript para el sistema de reserva de vuelos Fly Away.

## Cómo correrlo

1. Levanta el backend (repo `cs2031-2026-1-week14-fly-away-backend`):
   ```bash
   ./mvnw spring-boot:run
   ```
   Debe quedar corriendo en `http://localhost:8080`.

2. Copia `.env.example` a `.env` (ya trae el valor por defecto para desarrollo local):
   ```bash
   cp .env.example .env
   ```

3. Instala dependencias y corre el frontend:
   ```bash
   npm install
   npm run dev
   ```
   Se abre en `http://localhost:5173`.

> **Nota:** el backend usa una base de datos en memoria (H2). Cada vez que se reinicia, se borran los usuarios y vuelos — hay que registrar un usuario nuevo antes de poder loguearse.

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|--------------------|
| `VITE_API_URL` | Dirección real del backend (usada por el proxy de Vite, no por el navegador) | `http://localhost:8080` |

## Sobre el proxy (evita problemas de CORS)

El backend del laboratorio **no tiene CORS configurado** (no hay ningún bean `CorsConfigurationSource` ni `.cors(...)` en `Configuration.java`), aunque su documentación afirma que las solicitudes desde `localhost:5173` "funcionarán sin problemas". En la práctica, el navegador bloquea esas solicitudes.

Para no depender de ese fix en el backend (que no forma parte de este repo), el navegador nunca llama directo a `localhost:8080`. Las llamadas van a `/api/...` (mismo origen que el frontend) y `vite.config.ts` las reenvía al backend definido en `VITE_API_URL`. Al ser una petición servidor-a-servidor y no navegador-a-servidor, CORS no aplica — la app funciona igual sin importar si el backend tiene CORS configurado o no.

## Funcionalidades

- Registro (`/register`)
- Login con JWT guardado en `localStorage` (`/login`)
- Búsqueda de vuelos por número, aerolínea y rango de fechas (`/search`)
- Reserva de vuelos para usuarios autenticados
- Mis reservas y detalle de reserva (`/my-bookings`, `/bookings/:id`)
- Rutas protegidas y logout

## Estructura

```
src/
├── api.ts                    # instancia de axios + interceptor de auth
├── auth.ts                   # helpers de token y booking ids en localStorage
├── context/
│   ├── authContextValue.ts   # tipo y contexto de React
│   ├── AuthContext.tsx       # AuthProvider (estado del usuario autenticado)
│   └── useAuth.ts            # hook de acceso al contexto
├── components/                # Navbar, ProtectedRoute
├── pages/                      # Register, Login, Search, MyBookings, BookingDetail
└── types.ts                    # tipos compartidos con el backend
```
