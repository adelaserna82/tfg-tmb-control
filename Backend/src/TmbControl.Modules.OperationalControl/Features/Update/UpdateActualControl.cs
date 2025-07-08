using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.OperationalControl.Features.Update;

public static class UpdateActualControl
{
    public static void MapUpdateActualControl(this IEndpointRouteBuilder app)
    {
        app.MapPut("{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateActualControlRequest request,
            [FromServices] OperationalControlDbContext db) =>
        {
            var control = await db.ActualControls
                .FirstOrDefaultAsync(c => c.Id == id);

            if (control is null)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"ActualControl with id '{id}' not found.",
                            "ActualControl not found",
                            ErrorCodes.ActualControlNotFound));


            control.Concept = request.Concept;
            control.Control = request.Control;
            control.Observations = request.Observations;
            control.LastReview = request.LastReview;
            control.NextReview = request.NextReview;
            control.GroupId = request.GroupId;
            control.FrequencyId = request.FrequencyId;
            control.StatusId = request.StatusId;
            control.UpdatedAt = DateTime.UtcNow;
            control.UpdatedBy = "system";

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.OperationalControl, PermissionAction.Edit))
        .WithName("UpdateActualControl")
        .WithTags("OperationalControl")
        .WithDescription("Update a current operational control by ID")
        .WithSummary("Update actual control")
        .WithMetadata(["Put", "OperationalControl"])
        .Accepts<UpdateActualControlRequest>("application/json")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}

public record UpdateActualControlRequest
{
    public string Concept { get; init; } = default!;
    public string Control { get; init; } = default!;
    public string? Observations { get; init; }
    public DateOnly? LastReview { get; init; }
    public DateOnly? NextReview { get; init; }
    public int GroupId { get; init; }
    public int FrequencyId { get; init; }
    public int StatusId { get; init; }
}
