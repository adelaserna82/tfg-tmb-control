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

namespace TmbControl.Modules.Users.Features.GetById;

public static class GetUserById
{
    public static void MapGetUserById(this IEndpointRouteBuilder app)
    {
        app.MapGet("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] UsersDbContext db) =>
        {
            var user = await db.Users
                .Include(u => u.Role)
                .ThenInclude(r => r.Permissions)
                .Where(u => u.Id == id)
                .Select(UserMapper.ProjectToDto)
                .FirstOrDefaultAsync() ?? throw new NotFoundException($"User with id '{id}' not found.");

            return Results.Ok(user);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Users, PermissionAction.View))
        .WithName("GetUserById")
        .WithTags("Users")
        .WithDescription("Get a user by their ID including role and permissions")
        .WithSummary("Get user by ID")
        .WithMetadata(["Get", "Users"])
        .Produces<UserDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
