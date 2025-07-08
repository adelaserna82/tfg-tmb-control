# TmbControl Backend

Backend modular para el sistema de control de planta TMB desarrollado en .NET 8 y PostgreSQL.

## 🧱 Arquitectura

- **Modular Monolith** con separación por esquemas en base de datos
- **Vertical Slice Architecture** usando Minimal APIs
- **Entity Framework Core 8** + PostgreSQL
- **JWT Auth**, **Swagger**

## 📂 Estructura

```
src/
├── TmbControl.WebAPI/              # Proyecto principal
├── TmbControl.Shared/             # Infraestructura común
├── TmbControl.Modules.Communications/
├── TmbControl.Modules.Indicators/
├── TmbControl.Modules.Objectives/
├── TmbControl.Modules.OperationalControl/
├── TmbControl.Modules.Sites/
├── TmbControl.Modules.Users/
```

## 🧪 Primeros pasos

### Instalar dependencias

```bash
cd TmbControl.Backend
dotnet restore
```

### Crear la base de datos

```bash

dotnet ef database update --project src/TmbControl.Modules.Indicators --startup-project src/TmbControl.WebAPI --context IndicatorsDbContext

dotnet ef database update --project src/TmbControl.Modules.Communications --startup-project src/TmbControl.WebAPI --context CommunicationsDbContext

dotnet ef database update --project src/TmbControl.Modules.OperationalControl --startup-project src/TmbControl.WebAPI --context OperationalControlDbContext

dotnet ef database update --project src/TmbControl.Modules.Objectives --startup-project src/TmbControl.WebAPI --context ObjectivesDbContext

dotnet ef database update --project src/TmbControl.Modules.Sites --startup-project src/TmbControl.WebAPI --context SitesDbContext

dotnet ef database update --project src/TmbControl.Modules.Users --startup-project src/TmbControl.WebAPI --context UsersDbContext

dotnet ef database update --project src/TmbControl.Shared --startup-project src/TmbControl.WebAPI --context SharedDbContext


```

## 🚀 Ejecutar el proyecto

```bash
dotnet run --project src/TmbControl.WebAPI
```

Accede a Swagger: [http://localhost:5000/swagger](http://localhost:5000/swagger)

## 🧰 Tecnologías

- .NET 8
- PostgreSQL
- EF Core 8
- MediatR
- Minimal APIs
- Swagger / OpenAPI


---

## 🗃️ Migraciones EF Core

Este proyecto utiliza Entity Framework Core con un esquema distinto por módulo en PostgreSQL. Asegúrate de tener instalada la herramienta correcta:

```bash
dotnet tool install --global dotnet-ef --version 8.0.2
```

### Eliminar una base de datos ya existente

Se elimina la base de datos existente en el caso de que haya conflicto de cambio de tipo de Id.


### 📦 Crear una migración para cada módulo (cada módulo tiene un esquema de base de datos propio)

#### Indicators

```bash
dotnet ef migrations add InitialCreate_Indicators \
  --project src/TmbControl.Modules.Indicators \
  --startup-project src/TmbControl.WebAPI \
  --context IndicatorsDbContext
```

#### Comunications
```bash
dotnet ef migrations add InitialCreate_Communications \
  --project src/TmbControl.Modules.Communications \
  --startup-project src/TmbControl.WebAPI \
  --context CommunicationsDbContext
```

#### Operational Control
```bash
dotnet ef migrations add InitialCreate_OperationalControl \
  --project src/TmbControl.Modules.OperationalControl \
  --startup-project src/TmbControl.WebAPI \
  --context OperationalControlDbContext
```

### Objectives
```bash
dotnet ef migrations add InitialCreate_Objectives --project src/TmbControl.Modules.Objectives --startup-project src/TmbControl.WebAPI --context ObjectivesDbContext
```

### Sites
```bash
dotnet ef migrations add InitialCreate_Sites --project src/TmbControl.Modules.Sites --startup-project src/TmbControl.WebAPI --context SitesDbContext
```

### Users
```bash
dotnet ef migrations add InitialCreate_Users --project src/TmbControl.Modules.Users --startup-project src/TmbControl.WebAPI --context UsersDbContext
```

### Shared
```bash
dotnet ef migrations add InitialCreate_Shared --project src/TmbControl.Shared --startup-project src/TmbControl.WebAPI --context SharedDbContext
```

### 🛠️ Aplicar la migración a la base de datos

#### Indicators

```bash
dotnet ef database update --project src/TmbControl.Modules.Indicators --startup-project src/TmbControl.WebAPI --context IndicatorsDbContext
```

#### Comunications
```bash
dotnet ef database update --project src/TmbControl.Modules.Communications --startup-project src/TmbControl.WebAPI --context CommunicationsDbContext
```

### Operational Control
```bash
dotnet ef database update --project src/TmbControl.Modules.OperationalControl --startup-project src/TmbControl.WebAPI --context OperationalControlDbContext

```

### Objectives
```bash
dotnet ef database update --project src/TmbControl.Modules.Objectives --startup-project src/TmbControl.WebAPI --context ObjectivesDbContext
```

### Sites
```bash
dotnet ef database update --project src/TmbControl.Modules.Sites --startup-project src/TmbControl.WebAPI --context SitesDbContext
```

### Users
```bash
dotnet ef database update --project src/TmbControl.Modules.Users --startup-project src/TmbControl.WebAPI --context UsersDbContext
```

### Shared
```bash

  dotnet ef database update --project src/TmbControl.Shared --startup-project src/TmbControl.WebAPI --context SharedDbContext
```

## 🌱 Seeders por módulo

Cada módulo puede inicializar su propia información por defecto (estados, categorías, roles...) mediante un `Seeder`. Esto garantiza que la base de datos esté lista con datos esenciales tras la primera migración o despliegue.

### 📂 Estructura recomendada por módulo

```
TmbControl.Modules.XYZ/
├── Persistence/
│   ├── XYZDbContext.cs
│   ├── XYZDbContextSeeder.cs
│   └── XYZDbContextSeederExtensions.cs
```

### 🧱 Ejemplo de uso en `Program.cs`

```csharp
if (app.Environment.IsDevelopment())
{
    await app.Services.UseIndicatorsSeederAsync();
    await app.Services.UseUsersSeederAsync();
}
```

Cada método `UseXYZSeederAsync` encapsula el seeding de un módulo y puede aplicarse de forma independiente sin acoplarlos entre sí.

---

## 📜 Licencia

MIT