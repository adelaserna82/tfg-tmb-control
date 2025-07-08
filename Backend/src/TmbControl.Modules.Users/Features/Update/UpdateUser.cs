using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Users.Entities;
using TmbControl.Modules.Users.Features.Shared;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Users.Features.Update;

public static class UpdateUser
{
    public static void MapUpdateUser(this IEndpointRouteBuilder app)
    {
        app.MapPut("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateUserRequest request,
            [FromServices] UsersDbContext db) =>
        {
            var user = await db.Users.FirstOrDefaultAsync(u => u.Id == id);
            if (user is null)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"User with id '{id}' not found.",
                            "User not found",
                            ErrorCodes.UserNotFound));


            user.Name = request.Name;
            user.Email = request.Email;
            user.Mobile = request.Mobile;
            user.Phone = request.Phone;

            user.RoleId = request.RoleId;
            user.IsActive = request.IsActive;

            if (request.Password != null)
            {
                var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
                user.PasswordHash = passwordHash;
            }


            db.UserPermissions.RemoveRange(db.UserPermissions.Where(p => p.UserId == id));

            var rolePermissions = await db.RolePermissions
            .Where(rp => rp.Roles.Any(r => r.Id == user.RoleId))
            .Select(rp => new { rp.Module, rp.Action })
            .ToListAsync();

            var filtered = request.ExtraPermissions
            .Where(p => !rolePermissions.Any(rp => rp.Module == p.Module && rp.Action == p.Action));


            var newPermissions = filtered.Select(p => new UserPermission
            {
                Id = Guid.NewGuid(),
                UserId = id,
                Module = p.Module,
                Action = p.Action,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system"
            });

            await db.UserPermissions.AddRangeAsync(newPermissions);


            user.UpdatedAt = DateTime.UtcNow;
            user.UpdatedBy = "system";

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Users, PermissionAction.Edit))
        .WithName("UpdateUser")
        .WithTags("Users")
        .WithDescription("Update an existing user")
        .WithSummary("Update user")
        .WithMetadata(["Put", "Users"])
        .Accepts<UpdateUserRequest>("application/json")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)

        .WithOpenApi();
    }
}


public record UpdateUserRequest
{
    public string Name { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string Mobile { get; init; } = default!;
    public string Phone { get; init; } = default!;
    public string? Password { get; init; } = default!;
    public Guid RoleId { get; init; }
    public bool IsActive { get; init; }

    public List<RolePermissionDto> ExtraPermissions { get; init; } = [];
}

