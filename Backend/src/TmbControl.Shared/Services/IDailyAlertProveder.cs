using TmbControl.Shared.Features.Notifications.GetNotifications;

namespace TmbControl.Shared.Services;

public interface IDailyAlertProvider
{
    Task<IEnumerable<NotificationDto>> GetDailyNotificationsAsync();
}
