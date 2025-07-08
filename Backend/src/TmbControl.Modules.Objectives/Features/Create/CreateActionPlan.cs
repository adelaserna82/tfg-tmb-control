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

public static class CreateAction
{
    public static void MapCreateActionPlan(this IEndpointRouteBuilder app)
    {
        app.MapPost("", async (
            [FromBody] CreateActionPlanRequest request,
            [FromServices] ObjectivesDbContext db) =>
        {
            var action = new ActionPlan
            {
                AreaId = request.AreaId,
                ObjectiveId = request.ObjectiveId,
                StatusId = request.StatusId,
                Year = request.Year,
                Name = request.Name,
                Description = request.Description,
                Order = request.Order,
                StartIn = request.StartIn,
                FinisIn = request.FinisIn,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            };

            db.ActionPlans.Add(action);
            await db.SaveChangesAsync();

            return Results.Created($"/api/objectives/action-plans/{action.Id}", action.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Objectives, PermissionAction.Create))
        .WithName("CreateActionPlan")
        .WithTags("ActionPlans")
        .WithDescription("Create a new action plan")
        .WithSummary("Create action plan")
        .WithMetadata(["Post", "ActionPlans"])
        .Accepts<CreateActionPlanRequest>("application/json")
        .Produces<Guid>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}

public record CreateActionPlanRequest
{
    public Guid AreaId { get; init; }
    public Guid ObjectiveId { get; init; }
    public int StatusId { get; init; }
    public int Year { get; init; }
    public string Name { get; init; } = default!;
    public string Description { get; init; } = default!;
    public int Order { get; init; }
    public DateOnly StartIn { get; init; }
    public DateOnly FinisIn { get; init; }
}
