using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Modules.OperationalControl.Features.Shared;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.OperationalControl.Features.GetAll;

public static class GetAllActualControls
{
    public static void MapGetAllActualControls(this IEndpointRouteBuilder app)
    {
        app.MapGet("", async ([FromServices] OperationalControlDbContext db) =>
        {
            var controls = await db.ActualControls
                .Include(c => c.Status)
                .Include(c => c.Frequency)
                .Include(c => c.Group)
                .Include(c => c.Revisions)
                .Select(ActualControlMapper.ProjectToDto)
                .ToListAsync();

            return Results.Ok(controls);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.OperationalControl, PermissionAction.View))
        .WithName("GetAllActualControls")
        .WithTags("OperationalControl")
        .WithDescription("Get all actual controls with their current state and recent revisions")
        .WithSummary("Get all actual controls")
        .WithMetadata(["Get", "OperationalControl"])
        .Produces<List<ActualControlDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
