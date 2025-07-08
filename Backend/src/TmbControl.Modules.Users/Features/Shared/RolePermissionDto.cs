namespace TmbControl.Modules.Users.Features.Shared;

public class RolePermissionDto
{
    public required Guid Id { get; init; }
    public required string Module { get; init; }
    public required string Action { get; init; }
}
