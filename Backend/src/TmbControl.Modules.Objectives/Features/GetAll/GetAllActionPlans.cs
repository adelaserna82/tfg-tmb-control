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

namespace TmbControl.Modules.Objectives.Features.GetAll;

public static class GetAllObjectives
{
    public static void MapGetAllActionPlans(this IEndpointRouteBuilder app)
    {
        app.MapGet("", async ([FromServices] ObjectivesDbContext db) =>
        {
            var objectiveActions = await db.ActionPlans
                .Include(oa => oa.Objective)
                .Include(oa => oa.Area)
                .Include(oa => oa.Status)
                .Select(ObjectiveActionPlanMapper.ProjectToDto)
                .OrderBy(oa => oa.Area.Name)
                .ThenBy(oa => oa.Objective.Name)
                .ThenBy(oa => oa.Name)
                .ToListAsync();


            return Results.Ok(objectiveActions);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Objectives, PermissionAction.View))
        .WithName("GetAllActionPlans")
        .WithTags("ActionPlans")
        .WithDescription("Get all action plans with their actions")
        .WithSummary("Get all action plans")
        .WithMetadata(["Get", "ActionPlans"])
        .Produces<List<ObjectiveActionPlanDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
