using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Communications.Features.Shared;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Services;

namespace TmbControl.Modules.Communications.Features.GetById;

public static class GetCommunicationById
{
    public static void MapGetCommunicationById(this IEndpointRouteBuilder app)
    {
        app.MapGet("/{id:guid}", async (
            [FromRoute] Guid id,
            [FromServices] CommunicationsDbContext db,
            [FromServices] IUserRecipientService userRecipientService) =>
        {

            var responsibles = await userRecipientService
                .GetUsersWithPermissionAsync(
                    PermissionModule.Communications,
                    PermissionAction.Responsible);

            var communication = await db.Communications
                .Include(c => c.Category)
                .Include(c => c.Status)
                .Include(c => c.Origin)
                .Include(c => c.Responsibles)
                .AsNoTracking()
                .Where(c => c.Id == id)
                .FirstOrDefaultAsync();

            if (communication is null)
            {
                return Results.NotFound();
            }

            var communicationDto = CommunicationMapper.ToDto(communication, responsibles);

            return Results.Ok(communicationDto);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Communications, PermissionAction.View))
        .WithName("GetCommunicationById")
        .WithTags("Communications")
        .WithDescription("Get a communication by ID")
        .WithSummary("Get a communication by ID")
        .WithMetadata(["Get", "Communications"])
        .Produces<CommunicationDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound);
    }
}
