using TmbControl.Shared.Enums;

namespace TmbControl.Shared.Services;

public interface IUserRecipientService
{
    Task<List<Guid>> GetUserIdsWithPermissionAsync(PermissionModule module, PermissionAction action);
    Task<List<BasicUserInfoDto>> GetUsersWithPermissionAsync(PermissionModule module, PermissionAction action);
}

public class BasicUserInfoDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Email { get; set; } = default!;
}