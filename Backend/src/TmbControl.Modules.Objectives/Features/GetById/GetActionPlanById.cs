using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Objectives.Persistence;
using TmbControl.Modules.Objectives.Features.Shared;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Objectives.Features.GetById;

public static class GetActionPlanById
{
    public static void MapGetActionPlanById(this IEndpointRouteBuilder app)
    {
        app.MapGet("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] ObjectivesDbContext db) =>
        {
            var objective = await db.ActionPlans
                .Include(o => o.Area)
                .Include(o => o.Status)
                .Where(o => o.Id == id)
                .Select(ObjectiveActionPlanMapper.ProjectToDto)
                .FirstOrDefaultAsync();

            if (objective is null)
                throw new NotFoundException($"Action plan with id '{id}' not found.");

            return Results.Ok(objective);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Objectives, PermissionAction.View))
        .WithName("GetActionPlanById")
        .WithTags("ActionPlans")
        .WithDescription("Get a specific action plan by ID")
        .WithSummary("Get objective by ID")
        .WithMetadata(["Get", "ActionPlans"])
        .Produces<ObjectiveDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
