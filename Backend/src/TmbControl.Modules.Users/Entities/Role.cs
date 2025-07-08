namespace TmbControl.Modules.Users.Entities;

public class Role
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;

    public ICollection<RolePermission> Permissions { get; set; } = [];
    public ICollection<User> Users { get; set; } = [];

    // Audit
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
