using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TmbControl.Modules.Objectives.Entities;
using TmbControl.Modules.Objectives.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Objectives.Features.Create;

public static class CreateArea
{
    public static void MapCreateArea(this IEndpointRouteBuilder app)
    {
        app.MapPost("/areas", async (
            [FromBody] CreateAreaRequest request,
            [FromServices] ObjectivesDbContext db) =>
        {
            var area = new Area
            {
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };

            db.Areas.Add(area);
            await db.SaveChangesAsync();

            return Results.Created($"/api/action-plans/areas/{area.Id}", area.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Objectives, PermissionAction.Create))
        .WithName("CreateArea")
        .WithTags("ActionPlans")
        .WithDescription("Create a new area")
        .WithSummary("Create area")
        .WithMetadata(["Post", "ActionPlans"])
        .Accepts<CreateAreaRequest>("application/json")
        .Produces<Guid>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}

public record CreateAreaRequest
{
    public string Name { get; init; } = default!;
    public string Description { get; init; } = default!;
}
