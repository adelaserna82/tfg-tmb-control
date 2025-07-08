using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Shared.Enums;
using TmbControl.Shared.Entities.Notifications;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Persistence;

namespace TmbControl.Shared.Services;

public class NotificationService(SharedDbContext db, IUserRecipientService userRecipientService) : INotificationService
{
    public async Task<Guid> CreateAsync(string title, string message, NotificationType type, PermissionModule module, string? link, string createdBy)
    {
        var userIds = await userRecipientService.GetUserIdsWithPermissionAsync(module, PermissionAction.ReceiveNotification);

        var moduleName = module.ToString();

        var notification = new Notification
        {
            Id = Guid.NewGuid(),
            Title = title,
            Message = message,
            Type = type.ToString(),
            Module = moduleName,
            Link = link,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = createdBy
        };

        db.Notifications.Add(notification);

        foreach (var userId in userIds)
        {
            db.UserNotifications.Add(new UserNotification
            {
                Id = Guid.NewGuid(),
                NotificationId = notification.Id,
                UserId = userId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = createdBy
            });
        }

        await db.SaveChangesAsync();
        return notification.Id;
    }

    public async Task MarkAsReadAsync(Guid notificationId, Guid userId)
    {
        var userNotification = await db.UserNotifications
            .FirstOrDefaultAsync(un => un.NotificationId == notificationId && un.UserId == userId);

        if (userNotification is not null && !userNotification.IsRead)
        {
            userNotification.IsRead = true;
            userNotification.ReadAt = DateTime.UtcNow;
            await db.SaveChangesAsync();
        }
    }
}

