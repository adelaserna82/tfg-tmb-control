using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Indicators.Persistence;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using TmbControl.Modules.Indicators.Features.Shared;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Indicators.Features.GetMasterData;

public static class GetIndicatorMasterData
{
    public static void MapGetIndicatorMasterData(this IEndpointRouteBuilder app)
    {
        app.MapGet("/master-data", async ([FromServices] IndicatorsDbContext db) =>
        {
            var categories = await db.Categories
                .Select(c => new IndicatorCategoryDto { Id = c.Id, Name = c.Name, Order = c.Order, Description = c.Description })
                .ToListAsync();

            var frequencies = await db.Frequencies
                .Select(f => new IndicatorFrequencyDto { Id = f.Id, Name = f.Name })
                .ToListAsync();

            var masterData = new IndicatorsMasterDataDto
            {
                Categories = categories,
                Frequencies = frequencies
            };

            return Results.Ok(masterData);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.View))
        .WithName("GetIndicatorMasterData")
        .WithTags("Indicators")
        .WithDescription("Get master data for indicators module")
        .WithSummary("Get indicator categories and frequencies")
        .Produces<IndicatorsMasterDataDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}
