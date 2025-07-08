namespace TmbControl.Shared.Features.Notifications.GetNotifications;

public class NotificationDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = default!;
    public string Message { get; set; } = default!;
    public string Type { get; set; } = "info"; // info, warning, error
    public string Module { get; set; } = default!;
    public string? Link { get; set; }

    public DateTime CreatedAt { get; set; }
}
