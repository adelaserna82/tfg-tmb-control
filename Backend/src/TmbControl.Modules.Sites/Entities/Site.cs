namespace TmbControl.Modules.Sites.Entities;

public class Site
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Href { get; set; } = default!;
    public string Description { get; set; } = default!;
}
