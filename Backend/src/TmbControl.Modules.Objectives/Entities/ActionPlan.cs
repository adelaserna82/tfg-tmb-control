namespace TmbControl.Modules.Objectives.Entities;
public class ActionPlan
{
    public Guid Id { get; set; }
    public int Year { get; set; }

    public Guid AreaId { get; set; }
    public Area Area { get; set; } = default!;

    public Guid ObjectiveId { get; set; }
    public Objective Objective { get; set; } = default!;

    public string Name { get; set; } = default!;
    public string Description { get; set; } = default!;
    public int Order { get; set; }

    public int StatusId { get; set; }
    public Status Status { get; set; } = default!;

    public DateOnly StartIn { get; set; }
    public DateOnly FinisIn { get; set; }

    // Audit
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
