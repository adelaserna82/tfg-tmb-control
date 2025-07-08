namespace TmbControl.Shared.Services;
public class UserLoginData
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
    public string PasswordHash { get; set; } = default!;
    public string RoleCode { get; set; } = default!;
    public List<RolePermission> Permissions { get; set; } = new();
    public Boolean IsActive { get; set; } = default!;
}
