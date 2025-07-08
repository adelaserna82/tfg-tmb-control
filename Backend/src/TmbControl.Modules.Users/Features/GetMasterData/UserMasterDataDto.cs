using TmbControl.Modules.Users.Features.Shared;

namespace TmbControl.Modules.Users.Features.GetMasterData;

public class UserMasterDataDto
{
    public List<RoleDto> Roles { get; set; } = [];
    public List<RolePermissionDto> Permissions { get; set; } = [];
}
