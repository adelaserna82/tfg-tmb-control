using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Modules.OperationalControl.Entities;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.OperationalControl.Features.Create;

public static class CreateActualControl
{
    public static void MapCreateActualControl(this IEndpointRouteBuilder app)
    {
        app.MapPost("", async (
            [FromBody] CreateActualControlRequest request,
            [FromServices] OperationalControlDbContext db) =>
        {
            var control = new ActualControl
            {
                Id = Guid.NewGuid(),
                Concept = request.Concept,
                Control = request.Control,
                Observations = request.Observations,
                LastReview = request.LastReview,
                NextReview = request.NextReview,
                GroupId = request.GroupId,
                FrequencyId = request.FrequencyId,
                StatusId = request.StatusId,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system"
            };

            db.ActualControls.Add(control);
            await db.SaveChangesAsync();

            return Results.Created($"/api/operational/{control.Id}", control.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.OperationalControl, PermissionAction.Create))
        .WithName("CreateActualControl")
        .WithTags("OperationalControl")
        .WithDescription("Create a new operational control")
        .WithSummary("Create actual control")
        .WithMetadata(["Post", "OperationalControl"])
        .Produces<Guid>(StatusCodes.Status201Created)
        .Accepts<CreateActualControlRequest>("application/json")
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}

public record CreateActualControlRequest
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
