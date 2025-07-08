using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Services;
using TmbControl.Shared.Exceptions;
using TmbControl.Modules.Objectives.Persistence;
using TmbControl.Modules.Objectives.Features.GetMasterData;
using TmbControl.Modules.Objectives.Features.Shared;
using TmbControl.Shared.Authorization;

namespace TmbControl.Modules.Communications.Features.GetMasterData;

public static class GetObjectiveMasterData
{
    public static void MapGetObjectiveMasterData(this IEndpointRouteBuilder app)
    {
        app.MapGet("/master-data", async (
            [FromServices] ObjectivesDbContext db) =>
        {
            var currentYear = DateTime.UtcNow.Year;
            var years = await db.ActionPlans
                .AsNoTracking()
                .Select(c => c.Year)
                .Distinct()
                .OrderByDescending(y => y)
                .Select(y => new ObjectiveYearDto { Value = y })
                .ToListAsync();

            if (!years.Any(y => y.Value == currentYear))
            {
                years.Add(new ObjectiveYearDto { Value = currentYear });
            }

            var areas = await db.Areas
                .AsNoTracking()
                .Select(c => new ObjectiveAreaDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();

            var objectives = await db.Objectives
                .AsNoTracking()
                .Select(o => new ObjectiveDto
                {
                    Id = o.Id,
                    Name = o.Name
                })
                .ToListAsync();

            var statuses = await db.Statuses
                .AsNoTracking()
                .Select(s => new ObjectiveStatusDto
                {
                    Id = s.Id,
                    Name = s.Name
                })
                .ToListAsync();


            var masterData = new ObjectiveMasterDataDto
            {
                Years = years,
                Areas = areas,
                Objectives = objectives,
                Statuses = statuses
            };

            return Results.Ok(masterData);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Objectives, PermissionAction.View))
        .WithName("GetObjectiveMasterData")
        .WithTags("ActionPlans")
        .WithDescription("Get master data for objective filters")
        .WithSummary("Get master data for objective filters")
        .WithMetadata(["Get", "Communications"])
        .Produces<ObjectiveMasterDataDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        ;
    }
}
