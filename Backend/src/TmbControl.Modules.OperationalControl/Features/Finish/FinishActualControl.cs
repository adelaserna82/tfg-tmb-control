using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Modules.OperationalControl.Entities;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.OperationalControl.Features.Finish;

public static class FinishActualControl
{
    public static void MapFinish(this IEndpointRouteBuilder app)
    {
        app.MapPatch("/{id:guid}/finish", async (
            [FromRoute] Guid id,
            [FromBody] AddControlRevisionRequest request,
            [FromServices] OperationalControlDbContext db) =>
        {
            var control = await db.ActualControls
                .Include(c => c.Frequency)
                .Include(c => c.Status)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (control is null)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"ActualControl with id '{id}' not found.",
                            "ActualControl not found",
                            ErrorCodes.ActualControlNotFound));


            var revision = new Revision
            {
                ActualControlId = control.Id,
                Date = control.LastReview,
                NextReview = control.NextReview,
                FrequencyId = control.FrequencyId,
                StatusId = control.StatusId,
                Observations = control.Observations,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system"
            };

            db.Revisions.Add(revision);


            control.Observations = request.Observations;


            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.OperationalControl, PermissionAction.Edit))
        .WithName("FinishActualControl")
        .WithTags("OperationalControl")
        .WithDescription("Finish an actual control and add a revision")
        .WithSummary("Finish actual control")
        .WithMetadata(["Patch", "OperationalControl"])
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .Accepts<AddControlRevisionRequest>("application/json")
        .WithOpenApi();
    }
}

public record AddControlRevisionRequest
{
    public string? Observations { get; init; }
}
