using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Sites.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Sites.Features.Delete;

public static class DeleteSite
{
    public static void MapDeleteSite(this IEndpointRouteBuilder app)
    {
        app.MapDelete("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] SitesDbContext db) =>
        {
            var site = await db.Sites.FirstOrDefaultAsync(s => s.Id == id);
            if (site is null)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"Site with id '{id}' not found.",
                            "Site not found",
                            ErrorCodes.SiteNotFound));

            db.Sites.Remove(site);
            await db.SaveChangesAsync();

            return Results.NoContent();
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Sites, PermissionAction.Delete))
        .WithName("DeleteSite")
        .WithTags("Sites")
        .WithDescription("Delete a site by ID")
        .WithSummary("Delete site")
        .WithMetadata(["Delete", "Sites"])
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
