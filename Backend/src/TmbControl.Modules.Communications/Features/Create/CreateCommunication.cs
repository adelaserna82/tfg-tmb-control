using Microsoft.AspNetCore.Mvc;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Modules.Communications.Entities;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Communications.Features.Create;

public static class CreateCommunication
{
    public static void MapCreateCommunication(this IEndpointRouteBuilder app)
    {
        app.MapPost("", async (
            [FromBody] CreateCommunicationRequest request,
            [FromServices] CommunicationsDbContext db) =>
        {

            var communication = new Communication
            {
                CategoryId = request.CategoryId,
                OriginId = request.OriginId,
                Date = request.Date,
                DueDate = request.DueDate,
                Description = request.Description,
                StatusId = request.StatusId,
                RelatedId = request.RelatedId,
                FormatId = request.FormatId,
                FileName = request.FileName,
                FilePath = request.FilePath,
                Responsibles = request.ResponsibleIds?.Select(userId => new Responsible
                {
                    UserId = userId
                }).ToList() ?? [],
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system"
            };

            db.Communications.Add(communication);
            await db.SaveChangesAsync();

            return Results.Created($"/api/communications/{communication.Id}", communication.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Communications, PermissionAction.Create))
        .WithName("CreateCommunication")
        .WithTags("Communications")
        .WithDescription("Create a new communication")
        .WithSummary("Create a new communication")
        .WithMetadata(new[] { "Post", "Communications" })
        .Accepts<CreateCommunicationRequest>("application/json")
        .Produces<Guid>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}

public record CreateCommunicationRequest
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
