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

namespace TmbControl.Modules.Communications.Features.GetByCategory;

public static class GetCommunicationsByCategory
{
    public static void MapGetCommunicationsByCategory(this IEndpointRouteBuilder app)
    {
        app.MapGet("/category/{categoryId:int}", async (
            [FromRoute] int categoryId,
            [FromServices] CommunicationsDbContext db,
            [FromServices] IUserRecipientService userRecipientService) =>
        {
            var responsibles = await userRecipientService
                .GetUsersWithPermissionAsync(
                    PermissionModule.Communications,
                    PermissionAction.Responsible);

            var communications = await db.Communications
                .Where(c => c.CategoryId == categoryId)
                .Include(c => c.Category)
                .Include(c => c.Status)
                .Include(c => c.Origin)
                .Include(c => c.Responsibles)
                .Include(c => c.Format)
                .Include(c => c.Related)
                .ThenInclude(r => r!.Origin)
                .AsNoTracking()
                .ToListAsync();

            var communicationDtos = communications
                .Select(c => CommunicationMapper.ToDto(c, responsibles))
                .ToList();

            return Results.Ok(communicationDtos);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Communications, PermissionAction.View))
        .WithName("GetCommunicationsByCategory")
        .WithTags("Communications")
        .WithDescription("Get communications by category")
        .WithSummary("Get communications by category")
        .WithMetadata(new[] { "Get", "Communications" })
        .Produces<CommunicationDto[]>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}
