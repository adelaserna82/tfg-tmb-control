using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Modules.Shared.Enums;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Features.Notifications.GetNotifications;
using TmbControl.Shared.Services;

namespace TmbControl.Modules.OperationalControl.Services;

public class OperationalControlAlertProvider(OperationalControlDbContext context) : IDailyAlertProvider
{
    private readonly OperationalControlDbContext _context = context;

    public async Task<IEnumerable<NotificationDto>> GetDailyNotificationsAsync()
    {
        // Search operational controls that finish in one month, one week and one day
        // and return them as notifications
        var finishInDay = await _context.ActualControls
            .Where(c => c.NextReview != null
                && c.NextReview > DateOnly.FromDateTime(DateTime.UtcNow)
                && c.NextReview < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(1)))
            .Select(c => new NotificationDto
            {
                Id = Guid.NewGuid(),
                Title = $"Un control operativo vence en menos de un día",
                Message = $"El control operativo '{c.Concept}', tiene que realizar la revisión de '{c.Control}' el día '{c.NextReview}'",
                Type = NotificationType.Warning.ToString(),
                Module = PermissionModule.OperationalControl.ToString(),
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        var finishInWeek = await _context.ActualControls
            .Where(c => c.NextReview != null
                && c.NextReview > DateOnly.FromDateTime(DateTime.UtcNow).AddDays(1)
                && c.NextReview < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(7)))
            .Select(c => new NotificationDto
            {
                Id = Guid.NewGuid(),
                Title = $"Un control operativo vence en menos de una semana",
                Message = $"El control operativo '{c.Concept}',  tiene que realizar la revisión de '{c.Control}' el día '{c.NextReview}'",
                Type = NotificationType.Warning.ToString(),
                Module = PermissionModule.OperationalControl.ToString(),
                CreatedAt = c.CreatedAt
            })
            .ToListAsync();

        var finishInMonth = await _context.ActualControls
            .Where(c => c.NextReview != null
                && c.NextReview > DateOnly.FromDateTime(DateTime.UtcNow).AddDays(7)
                && c.NextReview < DateOnly.FromDateTime(DateTime.UtcNow.AddDays(30)))
            .Select(c => new NotificationDto
            {
                Id = Guid.NewGuid(),
                Title = $"Un control operativo vence en menos de un mes",
                Message = $"El control operativo '{c.Concept}',  tiene que realizar la revisión de '{c.Control}' el día '{c.NextReview}'",
                Type = NotificationType.Warning.ToString(),
                Module = PermissionModule.OperationalControl.ToString(),
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
