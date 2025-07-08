using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Objectives.Entities;
using TmbControl.Modules.Objectives.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Objectives.Features.Duplicate;

public static class DuplicateObjectivesByYear
{
    public static void MapDuplicateActionPlansByYear(this IEndpointRouteBuilder app)
    {
        app.MapPost("/duplicate", async (
            [FromBody] DuplicateActionPlansRequest request,
            [FromServices] ObjectivesDbContext db) =>
        {
            var sourceActionPlans = await db.ActionPlans
                .Where(ap => ap.Year == request.SourceYear)
                .ToListAsync();

            if (!sourceActionPlans.Any())
            {
                return Results.NotFound(CustomProblemDetailsBuilder
                    .NotFound($"No action plans found for year {request.SourceYear}",
                        "ActionPlans not found",
                        ErrorCodes.ObjectiveNotFound));
            }

            var clonedActionPlans = sourceActionPlans.Select(ap => new ActionPlan
            {
                Name = ap.Name,
                Description = ap.Description,
                Order = ap.Order,
                Year = request.TargetYear,
                AreaId = ap.AreaId,
                ObjectiveId = ap.ObjectiveId,
                StatusId = ap.StatusId,
                StartIn = ap.StartIn.AddYears(request.TargetYear - request.SourceYear),
                FinisIn = ap.FinisIn.AddYears(request.TargetYear - request.SourceYear),
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System"
            }).ToList();

            db.ActionPlans.AddRange(clonedActionPlans);

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Objectives, PermissionAction.Create))
        .WithName("DuplicateActionPlansByYear")
        .WithTags("ActionPlans")
        .WithDescription("Duplicate all action plans from a given year into a new one")
        .WithSummary("Duplicate action plans by year")
        .WithMetadata(["Post", "ActionPlans"])
        .Accepts<DuplicateActionPlansRequest>("application/json")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}

public record DuplicateActionPlansRequest
{
    public int SourceYear { get; init; }
    public int TargetYear { get; init; }
}
