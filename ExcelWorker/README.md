# ExcelWorker

Servicio en segundo plano desarrollado con **.NET 8 Worker Service** para automatizar la lectura de datos desde un fichero Excel y enviarlos al backend mediante una API REST.

## ⚙️ Funcionalidad

Este servicio realiza las siguientes tareas:

- Carga un archivo Excel (.xlsx) con indicadores de planta.
- Extrae los datos a partir de una fila y columna definidas.
- Llama a un endpoint seguro del backend para enviar los datos.
- Se ejecuta automáticamente a una hora configurada.

## 🧱 Arquitectura

- **.NET 8 Worker Service**
- **ClosedXML** para lectura de ficheros Excel.
- **HttpClientFactory** y `System.Net.Http.Json` para llamadas a la API.
- **Configuración por appsettings.json** y variables específicas para Mac y Windows.

## 🧪 Primeros pasos

### Instalar dependencias

```bash
cd ExcelWorker
dotnet restore
```

### Crear la base de datos

### Configurar el archivo `appsettings.json`

```json
{
  "ExcelSettings": {
    "FilePath_MAC": "/ruta/a/indicators.xlsx",
    "FilePath": "C:\ruta\a\indicators.xlsx",
    "SheetName": "indicadores",
    "StartRow": 3,
    "StartColumn": 5,
    "RunHour": 2
  },
  "ApiSettings": {
    "ApiKey": "excel-api-key-67890",
    "Endpoint": "https://localhost:5001/api/indicators/ingest-many",
    "AuthUrl": "https://localhost:5001/api/auth/login",
    "Email": "proceso-excel@no-email.com",
    "Password": "tu-password-aqui"
  }
}
```

### Ejecutar el servicio manualmente

```bash
dotnet run
```

El servicio se ejecuta indefinidamente y dispara el proceso cuando la hora del sistema coincide con `RunHour`.

## 🧰 Tecnologías

- .NET 8
- ClosedXML
- Worker Service
- System.Net.Http.Json
- API Key + Login Auth con JWT

## 📜 Licencia

MIT