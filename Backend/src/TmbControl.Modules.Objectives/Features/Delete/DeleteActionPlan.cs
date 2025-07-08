using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Objectives.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Objectives.Features.Delete;

public static class DeleteActionPlan
{
    public static void MapDeleteActionPlan(this IEndpointRouteBuilder app)
    {
        app.MapDelete("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] ObjectivesDbContext db) =>
        {
            var actionPlan = await db.ActionPlans
                .FirstOrDefaultAsync(o => o.Id == id);

            if (actionPlan is null)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"Action plan with id '{id}' not found.",
                            "Action plan not found",
                            ErrorCodes.ActionPlanNotFound));


            db.ActionPlans.Remove(actionPlan);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Objectives, PermissionAction.Delete))
        .WithName("DeleteActionPlan")
        .WithTags("ActionPlans")
        .WithDescription("Delete an action plan")
        .WithSummary("Delete action plan")
        .WithMetadata(["Delete", "ActionPlans"])
        .Produces(StatusCodes.Status204NoContent)
        .Produces<ProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<ProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
