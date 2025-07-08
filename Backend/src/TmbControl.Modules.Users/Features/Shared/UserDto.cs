namespace TmbControl.Modules.Users.Features.Shared;

public class UserDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string Mobile { get; init; } = default!;
    public string Phone { get; init; } = default!;
    public bool IsActive { get; init; } = default!;
    public RoleDto Role { get; init; } = default!;
    public List<RolePermissionDto> ExtraPermissions { get; init; } = [];
}
