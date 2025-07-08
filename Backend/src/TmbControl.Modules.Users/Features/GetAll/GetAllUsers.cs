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

public static class GetAllUsers
{
    public static void MapGetAllUsers(this IEndpointRouteBuilder app)
    {
        app.MapGet("", async ([FromServices] UsersDbContext db) =>
        {
            var users = await db.Users
                .Include(u => u.Role)
                .ThenInclude(r => r.Permissions)
                .Select(UserMapper.ProjectToDto)
                .ToListAsync();

            return Results.Ok(users);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Users, PermissionAction.View))
        .WithName("GetAllUsers")
        .WithTags("Users")
        .WithDescription("Get all users with roles and permissions")
        .WithSummary("Get all users")
        .WithMetadata(["Get", "Users"])
        .Produces<List<UserDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
