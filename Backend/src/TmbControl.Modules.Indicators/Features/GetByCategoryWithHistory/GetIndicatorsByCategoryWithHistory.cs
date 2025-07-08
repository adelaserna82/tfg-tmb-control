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

namespace TmbControl.Modules.Indicators.Features.GetByCategoryWithHistory;

public static class GetIndicatorsByCategoryWithHistory
{
    public static void MapGetIndicatorsByCategoryWithHistory(this IEndpointRouteBuilder app)
    {
        app.MapGet("/category/{categoryId:int}/with-history", async (
            [FromRoute] int categoryId,
            [FromServices] IndicatorsDbContext db) =>
        {
            var indicators = await db.Indicators
                .Where(i => i.CategoryId == categoryId)
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
        .WithName("GetIndicatorsByCategoryWithHistory")
        .WithTags("Indicators")
        .WithDescription("Get indicators by category including history")
        .WithSummary("Get indicators by category with history")
        .Produces<List<IndicatorDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
