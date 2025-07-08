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

namespace TmbControl.Modules.OperationalControl.Features.GetById;

public static class GetByIdControlOperation
{
    public static void MapGetActualControlById(this IEndpointRouteBuilder app)
    {
        app.MapGet("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] OperationalControlDbContext db) =>
        {
            var operation = await db.ActualControls
                .Include(o => o.Status)
                .Include(o => o.Revisions)
                .Where(o => o.Id == id)
                .Select(ActualControlMapper.ProjectToDto)
                .FirstOrDefaultAsync();

            if (operation is null)
                throw new NotFoundException($"Operation with id '{id}' not found.");

            return Results.Ok(operation);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.OperationalControl, PermissionAction.View))
        .WithName("GetControlOperationById")
        .WithTags("OperationalControl")
        .WithDescription("Get a control operation by ID")
        .WithSummary("Get operation by ID")
        .WithMetadata(["Get", "OperationalControl"])
        .Produces<ActualControlDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi();
    }
}
