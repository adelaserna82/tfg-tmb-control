namespace TmbControl.Modules.Objectives.Entities;

public class Status
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public ICollection<Objective> Objectives { get; set; } = [];
    public ICollection<ActionPlan> ActionsPlans { get; set; } = [];
}
