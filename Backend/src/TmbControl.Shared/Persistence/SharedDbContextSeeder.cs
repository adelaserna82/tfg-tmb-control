using TmbControl.Shared.Entities.Notifications;

namespace TmbControl.Shared.Persistence;

public static class SharedDbContextSeeder
{
    public static async Task SeedAsync(SharedDbContext db)
    {
        if (!db.Notifications.Any())
        {
            var notif1 = new Notification
            {
                Id = Guid.NewGuid(),
                Title = "Nueva revisión pendiente",
                Message = "Revisión de control operacional programada para esta semana.",
                Type = "warning",
                Module = "OperationalControl",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "Seeder"
            };

            var notif2 = new Notification
            {
                Id = Guid.NewGuid(),
                Title = "Objetivo superado",
                Message = "Uno de los indicadores ha alcanzado su máximo valor.",
                Type = "info",
                Module = "Indicators",
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "Seeder"
            };

            db.Notifications.AddRange(notif1, notif2);
            await db.SaveChangesAsync();
        }
    }
}
