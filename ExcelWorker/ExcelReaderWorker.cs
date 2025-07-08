
using ClosedXML.Excel;
using System.Net.Http.Json;
using System.Net.Http.Headers;

public class ExcelReaderWorker : BackgroundService
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;

    public ExcelReaderWorker(IConfiguration config, IHttpClientFactory httpClientFactory)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                // Ejecuta el procesamiento
                await ProcessExcelAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error en ProcessExcelAsync: {ex.Message}");
            }

            // Espera al horario configurado para repetirlo cada día
            var now = DateTime.Now;
            var configuredHour = _config.GetValue<int>("ExcelSettings:RunHour");

            var nextRunTime = DateTime.Today.AddHours(configuredHour);
            if (now > nextRunTime)
                nextRunTime = nextRunTime.AddDays(1);

            var delay = nextRunTime - now;
            Console.WriteLine($"Esperando hasta {nextRunTime:HH:mm} para ejecutar el Worker...");
            try
            {
                await Task.Delay(delay, stoppingToken);
            }
            catch (TaskCanceledException)
            {
                // Ignorar si se cancela la tarea
            }
        }
    }

    private async Task ProcessExcelAsync(CancellationToken stoppingToken)
    {
        // Leer configuración desde appsettings.json
        var path = _config["ExcelSettings:FilePath"]!;
        var sheetName = _config["ExcelSettings:SheetName"]!;
        var startRow = _config.GetValue<int>("ExcelSettings:StartRow");
        var startCol = _config.GetValue<int>("ExcelSettings:StartColumn");

        var endpoint = _config["ApiSettings:Endpoint"]!;
        var apiKey = _config["ApiSettings:ApiKey"];

        var dataList = new List<ExcelRecord>();

        // Abrir el archivo Excel y acceder a la hoja configurada
        using var workbook = new XLWorkbook(path);
        var worksheet = workbook.Worksheet(sheetName);

        // Leer los códigos (cabeceras de columnas) desde la fila anterior a los datos
        var headers = new List<string>();
        int col = startCol;

        // La columan inicial es la que contiene las fechas, la saltamos
        while (!worksheet.Cell(startRow - 1, col + 1).IsEmpty())
        {
            headers.Add(worksheet.Cell(startRow - 1, col + 1).GetString());
            col++;
        }

        // Leer las filas de datos
        int row = startRow;
        while (!worksheet.Cell(row, startCol).IsEmpty())
        {
            var dateCell = worksheet.Cell(row, startCol);

            // Validar que la celda contiene una fecha válida
            if (!DateTime.TryParse(dateCell.GetString(), out var dateTime))
            {
                row++;
                continue;
            }
            var date = DateOnly.FromDateTime(dateTime);

            // Recorrer columnas con códigos y extraer valores numéricos válidos
            for (int i = 0; i < headers.Count; i++)
            {
                var valueCell = worksheet.Cell(row, startCol + i + 1);
                if (double.TryParse(valueCell.GetString(), out var value))
                {
                    dataList.Add(new ExcelRecord
                    {
                        Code = headers[i],
                        Date = date,
                        Value = value
                    });
                }
            }
            row++;
        }

        // Crear cliente HTTP
        var client = _httpClientFactory.CreateClient();

        // Se añade el ApiKey para poder hacer login
        client.DefaultRequestHeaders.Add("x-api-key", apiKey);

        // Se autentica a un usuario específico
        var authUrl = _config["ApiSettings:AuthUrl"];
        var email = _config["ApiSettings:Email"];
        var password = _config["ApiSettings:Password"];

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password))
            throw new InvalidOperationException("Email or password is not configured.");

        var authPayload = new { email = email, password = password };
        var authResponse = await client.PostAsJsonAsync(authUrl, authPayload, stoppingToken);
        authResponse.EnsureSuccessStatusCode();
        var json = await authResponse.Content.ReadAsStringAsync();
        using var doc = System.Text.Json.JsonDocument.Parse(json);
        var token = doc.RootElement.GetProperty("token").GetString();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

        // Enviar los datos leídos al endpoint configurado
        var response = await client.PostAsJsonAsync(endpoint, dataList, stoppingToken);
        response.EnsureSuccessStatusCode();
        Console.WriteLine("Datos enviados correctamente.");
    }
}

// Clase que representa una fila de datos leída del Excel
public class ExcelRecord
{
    public string Code { get; set; } = default!;
    public DateOnly Date { get; set; }
    public double Value { get; set; }
}
