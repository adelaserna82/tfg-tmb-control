using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Indicators.Persistence;
using TmbControl.Modules.Indicators.Features.Shared;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Indicators.Features.GetAllWithHistory;

public static class GetAllIndicatorsWithHistory
{
    public static void MapGetAllIndicatorsWithHistory(this IEndpointRouteBuilder app)
    {
        app.MapGet("with-history", async ([FromServices] IndicatorsDbContext db) =>
        {
            var indicators = await db.Indicators
                .Include(i => i.Category)
                .Include(i => i.Status)
                .Include(i => i.Histories)
                .Select(IndicatorMapper.ProjectToDtoWithHistory)
                .OrderBy(i => i.Code)
                .AsNoTracking()
                .ToListAsync();

            return Results.Ok(indicators);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.View))
        .WithName("GetAllIndicatorsWithHistory")
        .WithTags("Indicators")
        .WithDescription("Get all indicators including history")
        .WithSummary("Get all indicators with history")
        .Produces<List<IndicatorDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
