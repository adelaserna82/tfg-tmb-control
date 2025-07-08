using Microsoft.AspNetCore.Mvc;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Modules.OperationalControl.Entities;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.OperationalControl.Features.Create;

public static class CreateFrequency
{
    public static void MapCreateFrequency(this IEndpointRouteBuilder app)
    {
        app.MapPost("frequencies", async (
            [FromBody] CreateFrequencyRequest request,
            [FromServices] OperationalControlDbContext db) =>
        {
            var frequency = new Frequency
            {
                Name = request.Name,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System",
            };

            db.Frequencies.Add(frequency);
            await db.SaveChangesAsync();

            return Results.Created($"/api/operationalcontrol/frequencies/{frequency.Id}", frequency.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.OperationalControl, PermissionAction.Create))
        .WithName("CreateFrequency")
        .WithTags("OperationalControl")
        .WithDescription("Create a new frequency")
        .WithSummary("Create a new frequency")
        .WithMetadata(["Post", "OperationalControl"])
        .Accepts<CreateFrequencyRequest>("application/json")
        .Produces<int>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}

public record CreateFrequencyRequest
{
    public string Name { get; init; } = default!;
}
