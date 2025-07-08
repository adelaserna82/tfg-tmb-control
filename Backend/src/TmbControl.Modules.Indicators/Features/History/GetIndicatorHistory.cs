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

namespace TmbControl.Modules.Indicators.Features.History;

public static class GetIndicatorHistory
{
    public static void MapGetIndicatorHistory(this IEndpointRouteBuilder app)
    {
        _ = app.MapGet("/{id:guid}/history", async (
            [FromRoute] Guid id,
            [FromServices] IndicatorsDbContext db) =>
        {
            var indicator = await db.Indicators.AnyAsync(i => i.Id == id);
            if (!indicator)
                throw new NotFoundException($"Indicator with id '{id}' not found.");

            var history = await db.IndicatorHistories
                .Where(h => h.IndicatorId == id)
                .OrderByDescending(h => h.Timestamp)
                .Take(50)
                .Select(h => new IndicatorHistoryDto
                {
                    Value = h.Value,
                    StatusId = h.StatusId,
                    Timestamp = h.Timestamp
                })
                .ToListAsync();

            return Results.Ok(history);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.View))
        .WithName("GetIndicatorHistory")
        .WithTags("Indicators")
        .WithDescription("Get full history of an indicator")
        .WithSummary("Get indicator history")
        .Produces<List<IndicatorHistoryDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}
