using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Communications.Entities;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Communications.Features.Update;

public static class UpdateCommunication
{
    public static void MapUpdateCommunication(this IEndpointRouteBuilder app)
    {
        app.MapPut("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateCommunicationRequest request,
            [FromServices] CommunicationsDbContext db) =>
        {
            var communication = await db.Communications
                .Include(c => c.RelatedTo)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (communication is null)
                return Results.NotFound(CustomProblemDetailsBuilder
                    .NotFound($"The communication with id '{id}' was not found.",
                        "Communication not found",
                        ErrorCodes.CommunicationNotFound));

            if (request.RelatedId != communication.RelatedId
                && request.RelatedId != null
                && communication.RelatedTo.Count != 0)
                return Results.BadRequest(CustomProblemDetailsBuilder
                    .BadRequest("This communication cannot be set as related because it has children",
                        "The communication cannot be set as related",
                        ErrorCodes.CommunicationHasChildren));

            communication.CategoryId = request.CategoryId;
            communication.OriginId = request.OriginId;
            communication.Date = request.Date;
            communication.DueDate = request.DueDate;
            communication.Description = request.Description;
            communication.StatusId = request.StatusId;
            communication.RelatedId = request.RelatedId;
            communication.FormatId = request.FormatId;
            communication.FileName = request.FileName;
            communication.FilePath = request.FilePath;

            // Update responsibles
            if (request.ResponsibleIds is not null)
            {
                // Delete existing responsibles from the context to avoid conflicts
                var existingResponsibles = await db.Responsibles
                    .Where(r => r.CommunicationId == communication.Id)
                    .ToListAsync();

                db.Responsibles.RemoveRange(existingResponsibles);

                // Add new responsibles
                foreach (var userId in request.ResponsibleIds)
                {
                    db.Responsibles.Add(new Responsible
                    {
                        CommunicationId = communication.Id,
                        UserId = userId
                    });
                }
            }

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Communications, PermissionAction.Edit))
        .WithName("UpdateCommunication")
        .WithTags("Communications")
        .WithDescription("Update a communication by ID")
        .WithSummary("Update a communication by ID")
        .WithMetadata(new[] { "Put", "Communications" })
        .Accepts<UpdateCommunicationRequest>("application/json")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        ;
    }
}

public record UpdateCommunicationRequest
{
    public int CategoryId { get; init; }
    public int OriginId { get; init; }
    public int? FormatId { get; init; }
    public DateOnly Date { get; init; }
    public DateOnly? DueDate { get; init; }
    public string Description { get; init; } = default!;
    public int StatusId { get; init; }
    public Guid[]? ResponsibleIds { get; init; }
    public Guid? RelatedId { get; init; }
    public string? FileName { get; init; }
    public string? FilePath { get; init; }
}
