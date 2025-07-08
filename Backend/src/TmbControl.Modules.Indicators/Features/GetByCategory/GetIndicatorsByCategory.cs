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

namespace TmbControl.Modules.Indicators.Features.GetByCategory;

public static class GetIndicatorsByCategory
{
    public static void MapGetIndicatorsByCategory(this IEndpointRouteBuilder app)
    {
        app.MapGet("/category/{categoryId:int}", async (
            [FromRoute] int categoryId,
            [FromServices] IndicatorsDbContext db) =>
        {
            var indicators = await db.Indicators
                .Where(i => i.CategoryId == categoryId)
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
        .WithName("GetIndicatorsByCategory")
        .WithTags("Indicators")
        .WithDescription("Get indicators by category")
        .WithSummary("Get indicators by category")
        .WithMetadata(["Get", "Indicators"])
        .Produces<IndicatorDto[]>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        ;
    }
}
