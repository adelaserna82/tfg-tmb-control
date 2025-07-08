using System.Linq.Expressions;
using TmbControl.Modules.Users.Entities;

namespace TmbControl.Modules.Users.Features.Shared;

public static class UserMapper
{
    public static readonly Expression<Func<User, UserDto>> ProjectToDto = user => new UserDto
    {
        Id = user.Id,
        Name = user.Name,
        Email = user.Email,
        Mobile = user.Mobile,
        Phone = user.Phone,
        IsActive = user.IsActive,
        Role = new RoleDto
        {
            Id = user.Role.Id,
            Name = user.Role.Name,
            Code = user.Role.Code,
            Permissions = user.Role.Permissions
                .OrderBy(p => p.Module)
                .ThenBy(p => p.Action)
                .Select(p => new RolePermissionDto
                {
                    Id = p.Id,
                    Module = p.Module,
                    Action = p.Action
                }).ToList()
        },
        ExtraPermissions = user.ExtraPermissions
            .OrderBy(ep => ep.Module)
            .ThenBy(ep => ep.Action)
            .Select(ep => new RolePermissionDto
            {
                Id = ep.Id,
                Module = ep.Module,
                Action = ep.Action
            }).ToList()
    };
}
