using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Services;

namespace TmbControl.Modules.Users.Services;

public class UserRecipientService(UsersDbContext db) : IUserRecipientService
{
    private readonly UsersDbContext _db = db;

    public async Task<List<Guid>> GetUserIdsWithPermissionAsync(PermissionModule module, PermissionAction action)
    {
        return await _db.Users
            .Include(u => u.Role)
            .ThenInclude(r => r.Permissions)
            .Include(u => u.ExtraPermissions)
            .AsNoTracking()
            .Where(u => u.IsActive &&
            (
                u.Role.Permissions.Any(p =>
                p.Module == module.ToString() && p.Action == action.ToString())
                ||
                u.ExtraPermissions.Any(p =>
                p.Module == module.ToString() && p.Action == action.ToString())
            )
            )
            .Select(u => u.Id)
            .ToListAsync();
    }

    public async Task<List<BasicUserInfoDto>> GetUsersWithPermissionAsync(PermissionModule module, PermissionAction action )
    {
        return await _db.Users
            .Include(u => u.Role)
            .ThenInclude(r => r.Permissions)
            .AsNoTracking()
            .Where(u => u.IsActive &&
                        u.Role.Permissions.Any(p =>
                            p.Module == module.ToString() && p.Action == action.ToString()))
            .Select(u => new BasicUserInfoDto
            {
                Id = u.Id,
                Name = u.Name,
                Email = u.Email
            })
            .ToListAsync();
    }
}
