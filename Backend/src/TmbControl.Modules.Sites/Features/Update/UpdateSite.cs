using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Sites.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Sites.Features.Update;

public static class UpdateSite
{
    public static void MapUpdateSite(this IEndpointRouteBuilder app)
    {
        app.MapPut("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromBody] UpdateSiteRequest request,
            [FromServices] SitesDbContext db) =>
        {
            var site = await db.Sites.FirstOrDefaultAsync(s => s.Id == id);
            if (site is null)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"Site with id '{id}' not found.",
                            "Site not found",
                            ErrorCodes.SiteNotFound));


            site.Name = request.Name;
            site.Href = request.Href;
            site.Description = request.Description;

            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Sites, PermissionAction.Edit))
        .WithName("UpdateSite")
        .WithTags("Sites")
        .WithDescription("Update an existing site")
        .WithSummary("Update site")
        .WithMetadata(["Put", "Sites"])
        .Accepts<UpdateSiteRequest>("application/json")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}

public record UpdateSiteRequest
{
    public string Name { get; init; } = default!;
    public string Href { get; init; } = default!;
    public string Description { get; init; } = default!;
}
