using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Indicators.Features.Notifications;
using TmbControl.Modules.Indicators.Features.Shared;
using TmbControl.Modules.Indicators.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Indicators.Features.IngestMany;

public static class IngestManyIndicatorValues
{
    public static void MapIngestManyIndicatorValues(this IEndpointRouteBuilder app)
    {
        app.MapPost("/ingest-many", async (
            [FromBody] List<IngestIndicatorValueRequest> request,
            [FromServices] IndicatorsDbContext db,
            [FromServices] IHubContext<IndicatorsHub> hubContext,
            [FromServices] IndicatorUpdater updater) =>
        {
            var indicatorCodes = request.Select(x => x.Code).Distinct().ToList();

            var indicators = await db.Indicators
                .Where(i => indicatorCodes.Contains(i.Code))
                .ToDictionaryAsync(i => i.Code);

            var now = DateTime.UtcNow;

            foreach (var entry in request)
            {
                if (!indicators.TryGetValue(entry.Code, out var indicator))
                    continue;

                await updater.UpdateOrInsertValueAsync(indicator, entry.Value, entry.Date, "IngestMany");
            }

            await db.SaveChangesAsync();

            await hubContext.Clients.All.SendAsync("indicatorsChanged");


            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.IngestMany))
        .WithName("IngestManyIndicatorValues")
        .WithTags("Indicators")
        .WithDescription("Insert or update values for multiple indicators and generate history")
        .WithSummary("Bulk update of indicator values")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest);
    }
}

public record IngestIndicatorValueRequest
{
    public string Code { get; init; } = default!;
    public DateOnly Date { get; init; }
    public double Value { get; init; }
}
