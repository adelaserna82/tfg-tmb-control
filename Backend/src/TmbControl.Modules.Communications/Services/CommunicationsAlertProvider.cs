using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Modules.Shared.Enums;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Features.Notifications.GetNotifications;
using TmbControl.Shared.Services;

namespace TmbControl.Modules.Communications.Services;

public class CommunicationsAlertProvider(CommunicationsDbContext context) : IDailyAlertProvider
{
    private readonly CommunicationsDbContext _context = context;
    public async Task<IEnumerable<NotificationDto>> GetDailyNotificationsAsync()
    {
        // Search communications that finish in one month, one week and one day
        // and return them as notifications
        var finishInDay = await _context.Communications
            .Where(c => c.DueDate != null
                && c.DueDate > DateOnly.FromDateTime(DateTime.UtcNow)
                && c.DueDate < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)))
            .Select(c => new NotificationDto
            {
                Id = Guid.NewGuid(),
                Title = $"Una comunicación vence en menos de un día",
                Message = $"La comunicación  '{c.Description}', registrada el día '{c.Date}' con fecha de vencimiento {c.DueDate} está por vencer",
                Type = NotificationType.Warning.ToString(),
                Module = PermissionModule.Communications.ToString(),
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        var finishInWeek = await _context.Communications
            .Where(c => c.DueDate != null
                && c.DueDate > DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1)
                && c.DueDate < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7)))
            .Select(c => new NotificationDto
            {
                Id = Guid.NewGuid(),
                Title = $"Una comunicación vence en menos de una semana",
                Message = $"La comunicación  '{c.Description}', registrada el día '{c.Date}' con fecha de vencimiento {c.DueDate} está por vencer",
                Type = NotificationType.Warning.ToString(),
                Module = PermissionModule.Communications.ToString(),
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        var finishInMonth = await _context.Communications
            .Where(c => c.DueDate != null
                && c.DueDate > DateOnly.FromDateTime(DateTime.UtcNow).AddDays(7)
                && c.DueDate < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)))
            .Select(c => new NotificationDto
            {
                Id = Guid.NewGuid(),
                Title = $"Una comunicación vence en menos de un mes",
                Message = $"La comunicación  '{c.Description}', registrada el día '{c.Date}' con fecha de vencimiento {c.DueDate} está por vencer",
                Type = NotificationType.Warning.ToString(),
                Module = PermissionModule.Communications.ToString(),
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();


        var notifications = finishInMonth
            .Concat(finishInWeek)
            .Concat(finishInDay)
            .ToList();

        return notifications;

    }


}