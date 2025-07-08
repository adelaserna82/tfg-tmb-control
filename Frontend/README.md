# TmbControl Frontend

Frontend del sistema de control de planta TMB desarrollado en **ReactJS**, **TypeScript** y **TailwindCSS**.

## 🧱 Arquitectura

- **React + Vite** para desarrollo rápido y optimizado.
- **TailwindCSS** para estilos consistentes y utilitarios.
- **React Router** para navegación entre módulos.
- **React Query** para gestión de estado remoto y caché.
- **Orval** para generación automática de clientes desde OpenAPI.
- **SignalR** para actualizaciones en tiempo real.
- **Zustand** para estado global sencillo y eficaz.

## 📂 Estructura

```
src/
├── components/              # Componentes reutilizables
├── modules/
│   ├── communications/
│   ├── indicators/
│   ├── objectives/
│   ├── operational-control/
│   ├── users/
│   └── sites/
├── store/                   # Estado global (Zustand)
├── api/                     # Clientes generados con Orval
├── assets/                  # Imágenes y recursos estáticos
├── layout/                  # Estructura principal de la app
└── main.tsx                 # Punto de entrada
```

## 🧪 Primeros pasos

### Configurar entorno

Renombra `.env.example` como `.env` y define las siguientes variables:

```env
VITE_API_KEY_HEADER_NAME="<escribe el nombre del header del ApiKey>"
VITE_API_KEY_VALUE="<escribe el valor del ApiKey>"
VITE_API_URL="<escribe la url del API>"
VITE_API_USER_APP_STATE_NAME="<escribe el nombre de la variable de estado en localStorage>"
```

## 🚀 Ejecutar en modo desarrollo

```bash
npm run dev
```

Accede a la app en [http://localhost:5173](http://localhost:5173)

## 🛠️ Scripts disponibles

- `npm run dev` – Arranca el servidor en modo desarrollo.
- `npm run build` – Compila la app para producción.
- `npm run preview` – Previsualiza la build.
- `npm run api:generate` – Genera clientes a partir de OpenAPI.
- `npm run api:watch` – Observa cambios en OpenAPI y regenera.
- `npm run lint` – Linter con ESLint.

## 🧰 Tecnologías

- React 19
- TypeScript
- Vite
- TailwindCSS 4
- React Router v7
- React Query 5
- Zustand
- SignalR
- Orval
- FontAwesome, Heroicons, React Icons
- Recharts (gráficas)
- React Toastify (notificaciones)

## 🧪 Pruebas

Actualmente no se incluyen pruebas automatizadas. Se recomienda integrar Jest, Testing Library y Playwright en futuras versiones.

## 📜 Licencia

MIT