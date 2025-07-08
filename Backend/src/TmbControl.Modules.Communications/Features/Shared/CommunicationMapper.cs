using System.Linq.Expressions;
using TmbControl.Modules.Communications.Entities;
using TmbControl.Shared.Services;

namespace TmbControl.Modules.Communications.Features.Shared;


public static class CommunicationMapper
{
    public static readonly Expression<Func<Communication, CommunicationDto>> ProjectToDto = c => new CommunicationDto
    {
        Id = c.Id,
        Origin = new CommunicationOriginDto
        {
            Id = c.Origin.Id,
            Name = c.Origin.Name,
            Description = c.Origin.Description
        },
        Date = c.Date,
        DueDate = c.DueDate,
        Description = c.Description,
        Category = new CommunicationCategoryDto { Id = c.Category.Id, Name = c.Category.Name },
        Status = new CommunicationStatusDto { Id = c.Status.Id, Name = c.Status.Name },
        Format = c.Format == null ? null : new CommunicationFormatDto
        {
            Id = c.Format.Id,
            Name = c.Format.Name,
            Description = c.Format.Description
        },
        RelatedId = c.RelatedId,

        Related = c.RelatedId == null ? null : new CommunicationRelatedDto
        {
            Id = c.Related!.Id,
            Origin = new CommunicationOriginDto
            {
                Id = c.Related.Origin.Id,
                Name = c.Related.Origin.Name,
                Description = c.Related.Origin.Description
            },
            Date = c.Related.Date,
            Description = c.Related.Description
        },
        
    };

    public static CommunicationDto ToDto(Communication c, IEnumerable<BasicUserInfoDto> allResponsibles)
    {
        return new CommunicationDto
        {
            Id = c.Id,
            Origin = new CommunicationOriginDto
            {
            Id = c.Origin.Id,
            Name = c.Origin.Name,
            Description = c.Origin.Description
            },
            Date = c.Date,
            DueDate = c.DueDate,
            Description = c.Description,
            Category = new CommunicationCategoryDto { Id = c.Category.Id, Name = c.Category.Name },
            Status = new CommunicationStatusDto { Id = c.Status.Id, Name = c.Status.Name },
            RelatedId = c.RelatedId,
            Responsibles = [.. c.Responsibles.Select(r =>
            {
            var user = allResponsibles.FirstOrDefault(u => u.Id == r.UserId);
            return new CommunicationResponsibleDto
            {
                Id = r.UserId,
                Name = user?.Name ?? string.Empty,
                Email = user?.Email ?? string.Empty
            };
            })],
            Format = c.Format == null ? null : new CommunicationFormatDto
            {
                Id = c.Format.Id,
                Name = c.Format.Name,
                Description = c.Format.Description
            },
            Related = c.RelatedId == null ? null : new CommunicationRelatedDto
            {
                Id = c.Related!.Id,
                Origin = new CommunicationOriginDto
                {
                    Id = c.Related.Origin.Id,
                    Name = c.Related.Origin.Name,
                    Description = c.Related.Origin.Description
                },
                Date = c.Related.Date,
                Description = c.Related.Description
            },
            FileName = c.FileName,
            FilePath = c.FilePath
        };
    }
}

