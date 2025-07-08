using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Indicators.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Indicators.Features.Delete;

public static class DeleteIndicator
{
    public static void MapDeleteIndicator(this IEndpointRouteBuilder app)
    {
        app.MapDelete("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] IndicatorsDbContext db) =>
        {
            var indicator = await db.Indicators
                .Include(i => i.Histories)
                .FirstOrDefaultAsync(i => i.Id == id);

            if (indicator is null)
                return Results.NotFound(CustomProblemDetailsBuilder
                    .NotFound($"The indicator with id '{id}' was not found.",
                        "Indicator not found",
                        ErrorCodes.IndicatorNotFound));

            db.Indicators.Remove(indicator);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.Delete))
        .WithName("DeleteIndicator")
        .WithTags("Indicators")
        .WithDescription("Delete an indicator")
        .WithSummary("Delete an indicator")
        .WithMetadata(["Delete", "Indicators"])
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        ;
    }
}
