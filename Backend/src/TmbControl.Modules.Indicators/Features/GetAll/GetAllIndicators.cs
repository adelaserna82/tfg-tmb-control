using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Indicators.Features.Shared;
using TmbControl.Modules.Indicators.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Indicators.Features.GetAll;

public static class GetAllIndicators
{
    public static void MapGetAllIndicators(this IEndpointRouteBuilder app)
    {
        app.MapGet("", async ([FromServices] IndicatorsDbContext db) =>
        {
            var indicators = await db.Indicators
                .Include(i => i.Category)
                .Include(i => i.Status)
                .Include(i => i.Histories)
                .Select(IndicatorMapper.ProjectToDto)
                .OrderBy(i => i.Code)
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(indicators);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.View))
        .WithName("GetAllIndicators")
        .WithTags("Indicators")
        .WithDescription("Get all indicators")
        .WithSummary("Get all indicators")
        .WithMetadata(["Get", "Indicators"])
        .Produces<IndicatorDto[]>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}

