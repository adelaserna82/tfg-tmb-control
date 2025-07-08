using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Shared.Exceptions;
using TmbControl.Modules.Users.Entities;
using TmbControl.Modules.Users.Features.Shared;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Users.Features.Update;

public static class UpdateRole
{
    public static void MapUpdateRole(this IEndpointRouteBuilder app)
    {
        app.MapPut("/roles/{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateRoleRequest request,
            [FromServices] UsersDbContext db) =>
        {
            var role = await db.Roles
                .Include(r => r.Permissions)
                .FirstOrDefaultAsync(r => r.Id == id);

            if (role is null)
            {
                return Results.NotFound(
                    CustomProblemDetailsBuilder.NotFound(
                        $"Role with id '{id}' not found.",
                        "Role not found",
                        ErrorCodes.RoleNotFound));
            }

            role.Name = request.Name;
            role.Code = request.Code;
            role.UpdatedAt = DateTime.UtcNow;
            role.UpdatedBy = "system";

            // Limpiar permisos actuales
            role.Permissions.Clear();

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

                role.Permissions.Add(permission);

            }

            await db.SaveChangesAsync();

            var response = new UpdateRoleResponse
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
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Users, PermissionAction.Edit))
        .WithName("UpdateRole")
        .WithTags("Users")
        .WithDescription("Update an existing user role")
        .WithSummary("Update role")
        .WithMetadata(["Put", "Users"])
        .Accepts<UpdateRoleRequest>("application/json")
        .Produces<UpdateRoleResponse>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}

public class UpdateRoleRequest
{
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public List<RolePermissionDto> Permissions { get; set; } = [];
}

public class UpdateRoleResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Code { get; set; } = default!;
    public List<RolePermissionDto> Permissions { get; set; } = [];
}