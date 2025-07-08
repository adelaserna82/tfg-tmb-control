using TmbControl.Modules.Communications.Entities;

namespace TmbControl.Modules.Communications.Persistence;

public static class CommunicationsDbContextSeeder
{
    public static async Task SeedAsync(CommunicationsDbContext context)
    {
        if (!context.Statuses.Any())
        {
            context.Statuses.AddRange(
                new Status { Name = "Atendiendo" },
                new Status { Name = "Pendiente" },
                new Status { Name = "Finalizado" },
                new Status { Name = "Desestimado" }
            );
        }

        if (!context.Categories.Any())
        {
            context.Categories.AddRange(
                new Category { Name = "Entrada" },
                new Category { Name = "Salida" }
            );
        }

        if (!context.Origins.Any())
        {
            context.Origins.AddRange(
                new Origin { Name = "Gobierno Vasco", Description = "Gobierno Vasco", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Origin { Name = "INS", Description = "Instituto Nacional de Estadística", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Origin { Name = "Ayuntamiento", Description = "Ayuntamiento de Bilbao", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Origin { Name = "MAPA", Description = "Ministerio de Agricultura, Pesca y Alimentación", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" }
            );
        }

        if (!context.Formats.Any())
        {
            context.Formats.AddRange(
                new Format { Name = "Carta", Description = "Carta", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Format { Name = "Impreso", Description = "Impreso", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Format { Name = "PDF", Description = "Formato PDF", CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" }
            );
        }

        await context.SaveChangesAsync();

        if (!context.Communications.Any())
        {
            var guid1 = Guid.NewGuid();
            var guid2 = Guid.NewGuid();
            var guid3 = Guid.NewGuid();
            var guid4 = Guid.NewGuid();

            context.Communications.AddRange(new[]
            {
                // 2025
                new Communication { Id = guid1, CategoryId = 1, OriginId = 1, Date = new DateOnly(2025, 3, 11), Description = "Solicitud de informes", RelatedId = null, StatusId = 1, FormatId = 1, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = guid2, CategoryId = 2, OriginId = 2, Date = new DateOnly(2025, 3, 8), Description = "Envío de documentación", RelatedId = guid1, StatusId = 2, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = guid3, CategoryId = 1, OriginId = 3, Date = new DateOnly(2025, 3, 9), Description = "Notificación oficial", RelatedId = null, StatusId = 3, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = guid4, CategoryId = 2, OriginId = 4, Date = new DateOnly(2025, 3, 10), Description = "Petición de datos", RelatedId = guid1, StatusId = 4, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },

                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 2, Date = new DateOnly(2025, 3, 12), Description = "Recepción de queja", RelatedId = null, StatusId = 1, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 1, Date = new DateOnly(2025, 3, 13), Description = "Respuesta a solicitud", RelatedId = guid1, StatusId = 2, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 4, Date = new DateOnly(2025, 3, 14), Description = "Informe de inspección", RelatedId = null, StatusId = 3, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 3, Date = new DateOnly(2025, 3, 15), Description = "Solicitud de aclaración", RelatedId = guid3, StatusId = 4, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder", FormatId = 2 },

                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 1, Date = new DateOnly(2025, 3, 16), Description = "Petición de presupuesto", RelatedId = null, StatusId = 1, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 2, Date = new DateOnly(2025, 3, 17), Description = "Envío de factura", RelatedId = null, StatusId = 2, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 3, Date = new DateOnly(2025, 3, 18), Description = "Aviso de corte", RelatedId = null, StatusId = 3, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 4, Date = new DateOnly(2025, 3, 19), Description = "Confirmación de recepción", RelatedId = guid4, StatusId = 4, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },

                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 2, Date = new DateOnly(2025, 3, 20), Description = "Solicitud de información adicional", RelatedId = null, StatusId = 1, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 1, Date = new DateOnly(2025, 3, 21), Description = "Entrega de documentación", RelatedId = null, StatusId = 2, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 4, Date = new DateOnly(2025, 3, 22), Description = "Notificación de sanción", RelatedId = null, StatusId = 3, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 3, Date = new DateOnly(2025, 3, 23), Description = "Petición de subsanación", RelatedId = null, StatusId = 4, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },

                // 2024
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 1, Date = new DateOnly(2024, 2, 5), Description = "Solicitud de presupuesto anual", RelatedId = null, StatusId = 1, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder", FormatId = 3 },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 2, Date = new DateOnly(2024, 2, 10), Description = "Envío de informe trimestral", RelatedId = null, StatusId = 2, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 3, Date = new DateOnly(2024, 2, 15), Description = "Notificación de inspección", RelatedId = null, StatusId = 3, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 4, Date = new DateOnly(2024, 2, 20), Description = "Petición de aclaración", RelatedId = null, StatusId = 4, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },

                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 2, Date = new DateOnly(2024, 4, 1), Description = "Recepción de reclamación", RelatedId = null, StatusId = 1, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 1, Date = new DateOnly(2024, 4, 3), Description = "Respuesta a reclamación", RelatedId = null, StatusId = 2, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 4, Date = new DateOnly(2024, 4, 5), Description = "Informe de auditoría", RelatedId = null, StatusId = 3, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 3, Date = new DateOnly(2024, 4, 7), Description = "Solicitud de subsanación", RelatedId = null, StatusId = 4, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },

                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 1, Date = new DateOnly(2024, 6, 12), Description = "Petición de datos adicionales", RelatedId = null, StatusId = 1, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 2, Date = new DateOnly(2024, 6, 14), Description = "Envío de documentación complementaria", RelatedId = null, StatusId = 2, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder", FormatId = 1 },
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 3, Date = new DateOnly(2024, 6, 16), Description = "Aviso de corte de servicio", RelatedId = null, StatusId = 3, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 4, Date = new DateOnly(2024, 6, 18), Description = "Confirmación de recepción de datos", RelatedId = null, StatusId = 4, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },

                // 2023
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 2, Date = new DateOnly(2023, 1, 10), Description = "Solicitud de información histórica", RelatedId = null, StatusId = 1, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 1, Date = new DateOnly(2023, 1, 15), Description = "Envío de datos históricos", RelatedId = null, StatusId = 2, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 4, Date = new DateOnly(2023, 1, 20), Description = "Notificación de sanción anterior", RelatedId = null, StatusId = 3, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder", FormatId = 2 },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 3, Date = new DateOnly(2023, 1, 25), Description = "Petición de subsanación anterior", RelatedId = null, StatusId = 4, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },

                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 1, Date = new DateOnly(2023, 5, 5), Description = "Petición de presupuesto anterior", RelatedId = null, StatusId = 1, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 2, Date = new DateOnly(2023, 5, 7), Description = "Envío de factura anterior", RelatedId = null, StatusId = 2, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 1, OriginId = 3, Date = new DateOnly(2023, 5, 9), Description = "Aviso de corte anterior", RelatedId = null, StatusId = 3, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" },
                new Communication { Id = Guid.NewGuid(), CategoryId = 2, OriginId = 4, Date = new DateOnly(2023, 5, 11), Description = "Confirmación de recepción anterior", RelatedId = null, StatusId = 4, CreatedAt = DateTime.UtcNow, CreatedBy = "Seeder" }
            });
        }

        await context.SaveChangesAsync();
    }
}
