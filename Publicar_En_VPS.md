# 🚀 Despliegue de TmbControl en VPS con Docker

Este documento describe los pasos para subir y desplegar el backend de TmbControl junto con PostgreSQL, Mailhog y el frontend en ReactJS usando `docker-compose` en un VPS. El sistema operativo instalado en el servidor es Ubuntu 24 LTS.

------

## ✅ Instalar Docker

En tu máquina local:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
```

------

## 📁 Estructura del proyecto

Se recomienda la siguiente estructura en el VPS (`/opt/tmbcontrol`):

```
/opt/tmbcontrol/
├── docker-compose.yml
├── backend/                     # App .NET 8 publicada
│   ├── TmbControl.WebAPI.dll
│   ├── appsettings.json
│   └── ...otros archivos publicados
├── frontend/                    # React JS compilado
│   ├── index.html
│   ├── assets/
│   ├── nginx.conf               # Configuración Nginx para SPA
└── postgres/                    # Volumen de datos de PostgreSQL
```

------

## ✅ Paso 1: Compilar el frontend en local

Desde la carpeta de tu proyecto ReactJS:

```bash
npm install
npm run build
```

Esto generará una carpeta `dist/` (si usas Vite) o `build/` (si usas CRA).

------

## ✅ Paso 2: Publicar el backend en local

```bash
dotnet publish -c Release -o ./publish
```

------

## ✅ Paso 3: Subir los archivos al VPS

```bash
scp -r ./publish/* usuario@IP_DEL_VPS:/opt/tmbcontrol/backend/
scp -r ./dist/* usuario@IP_DEL_VPS:/opt/tmbcontrol/frontend/    # Para Vite
# o
scp -r ./build/* usuario@IP_DEL_VPS:/opt/tmbcontrol/frontend/   # Para CRA
```

> Asegúrate de que las carpetas `/opt/tmbcontrol/backend/` y `/opt/tmbcontrol/frontend/` existen y tienen permisos adecuados.

------

## ✅ Paso 4: Crear el archivo `nginx.conf` para el frontend

Ubicado en `/opt/tmbcontrol/frontend/nginx.conf`:

```nginx
server {
  listen 80;
  server_name _;

  root /usr/share/nginx/html;
  index index.html;

  location / {
    try_files $uri /index.html;
  }
}
```

Este archivo permite que, al recargar rutas del frontend como `/dashboard`, Nginx siempre devuelva `index.html` (comportamiento típico en apps SPA).

------

## ✅ Paso 5: Crear el archivo `docker-compose.yml`

Ubícalo en `/opt/tmbcontrol/docker-compose.yml`:

```yaml
version: '3.8'

services:
  postgres-db:
    image: postgres:15.3
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_DB: tmbcontrol
      POSTGRES_PASSWORD: <escribe la contraseña>
    volumes:
      - ./postgres:/var/lib/postgresql/data
    ports:
      - 5432:5432
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"

  mailhog:
    image: mailhog/mailhog
    restart: always
    container_name: mailhog
    ports:
      - "1025:1025"
      - "8025:8025"

  backend-api:
    image: mcr.microsoft.com/dotnet/aspnet:8.0
    container_name: backend-api
    restart: always
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Host=postgres-db;Port=5432;Database=tmbcontrol;Username=postgres;Password=<escribe la contraseña>
      - Jwt__Key=tu_clave_secreta_jwt
      - ApiKeys__0__name=<escribe un nombre descriptivo del ApiKey>
      - ApiKeys__0__key=<escribe el apikey>
      - Cors__AllowedOrigins__0=<escribe la URL a la que se permite conectar con el backend>
      - AdminUser__Name=<escribe el nombre del administrador>
      - AdminUser__Email=<escribe el email del administrador>
      - AdminUser__Password=<escribe la contraseña del administrador>
      - Smtp__Host=<escribe el host del servidor de correo SMTP (smtp.example.com)>
      - Smtp__Port=<escribe el puerto de conexión al servidor SMTP>
      - Smtp__Username=<escribe el correo de acceso>
      - Smtp__Password=<escribe la contraseña de acceso>
      - Smtp__From=<escribe la cuenta por defecto para el envío de emails automáticos>
      - Smtp__UseSsl=true
    command: ["dotnet", "TmbControl.WebAPI.dll", "--urls", "http://0.0.0.0:5000"]
    depends_on:
      - postgres-db
    logging:
      driver: json-file
      options:
        max-size: "10m"
        max-file: "5"

  frontend:
    image: nginx:stable-alpine
    container_name: frontend
    restart: always
    ports:
      - "80:80"
    volumes:
      - ./frontend:/usr/share/nginx/html:ro
      - ./frontend/nginx.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - backend-api
```

------

## ✅ Paso 6: Verificar `appsettings.json`

Debe tener la estructura base y dejar los valores sensibles vacíos:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": ""
  },
  "Jwt": {
    "Key": ""
  },
  "ApiKeys": [],
  "Cors": {
    "AllowedOrigins": []
  },
  "AdminUser": {
    "Name": "",
    "Email": "",
    "Password": ""
  },
  "Smtp": {
    "Host": "",
    "Port": 587,
    "Username": "",
    "Password": "",
    "From": "",
    "UseSsl": true
  }
}
```

------

## ✅ Paso 7: Levantar los contenedores

```bash
cd /opt/tmbcontrol
docker-compose up -d
```

------

## 🚫 Paso 8: Asegurar que los puertos están abiertos

```bash
sudo ufw allow 5000   # Backend
sudo ufw allow 5432   # PostgreSQL (opcional)
sudo ufw allow 8025   # Mailhog
sudo ufw allow 80     # Frontend
```

------

## 🔎 Paso 9: Verificar que funciona

- Frontend: `http://<IP_DEL_VPS>`
- Backend: `http://<IP_DEL_VPS>:5000/api/...`
- Mailhog: `http://<IP_DEL_VPS>:8025`

------

## 🚀 Extra: Comandos útiles

- Ver contenedores:

  ```bash
  docker ps
  ```

- Ver logs:

  ```bash
  docker logs backend-api
  ```

- Reconstruir contenedores:

  ```bash
  docker-compose up -d --build
  docker-compose up -d --force-recreate backend-api
  ```

- Si da error:

  ```bash
  docker-compose down --volumes --remove-orphans
  docker system prune -f
  docker-compose up -d
  ```