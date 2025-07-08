using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Users.Features.Delete;

public static class DeleteUser
{
    public static void MapDeleteUser(this IEndpointRouteBuilder app)
    {
        app.MapDelete("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] UsersDbContext db) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user is null)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"User with id '{id}' not found.",
                            "User not found",
                            ErrorCodes.UserNotFound));


            db.Users.Remove(user);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Users, PermissionAction.Delete))
        .WithName("DeleteUser")
        .WithTags("Users")
        .WithDescription("Delete a user by ID")
        .WithSummary("Delete user")
        .WithMetadata(["Delete", "Users"])
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
