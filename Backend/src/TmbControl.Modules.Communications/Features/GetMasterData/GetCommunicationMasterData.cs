using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Services;
using TmbControl.Modules.Communications.Features.Shared;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Authorization;

namespace TmbControl.Modules.Communications.Features.GetMasterData;

public static class GetCommunicationMasterData
{
    public static void MapGetCommunicationMasterData(this IEndpointRouteBuilder app)
    {
        app.MapGet("/master-data", async (
            [FromServices] CommunicationsDbContext db,
            [FromServices] IUserRecipientService userRecipientService) =>
        {
            var currentYear = DateTime.UtcNow.Year;
            var years = await db.Communications
                .AsNoTracking()
                .Select(c => c.Date.Year)
                .Distinct()
                .OrderByDescending(y => y)
                .Select(y => new CommunicationYearDto { Value = y })
                .ToListAsync();

            if (!years.Any(y => y.Value == currentYear))
            {
                years.Add(new CommunicationYearDto { Value = currentYear });
            }

            var categories = await db.Categories
                .AsNoTracking()
                .Select(c => new CommunicationCategoryDto
                {
                    Id = c.Id,
                    Name = c.Name
                })
                .ToListAsync();

            var statuses = await db.Statuses
                .AsNoTracking()
                .Select(s => new CommunicationStatusDto
                {
                    Id = s.Id,
                    Name = s.Name
                })
                .ToListAsync();

            var origins = await db.Origins
                .AsNoTracking()
                .Select(o => new CommunicationOriginDto
                {
                    Id = o.Id,
                    Name = o.Name
                })
                .ToListAsync();

            var responsibles = await userRecipientService
                .GetUsersWithPermissionAsync(PermissionModule.Communications, PermissionAction.Responsible);

            var responsibleDtos = responsibles
                .Select(u => new CommunicationResponsibleDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email
                })
                .ToList();

            var formats = await db.Formats
                .AsNoTracking()
                .Select(f => new CommunicationFormatDto
                {
                    Id = f.Id,
                    Name = f.Name,
                    Description = f.Description
                })
                .ToListAsync();

            var masterData = new CommunicationMasterDataDto
            {
                Years = years,
                Categories = categories,
                Statuses = statuses,
                Origins = origins,
                Responsibles = responsibleDtos,
                Formats = formats
            };

            return Results.Ok(masterData);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Communications, PermissionAction.View))
        .WithName("GetCommunicationMasterData")
        .WithTags("Communications")
        .WithDescription("Get master data for communications filters")
        .WithSummary("Get master data for communications filters")
        .WithMetadata(["Get", "Communications"])
        .Produces<CommunicationMasterDataDto>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        ;
    }
}
