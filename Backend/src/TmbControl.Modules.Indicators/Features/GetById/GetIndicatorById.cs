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

namespace TmbControl.Modules.Indicators.Features.GetById;

public static class GetIndicatorById
{
    public static void MapGetIndicatorById(this IEndpointRouteBuilder app)
    {
        app.MapGet("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] IndicatorsDbContext db) =>
        {
            var indicator = await db.Indicators
                .Include(i => i.Category)
                .Include(i => i.Status)
                .Include(i => i.Histories)
                .Where(i => i.Id == id)
                .Select(IndicatorMapper.ProjectToDto)
                .AsNoTracking()
                .FirstOrDefaultAsync();

            return indicator is null
                ? Results.NotFound()
                : Results.Ok(indicator);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.View))
        .WithName("GetIndicatorById")
        .WithTags("Indicators")
        .WithDescription("Get an indicator by ID")
        .WithSummary("Get an indicator by ID")
        .WithMetadata(["Get", "Indicators"])
        .Produces<IndicatorDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)

        ;
    }
}
