using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Modules.Users.Features.Shared;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Users.Features.GetAll;

public static class GetAllRoles
{
    public static void MapGetAllRoles(this IEndpointRouteBuilder app)
    {
        app.MapGet("/api/users/roles", async ([FromServices] UsersDbContext db) =>
        {
            var roles = await db.Roles
                .Include(r => r.Permissions)
                .Select(r => new RoleDto
                {
                    Id = r.Id,
                    Code = r.Code,
                    Name = r.Name,
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

            return Results.Ok(roles);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Users, PermissionAction.View))
        .WithName("GetAllRoles")
        .WithTags("Users")
        .WithDescription("Get all roles with their permissions")
        .WithSummary("Get all roles")
        .WithMetadata(["Get", "Roles"])
        .Produces<List<RoleDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
