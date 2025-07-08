using Microsoft.AspNetCore.Mvc;
using TmbControl.Modules.Indicators.Persistence;
using TmbControl.Modules.Indicators.Entities;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using TmbControl.Shared.Exceptions;
using Microsoft.EntityFrameworkCore;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Indicators.Features.Create;

public static class CreateIndicator
{
    public static void MapCreateIndicator(this IEndpointRouteBuilder app)
    {
        app.MapPost("", async (
            [FromBody] CreateIndicatorRequest request,
            [FromServices] IndicatorsDbContext db) =>
        {
            // Check if the indicator code already exists
            var existingIndicator = await db.Indicators
                .FirstOrDefaultAsync(i => i.Code == request.Code);

            if (existingIndicator != null)
                return Results.BadRequest(CustomProblemDetailsBuilder
                    .BadRequest($"An indicator with code '{request.Code}' already exists.",
                        "Indicator already exists",
                        ErrorCodes.IndicatorAlreadyExists));

            var indicator = new Indicator
            {
                Id = Guid.NewGuid(),
                Code = request.Code,
                Name = request.Name,
                Description = request.Description,
                Value = null,
                Unit = request.Unit,
                Date = null,
                CategoryId = request.CategoryId,
                FrequencyId = request.FrequencyId,
                Min = request.Min,
                Max = request.Max,
                XLocation = request.XLocation ?? 50,
                YLocation = request.YLocation ?? 50,
                IsErrorConfigured = request.IsErrorConfigured,
                MinError = request.MinError,
                MaxError = request.MaxError,
                IsAlertConfigured = request.IsAlertConfigured,
                MinAlert = request.MinAlert,
                MaxAlert = request.MaxAlert,
                StatusId = 1,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system",
            };

            db.Indicators.Add(indicator);

            await db.SaveChangesAsync();

            return Results.Created($"/api/indicators/{indicator.Id}", indicator.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.Create))
        .WithName("CreateIndicator")
        .WithTags("Indicators")
        .WithDescription("Create a new indicator")
        .WithSummary("Create a new indicator")
        .WithMetadata(["Post", "Indicators"])
        .Produces<Guid>(StatusCodes.Status201Created)
        .Accepts<CreateIndicatorRequest>("application/json")
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        ;
    }
}

public record CreateIndicatorRequest
{
    public required string Code { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required string Unit { get; init; }
    public required int CategoryId { get; init; }
    public required int FrequencyId { get; init; }
    public double Min { get; set; }
    public double Max { get; set; }

    public double? XLocation { get; set; }
    public double? YLocation { get; set; }

    public bool IsErrorConfigured { get; set; }
    public double? MinError { get; set; }
    public double? MaxError { get; set; }

    public bool IsAlertConfigured { get; set; }
    public double? MinAlert { get; set; }
    public double? MaxAlert { get; set; }
}
