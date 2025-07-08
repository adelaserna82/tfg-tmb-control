using Microsoft.AspNetCore.Mvc;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Modules.Communications.Entities;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Authorization;

namespace TmbControl.Modules.Communications.Features.Create;

public static class CreateOrigin
{
    public static void MapCreateOrigin(this IEndpointRouteBuilder app)
    {
        app.MapPost("origins", async (
            [FromBody] CreateOriginRequest request,
            [FromServices] CommunicationsDbContext db) =>
        {
            var origin = new Origin
            {
                Name = request.Name,
                Description = request.Name,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system"
            };

            db.Origins.Add(origin);
            await db.SaveChangesAsync();

            return Results.Created($"/api/communications/origins/{origin.Id}", origin.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Communications, PermissionAction.Create))
        .WithName("CreateOrigin")
        .WithTags("Communications")
        .WithDescription("Create a new origin")
        .WithSummary("Create a new origin")
        .WithMetadata(["Post", "Communications"])
        .Accepts<CreateOriginRequest>("application/json")
        .Produces<int>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}

public record CreateOriginRequest
{
    public string Name { get; init; } = default!;
}
