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

namespace TmbControl.Modules.Sites.Features.GetAll;

public static class GetAllSites
{
    public static void MapGetAllSites(this IEndpointRouteBuilder app)
    {
        app.MapGet("", async ([FromServices] SitesDbContext db) =>
        {
            var sites = await db.Sites
                .Select(SiteMapper.ProjectToDto)
                .ToListAsync();

            return Results.Ok(sites);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Sites, PermissionAction.View))
        .WithName("GetAllSites")
        .WithTags("Sites")
        .WithDescription("Get all registered sites with their metadata")
        .WithSummary("Get all sites")
        .WithMetadata(["Get", "Sites"])
        .Produces<List<SiteDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
