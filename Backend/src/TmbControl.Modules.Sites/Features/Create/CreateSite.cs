using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TmbControl.Modules.Sites.Entities;
using TmbControl.Modules.Sites.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Sites.Features.Create;

public static class CreateSite
{
    public static void MapCreateSite(this IEndpointRouteBuilder app)
    {
        app.MapPost("", async (
            [FromBody] CreateSiteRequest request,
            [FromServices] SitesDbContext db) =>
        {
            var site = new Site
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Href = request.Href,
                Description = request.Description
            };

            db.Sites.Add(site);
            await db.SaveChangesAsync();

            return Results.Created($"/api/sites/{site.Id}", site.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Sites, PermissionAction.Create))
        .WithName("CreateSite")
        .WithTags("Sites")
        .WithDescription("Create a new site entry")
        .WithSummary("Create site")
        .WithMetadata(["Post", "Sites"])
        .Accepts<CreateSiteRequest>("application/json")
        .Produces<Guid>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        
        .WithOpenApi();
    }
}

public record CreateSiteRequest
{
    public string Name { get; init; } = default!;
    public string Href { get; init; } = default!;
    public string Description { get; init; } = default!;
}
