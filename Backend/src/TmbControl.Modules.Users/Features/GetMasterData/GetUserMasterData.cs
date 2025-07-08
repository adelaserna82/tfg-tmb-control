using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Shared.Exceptions;
using TmbControl.Modules.Users.Features.Shared;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Users.Features.GetMasterData;

public static class GetUserMasterData
{
    public static void MapGetUserMasterData(this IEndpointRouteBuilder app)
    {
        app.MapGet("/master-data", async (
            [FromServices] UsersDbContext db) =>
        {
            var roles = await db.Roles
                .AsNoTracking()
                .Include(r => r.Permissions)
                .Select(r => new RoleDto
                {
                    Id = r.Id,
                    Name = r.Name,
                    Code = r.Code,
                    Permissions = r.Permissions
                        .OrderBy(p => p.Module)
                        .ThenBy(p => p.Action)
                        .Select(p => new RolePermissionDto
                        {
                            Id = p.Id,
                            Module = p.Module,
                            Action = p.Action
                        }).ToList()
                })
                .ToListAsync();

            var permissions = await db.RolePermissions
                .AsNoTracking()
                .OrderBy(p => p.Module)
                .ThenBy(p => p.Action)
                .Select(p => new RolePermissionDto
                {
                    Id = p.Id,
                    Module = p.Module,
                    Action = p.Action
                })
                .ToListAsync();

            var result = new UserMasterDataDto
            {
                Roles = roles,
                Permissions = permissions
            };

            return Results.Ok(result);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Users, PermissionAction.View))
        .WithName("GetUserMasterData")
        .WithTags("Users")
        .WithDescription("Get roles and available permissions for user management")
        .WithSummary("Get user master data")
        .WithMetadata(["Get", "Users"])
        .Produces<UserMasterDataDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);

    }
}
