using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Objectives.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Objectives.Features.Update;

public static class UpdateObjective
{
    public static void MapUpdateActionPlan(this IEndpointRouteBuilder app)
    {
        app.MapPut("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateActionPlanRequest request,
            [FromServices] ObjectivesDbContext db) =>
        {
            var objective = await db.ActionPlans.FirstOrDefaultAsync(o => o.Id == id);

            if (objective is null)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"Action plan with id '{id}' not found.",
                            "Objective not found",
                            ErrorCodes.ActionPlanNotFound));

            objective.AreaId = request.AreaId;
            objective.Name = request.Name;
            objective.Description = request.Description;
            objective.Year = request.Year;
            objective.StatusId = request.StatusId;
            objective.StartIn = request.StartIn;
            objective.FinisIn = request.FinisIn;
            objective.CreatedAt = DateTime.UtcNow;
            objective.CreatedBy = "System";

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Objectives, PermissionAction.Edit))
        .WithName("UpdateActionPlan")
        .WithTags("ActionPlans")
        .WithDescription("Update an existing action plan")
        .WithSummary("Update action plan")
        .WithMetadata(["Put", "Objectives"])
        .Accepts<UpdateActionPlanRequest>("application/json")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}

public record UpdateActionPlanRequest
{
    public Guid AreaId { get; init; }
    public Guid ObjectiveId { get; init; }
    public string Name { get; init; } = default!;
    public string Description { get; init; } = default!;
    public int Year { get; init; }
    public int StatusId { get; init; }
    public DateOnly StartIn { get; set; }
    public DateOnly FinisIn { get; set;}

}
