namespace TmbControl.Modules.Users.Entities;
public class RolePermission
{
    public Guid Id { get; set; }
    public string Module { get; set; } = default!;
    public string Action { get; set; } = default!;

    public ICollection<Role> Roles { get; set; } = [];

    // Audit
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
