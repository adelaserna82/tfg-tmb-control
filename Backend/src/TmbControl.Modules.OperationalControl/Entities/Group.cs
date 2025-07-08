namespace TmbControl.Modules.OperationalControl.Entities;

public class Group
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public ICollection<ActualControl> ActualControls { get; set; } = [];

    // Audit 
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
}
