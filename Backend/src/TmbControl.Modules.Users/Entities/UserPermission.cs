namespace TmbControl.Modules.Users.Entities;

public class UserPermission
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
    
    public string Module { get; set; } = default!;
    public string Action { get; set; } = default!;
    
    // Audit
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
