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

namespace TmbControl.Modules.Indicators.Features.UpdateValue;

public static class UpdateIndicatorValue
{
    public static void MapUpdateIndicatorValue(this IEndpointRouteBuilder app)
    {
        app.MapPatch("/{id:guid}/value", async (
            [FromRoute] Guid id,
            [FromBody] UpdateIndicatorValueRequest request,
            [FromServices] IndicatorsDbContext db,
            [FromServices] IHubContext<IndicatorsHub> hubContext,
            [FromServices] IndicatorUpdater updater) =>
        {
            var indicator = await db.Indicators.FirstOrDefaultAsync(i => i.Id == id);

            if (indicator is null)
                return Results.NotFound(CustomProblemDetailsBuilder
                    .NotFound($"The indicator with id '{id}' was not found.",
                        "Indicator not found",
                        ErrorCodes.IndicatorNotFound));

            await updater.UpdateOrInsertValueAsync(indicator, request.Value, DateOnly.FromDateTime(DateTime.Now), "UpdateValue");

            await db.SaveChangesAsync();

            await hubContext.Clients.All.SendAsync("indicatorsChanged");
            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.Edit))
        .WithName("UpdateIndicatorValue")
        .WithTags("Indicators")
        .WithDescription("Update only the value of an indicator and create historical entry")
        .WithSummary("Update value and record in history")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound);
    }
}

public record UpdateIndicatorValueRequest
{
    public double Value { get; init; }
}
