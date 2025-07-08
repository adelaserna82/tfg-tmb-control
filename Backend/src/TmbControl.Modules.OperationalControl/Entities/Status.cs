namespace TmbControl.Modules.OperationalControl.Entities;

public class Status
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public ICollection<ActualControl> ActualControls { get; set; } = [];
    public ICollection<Revision> Revisions { get; set; } = [];

    // Audit
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
