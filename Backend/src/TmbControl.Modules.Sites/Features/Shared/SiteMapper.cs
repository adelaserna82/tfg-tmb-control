using System.Linq.Expressions;
using TmbControl.Modules.Sites.Entities;

namespace TmbControl.Modules.Sites.Features.Shared;

public static class SiteMapper
{
    public static readonly Expression<Func<Site, SiteDto>> ProjectToDto = site => new SiteDto
    {
        Id = site.Id,
        Name = site.Name,
        Href = site.Href,
        Description = site.Description
    };
}
