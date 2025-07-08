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

public static class CreateFormat
{
    public static void MapCreateFormat(this IEndpointRouteBuilder app)
    {
        app.MapPost("formats", async (
            [FromBody] CreateFormatRequest request,
            [FromServices] CommunicationsDbContext db) =>
        {
            var format = new Format
            {
                Name = request.Name,
                Description = request.Name,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "system"
            };

            db.Formats.Add(format);
            await db.SaveChangesAsync();

            return Results.Created($"/api/communications/formats/{format.Id}", format.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Communications, PermissionAction.Create))
        .WithName("CreateFormat")
        .WithTags("Communications")
        .WithDescription("Create a new format")
        .WithSummary("Create a new format")
        .WithMetadata(["Post", "Communications"])
        .Accepts<CreateFormatRequest>("application/json")
        .Produces<int>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}

public record CreateFormatRequest
{
    public string Name { get; init; } = default!;
}
