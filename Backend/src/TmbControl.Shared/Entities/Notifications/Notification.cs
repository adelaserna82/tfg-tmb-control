namespace TmbControl.Shared.Entities.Notifications;

public class Notification
{
    public Guid Id { get; set; }

    public string Title { get; set; } = default!;
    public string? Message { get; set; }

    public string Type { get; set; } = "info"; // info, warning, error
    public string? Module { get; set; } 
    public string? Link { get; set; }   

    // Audit
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;

    public ICollection<UserNotification> UserNotifications { get; set; } = [];
}
