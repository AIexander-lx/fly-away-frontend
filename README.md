# Fly Away Frontend

Frontend en React + TypeScript para el sistema de reserva de vuelos Fly Away (CS2031 - Semana 14).

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

## Variables de entorno

| Variable | Descripción | Valor por defecto |
|----------|-------------|--------------------|
| `VITE_API_URL` | Base URL del backend | `http://localhost:8080` |

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
├── api.ts               # instancia de axios + interceptor de auth
├── auth.ts               # helpers de token y booking ids en localStorage
├── context/AuthContext   # estado del usuario autenticado
├── components/           # Navbar, ProtectedRoute
├── pages/                 # Register, Login, Search, MyBookings, BookingDetail
└── types.ts               # tipos compartidos con el backend
```
