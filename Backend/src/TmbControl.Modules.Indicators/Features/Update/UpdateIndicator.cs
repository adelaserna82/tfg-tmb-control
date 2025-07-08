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

namespace TmbControl.Modules.Indicators.Features.Update;

public static class UpdateIndicator
{
    public static void MapUpdateIndicator(this IEndpointRouteBuilder app)
    {
        app.MapPut("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateIndicatorRequest request,
            [FromServices] IndicatorsDbContext db) =>
        {
            var indicator = await db.Indicators
                .FirstOrDefaultAsync(i => i.Id == id);

            if (indicator is null)
                return Results.NotFound(CustomProblemDetailsBuilder
                    .NotFound($"The indicator with id '{id}' was not found.",
                        "Indicator not found",
                        ErrorCodes.IndicatorNotFound));

            // Check if the code already exists
            var existingIndicator = await db.Indicators
                .FirstOrDefaultAsync(i => i.Code == request.Code && i.Id != id);

            if (existingIndicator != null)
                return Results.BadRequest(CustomProblemDetailsBuilder
                    .BadRequest($"An indicator with code '{request.Code}' already exists.",
                        "Indicator already exists",
                        ErrorCodes.IndicatorAlreadyExists));

            var value = indicator.Value;
            var statusId = indicator.StatusId;

            // If the value is null, we don't need to calculate the status
            if (value != null)
            {
                statusId = StatusCalculator.CalculateStatus(
                (double)value,
                request.Min,
                request.Max,
                request.IsAlertConfigured,
                request.MinAlert,
                request.MaxAlert,
                request.IsErrorConfigured,
                request.MinError,
                request.MaxError
            );
            }

            // Actualizar valores
            indicator.Code = request.Code;
            indicator.Name = request.Name;
            indicator.Description = request.Description;
            indicator.Unit = request.Unit;
            indicator.CategoryId = request.CategoryId;
            indicator.FrequencyId = request.FrequencyId;
            indicator.StatusId = statusId;
            indicator.Min = request.Min;
            indicator.Max = request.Max;
            indicator.XLocation = request.XLocation ?? 50;
            indicator.YLocation = request.YLocation ?? 50;
            indicator.IsErrorConfigured = request.IsErrorConfigured;
            indicator.MinError = request.MinError;
            indicator.MaxError = request.MaxError;
            indicator.IsAlertConfigured = request.IsAlertConfigured;
            indicator.MinAlert = request.MinAlert;
            indicator.MaxAlert = request.MaxAlert;
            indicator.UpdatedAt = DateTime.UtcNow;
            indicator.UpdatedBy = "system"; // o el usuario real


            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.Edit))
        .WithName("UpdateIndicator")
        .WithTags("Indicators")
        .WithDescription("Update an existing indicator")
        .WithSummary("Update an existing indicator")
        .WithMetadata(["Put", "Indicators"])
        .Accepts<UpdateIndicatorRequest>("application/json")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        
        ;
    }
}

public record UpdateIndicatorRequest
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
