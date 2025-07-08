using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Modules.Users.Features.Create;
using TmbControl.Shared.Exceptions;
using TmbControl.Modules.Users.Entities;
using TmbControl.Modules.Users.Features.Shared;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Users.Features.Create;

public static class CreateRole
{
    public static void MapCreateRole(this IEndpointRouteBuilder app)
    {
        app.MapPost("/roles", async (
            [FromBody] CreateRoleRequest request,
            [FromServices] UsersDbContext db) =>
        {
            var exists = await db.Roles.AnyAsync(r => r.Code == request.Code);
            if (exists)
            {
                return Results.BadRequest(
                    CustomProblemDetailsBuilder.BadRequest(
                        $"Role with code '{request.Code}' already exists.",
                        "Duplicate role code",
                        ErrorCodes.RoleAlreadyExists));
            }

            var permissionEntities = new List<RolePermission>();

            foreach (var perm in request.Permissions)
            {
                var permission = await db.RolePermissions
                    .FirstOrDefaultAsync(p => p.Id == perm.Id);

                if (permission == null)
                {
                    return Results.NotFound(
                        CustomProblemDetailsBuilder.NotFound(
                            $"Permission with id '{perm.Id}' not found.",
                            "Permission not found",
                            ErrorCodes.PermissionNotFound));
                }

                permissionEntities.Add(permission);
            }

            var role = new Role
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Code = request.Code,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system", // o del token JWT si lo tienes
                Permissions = permissionEntities
            };

            await db.Roles.AddAsync(role);
            await db.SaveChangesAsync();
            var response = new CreateRoleResponse
            {
                Id = role.Id,
                Name = role.Name,
                Code = role.Code,
                Permissions = role.Permissions
                    .Select(p => new RolePermissionDto
                    {
                        Id = p.Id,
                        Module = p.Module,
                        Action = p.Action
                    })
                    .ToList()
            };

            return Results.Ok(response);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Users, PermissionAction.Create))
        .WithName("CreateRole")
        .WithTags("Users")
        .WithDescription("Create a new user role")
        .WithSummary("Create role")
        .WithMetadata(["Post", "Users"])
        .Accepts<CreateRoleRequest>("application/json")
        .Produces<CreateRoleResponse>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}

public class CreateRoleRequest
{
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public List<RolePermissionDto> Permissions { get; set; } = [];
}

public class CreateRoleResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public List<RolePermissionDto> Permissions { get; set; } = [];
}