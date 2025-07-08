using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Sites.Persistence;
using TmbControl.Modules.Sites.Features.Shared;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Sites.Features.GetById;

public static class GetSiteById
{
    public static void MapGetSiteById(this IEndpointRouteBuilder app)
    {
        app.MapGet("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] SitesDbContext db) =>
        {
            var site = await db.Sites
                .Where(s => s.Id == id)
                .Select(SiteMapper.ProjectToDto)
                .FirstOrDefaultAsync() ?? throw new NotFoundException($"Site with id '{id}' not found.");

            return Results.Ok(site);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Sites, PermissionAction.View))
        .WithName("GetSiteById")
        .WithTags("Sites")
        .WithDescription("Get a site by its unique identifier")
        .WithSummary("Get site by ID")
        .WithMetadata(["Get", "Sites"])
        .Produces<SiteDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
