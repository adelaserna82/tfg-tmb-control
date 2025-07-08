namespace TmbControl.Modules.Users.Features.Shared;

public class RoleDto
{
    public Guid Id { get; init; }
    public string Code { get; init; } = default!;
    public string Name { get; init; } = default!;
    public List<RolePermissionDto> Permissions { get; init; } = [];
}
