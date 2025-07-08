namespace TmbControl.Modules.Sites.Features.Shared;

public class SiteDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string Href { get; init; } = default!;
    public string Description { get; init; } = default!;
}
