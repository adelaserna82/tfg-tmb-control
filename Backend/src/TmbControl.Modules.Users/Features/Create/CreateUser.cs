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

namespace TmbControl.Modules.Users.Features.Create;

public static class CreateUser
{
    public static void MapCreateUser(this IEndpointRouteBuilder app)
    {
        app.MapPost("", async (
            [FromBody] CreateUserRequest request,
            [FromServices] UsersDbContext db) =>
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                Mobile = request.Mobile,
                Phone = request.Phone,
                PasswordHash = passwordHash,
                RoleId = request.RoleId,
                IsActive = request.IsActive,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system"
            };

            var rolePermissions = await db.RolePermissions
            .Where(rp => rp.Roles.Any(r => r.Id == user.RoleId))
            .Select(rp => new { rp.Module, rp.Action })
            .ToListAsync();

            var filtered = request.ExtraPermissions
            .Where(p => !rolePermissions.Any(rp => rp.Module == p.Module && rp.Action == p.Action));


            var newPermissions = filtered.Select(p => new UserPermission
            {
                Id = Guid.NewGuid(),
                UserId = user.Id,
                Module = p.Module,
                Action = p.Action,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system"
            });

            await db.UserPermissions.AddRangeAsync(newPermissions);

            db.Users.Add(user);
            await db.SaveChangesAsync();

            return Results.Created($"/api/users/{user.Id}", user.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Users, PermissionAction.Create))
        .WithName("CreateUser")
        .WithTags("Users")
        .WithDescription("Create a new user")
        .WithSummary("Create user")
        .WithMetadata(["Post", "Users"])
        .Accepts<CreateUserRequest>("application/json")
        .Produces<Guid>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}

public record CreateUserRequest
{
    public string Name { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string Mobile { get; init; } = default!;
    public string Phone { get; init; } = default!;
    public string Password { get; init; } = default!;
    public Guid RoleId { get; init; }
    public bool IsActive { get; init; }
    public List<RolePermissionDto> ExtraPermissions { get; init; } = [];
}
