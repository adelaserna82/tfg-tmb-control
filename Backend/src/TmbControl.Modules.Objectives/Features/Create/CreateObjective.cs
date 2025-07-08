using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TmbControl.Modules.Objectives.Persistence;
using TmbControl.Modules.Objectives.Entities;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Objectives.Features.Create;

public static class CreateObjective
{
    public static void MapCreateObjective(this IEndpointRouteBuilder app)
    {
        app.MapPost("/objective", async (
            [FromBody] CreateObjectiveRequest request,
            [FromServices] ObjectivesDbContext db) =>
        {
            var objective = new Objective
            {
                Name = request.Name,
                Description = request.Description,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };

            db.Objectives.Add(objective);
            await db.SaveChangesAsync();

            return Results.Created($"/api/action-plans/{objective.Id}", objective.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Objectives, PermissionAction.Create))
        .WithName("CreateObjective")
        .WithTags("ActionPlans")
        .WithDescription("Create a new objective")
        .WithSummary("Create objective")
        .WithMetadata(new[] { "Post", "ActionPlans" })
        .Accepts<CreateObjectiveRequest>("application/json")
        .Produces<Guid>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}

public record CreateObjectiveRequest
{
    public Guid AreaId { get; init; }
    public string Name { get; init; } = default!;
    public string Description { get; init; } = default!;
    public int Year { get; init; }
    public int StatusId { get; init; }
}
