# 🌱 TmbControl – Plataforma de Control para Planta TMB

Este repositorio contiene una solución completa para la supervisión y mejora del proceso productivo de una Planta de Tratamiento Mecánico Biológico (TMB). El sistema permite la digitalización, automatización y visualización de datos clave relacionados con la gestión de residuos, producción de energía, obtención de valorizables y compost.

La plataforma se compone de tres proyectos principales:

- [`Backend`](./Backend): API REST modular en .NET 8 y PostgreSQL.
- [`Frontend`](./Frontend): Interfaz web en ReactJS y TailwindCSS.
- [`ExcelWorker`](./ExcelWorker): Servicio en segundo plano para ingesta automática de datos desde Excel.

---

## 🏗 Estructura del Repositorio

```
.
├── Backend/        # API REST modular con autenticación, EF Core y SignalR
├── Frontend/       # Aplicación React para visualización y gestión operativa
└── ExcelWorker/    # Servicio de lectura de Excel y envío automatizado de datos
```

---

## 🧱 Tecnologías Clave

- **Backend**: .NET 8, PostgreSQL, Entity Framework Core, Minimal APIs, Vertical Slice Architecture, JWT Auth, Swagger, SignalR.
- **Frontend**: React 19, Vite, TypeScript, TailwindCSS 4, Zustand, React Query, Orval.
- **Worker Service**: .NET 8, ClosedXML, llamadas REST seguras con autenticación.

---

## 🚀 ¿Qué resuelve este sistema?

La planta TMB de Vitoria-Gasteiz trata residuos urbanos con procesos de compostaje, biometanización y separación de fracciones reciclables. Esta plataforma digital:

- Sustituye hojas de Excel y papel por interfaces centralizadas y seguras.
- Automatiza la carga de datos desde hojas Excel externas mediante un servicio ETL.
- Permite visualizar en tiempo real indicadores críticos.
- Facilita la gestión de **comunicaciones externas** y su trazabilidad documental en árbol.
- Mejora el **control operativo** de maquinaria e instalaciones, con histórico de revisiones detallado.
- Permite establecer, seguir y actualizar **objetivos estratégicos** de la planta.
- Gestiona los distintos **sitios operativos** y su información técnica.
- Mejora la trazabilidad general de la planta mediante un backend modular y escalable.

---

## 📦 Instalación rápida

### 1. Clona el repositorio

```bash
git clone https://github.com/tuusuario/TmbControl.git
cd TmbControl
```

### 2. Sigue las instrucciones específicas en cada subcarpeta:

- [`Backend/README.md`](./Backend/README.md)
- [`Frontend/README.md`](./Frontend/README.md)
- [`ExcelWorker/README.md`](./ExcelWorker/README.md)

---

### 🐳 Despliegue con Docker

Este repositorio incluye un archivo `docker-compose.yml` en la raíz para facilitar el despliegue completo en un VPS o servidor local.

#### Servicios incluidos:

- **PostgreSQL** como base de datos principal.
- **Mailhog** para pruebas de envío de correos.
- **Backend API** (.NET 8) expuesto en el puerto `5000`.
- **Frontend** (React + Nginx) servido en el puerto `80`.

#### Ejecutar:

```bash
docker compose up -d
```

> Asegúrate de tener configuradas las variables de entorno y archivos necesarios antes de ejecutar.

📄 Consulta la guía completa de despliegue paso a paso aquí:  
👉 [`Publicar_En_VPS.md`](./Publicar_En_VPS.md)

---

## 📜 Licencia

MIT – Puedes usar, modificar y distribuir este software bajo los términos de la licencia.
