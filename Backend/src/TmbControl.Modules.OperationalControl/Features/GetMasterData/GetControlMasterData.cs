using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.OperationalControl.Features.Shared;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.OperationalControl.Features.GetMasterData;

public static class GetControlMasterData
{
    public static void MapGetControlMasterData(this IEndpointRouteBuilder app)
    {
        app.MapGet("/master-data", async (
            [FromServices] OperationalControlDbContext db) =>
        {
            var currentYear = DateTime.UtcNow.Year;
            var years = await db.ActualControls
                .AsNoTracking()
                .Where(c => c.LastReview != null)
                .Select(c => c.LastReview!.Value.Year)
                .Distinct()
                .OrderByDescending(y => y)
                .Select(y => new OperationalControlYearDto { Value = y })
                .ToListAsync();

            if (!years.Any(y => y.Value == currentYear))
            {
                years.Add(new OperationalControlYearDto { Value = currentYear });
            }


            var groups = await db.Groups
                .AsNoTracking()
                .Select(g => new OperationalControlGroupDto
                {
                    Id = g.Id,
                    Name = g.Name
                })
                .ToListAsync();

            var frequencies = await db.Frequencies
                .AsNoTracking()
                .Select(f => new OperationalControlFrequencyDto
                {
                    Id = f.Id,
                    Name = f.Name
                })
                .ToListAsync();

            var statuses = await db.Statuses
                .AsNoTracking()
                .Select(s => new OperationalControlStatusDto
                {
                    Id = s.Id,
                    Name = s.Name
                })
                .ToListAsync();

            var masterData = new OperationalControlMasterDataDto
            {
                Years = years,
                Groups = groups,
                Frequencies = frequencies,
                Statuses = statuses
            };

            return Results.Ok(masterData);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.OperationalControl, PermissionAction.View))
        .WithName("GetOperationalControlMasterData")
        .WithTags("OperationalControl")
        .WithDescription("Get master data for operational control filters")
        .WithSummary("Get master data for operational control filters")
        .WithMetadata(["Get", "OperationalControl"])
        .Produces<OperationalControlMasterDataDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}
