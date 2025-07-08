namespace TmbControl.Shared.Features.Notifications.GetNotifications;

public class UserNotificationDto
{
    public Guid Id { get; set; }
    public Guid NotificationId { get; set; }
    public Guid UserId { get; set; }

    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }

    public string Title { get; set; } = default!;
    public string? Message { get; set; }
    public string Type { get; set; } = "info";
    public string? Module { get; set; }
    public string? Link { get; set; }

    public DateTime CreatedAt { get; set; }
}
