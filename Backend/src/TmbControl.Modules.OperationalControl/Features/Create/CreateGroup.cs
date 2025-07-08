using Microsoft.AspNetCore.Mvc;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Modules.OperationalControl.Entities;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.OperationalControl.Features.Create;

public static class CreateGroup
{
    public static void MapCreateGroup(this IEndpointRouteBuilder app)
    {
        app.MapPost("groups", async (
            [FromBody] CreateGroupRequest request,
            [FromServices] OperationalControlDbContext db) =>
        {
            var group = new Group
            {
                Name = request.Name,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System",
            };

            db.Groups.Add(group);
            await db.SaveChangesAsync();

            return Results.Created($"/api/operationalcontrol/groups/{group.Id}", group.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.OperationalControl, PermissionAction.Create))
        .WithName("CreateGroup")
        .WithTags("OperationalControl")
        .WithDescription("Create a new group")
        .WithSummary("Create a new group")
        .WithMetadata(["Post", "OperationalControl"])
        .Accepts<CreateGroupRequest>("application/json")
        .Produces<int>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}

public record CreateGroupRequest
{
    public string Name { get; init; } = default!;
}
