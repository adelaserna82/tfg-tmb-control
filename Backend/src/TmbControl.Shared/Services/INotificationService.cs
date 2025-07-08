
using TmbControl.Modules.Shared.Enums;
using TmbControl.Shared.Enums;

namespace TmbControl.Shared.Services;

public interface INotificationService
{
    Task<Guid> CreateAsync(string title, string message, NotificationType type, PermissionModule module, string? link,  string createdBy);
    Task MarkAsReadAsync(Guid notificationId, Guid userId);
}
