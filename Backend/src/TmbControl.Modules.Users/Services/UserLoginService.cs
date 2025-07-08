using Microsoft.EntityFrameworkCore;

using TmbControl.Modules.Users.Persistence;
using TmbControl.Shared.Services;
using TmbControl.Shared.Services.Users;

namespace TmbControl.Modules.Users.Services;

public class UserLoginService(UsersDbContext db) : IUserLoginService
{
    private readonly UsersDbContext _db = db;

    public async Task<UserLoginData?> GetUserByEmailAsync(string email)
    {
        var user = await _db.Users
            .Include(u => u.Role)
            .ThenInclude(r => r.Permissions)
            .Include(u => u.ExtraPermissions)
            .FirstOrDefaultAsync(u => u.Email == email);

        if (user is null) return null;

        return new UserLoginData
        {
            Id = user.Id,
            Email = user.Email,
            Name = user.Name,
            PasswordHash = user.PasswordHash,
            RoleCode = user.Role.Code,
            Permissions = [
                .. user.Role.Permissions.Select(p => new RolePermission { Module = p.Module, Action = p.Action }),
                .. user.ExtraPermissions.Select(p => new RolePermission { Module = p.Module, Action = p.Action })
            ],
            IsActive = user.IsActive
        };
    }
}
