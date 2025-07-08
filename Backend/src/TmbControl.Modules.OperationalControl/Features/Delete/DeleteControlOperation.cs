using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.OperationalControl.Features.Delete;

public static class DeleteActualControl
{
    public static void MapDeleteActualControl(this IEndpointRouteBuilder app)
    {
        _ = app.MapDelete("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] OperationalControlDbContext db) =>
        {
            var control = await db.ActualControls
                .Include(c => c.Revisions)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (control is null)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"ActualControl with id '{id}' not found.",
                            "ActualControl not found",
                            ErrorCodes.ActualControlNotFound));


            db.ActualControls.Remove(control);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.OperationalControl, PermissionAction.Delete))
        .WithName("DeleteActualControl")
        .WithTags("OperationalControl")
        .WithDescription("Delete an actual control and its revisions")
        .WithSummary("Delete actual control")
        .WithMetadata(["Delete", "OperationalControl"])
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
