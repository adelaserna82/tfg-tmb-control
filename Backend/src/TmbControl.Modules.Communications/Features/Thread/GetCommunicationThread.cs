using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Modules.Communications.Features.Shared;
using TmbControl.Shared.Exceptions;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Communications.Features.Thread;

public static class GetCommunicationThread
{
    public static void MapGetCommunicationThread(this IEndpointRouteBuilder app)
    {
        app.MapGet("/{id:guid}/thread", async (
            [FromRoute] Guid id,
            [FromServices] CommunicationsDbContext db) =>
        {
            var communication = await db.Communications
                .Include(c => c.Category)
                .Include(c => c.Status)
                .FirstOrDefaultAsync(c => c.Id == id);

            if (communication is null)
                throw new NotFoundException($"Communication with id '{id}' not found.");

            // If the communication is not a child, return it
            if (communication.RelatedId is null)
            {
                return Results.Ok(new[]
                {
                    CommunicationMapper.ProjectToDto.Compile().Invoke(communication)
                });
            }

            // Search for the parent communication
            var rootId = communication.RelatedId.Value;

            var root = await db.Communications
                .Include(c => c.Category)
                .Include(c => c.Status)
                .FirstOrDefaultAsync(c => c.Id == rootId);

            if (root is null)
                throw new NotFoundException($"Parent communication with id '{rootId}' not found.");

            var related = await db.Communications
                .Include(c => c.Category)
                .Include(c => c.Status)
                .Where(c => c.RelatedId == rootId)
                .ToListAsync();

            var result = new List<CommunicationDto>
            {
                CommunicationMapper.ProjectToDto.Compile().Invoke(root)
            };

            result.AddRange(related
                .OrderBy(c => c.Date)
                .Select(CommunicationMapper.ProjectToDto.Compile()));

            return Results.Ok(result);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Communications, PermissionAction.View))
        .WithName("GetCommunicationThread")
        .WithTags("Communications")
        .WithDescription("Get the full thread (parent + children) for a communication")
        .WithSummary("Get communication thread")
        .Produces<List<CommunicationDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}
