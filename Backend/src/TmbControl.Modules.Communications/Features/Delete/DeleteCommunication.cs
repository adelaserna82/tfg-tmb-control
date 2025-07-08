// Delete endpoint
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Communications.Features.Delete;

public static class DeleteCommunication
{
    public static void MapDeleteCommunication(this IEndpointRouteBuilder app)
    {
        app.MapDelete("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] CommunicationsDbContext db) =>
        {
            var communication = await db.Communications
                .Include(c => c.RelatedTo)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (communication is null)
                return Results.NotFound(CustomProblemDetailsBuilder.NotFound($"La comunicación con id '{id}' no fue encontrada."));

            if (communication.RelatedTo != null && communication.RelatedTo.Any())
                return Results.BadRequest(
                    CustomProblemDetailsBuilder
                        .BadRequest("The communication cannot be deleted because it has children.",
                            "The communication cannot be deleted",
                            ErrorCodes.CommunicationHasChildren));

            db.Communications.Remove(communication);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Communications, PermissionAction.Delete))
        .WithName("DeleteCommunication")
        .WithTags("Communications")
        .WithDescription("Delete a communication by ID")
        .WithSummary("Delete a communication by ID")
        .WithMetadata(["Delete", "Communications"])
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .Produces(StatusCodes.Status204NoContent);
    }
}
