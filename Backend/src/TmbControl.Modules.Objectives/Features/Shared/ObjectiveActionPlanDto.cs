namespace TmbControl.Modules.Objectives.Features.Shared;

public class ObjectiveActionPlanDto
{
    public Guid Id { get; init; }
    public int Year { get; set; }
    public string Name { get; init; } = default!;
    public string Description { get; init; } = default!;
    public int Order { get; init; }
    public DateOnly StartIn { get; init; }
    public DateOnly FinisIn { get; init; }
    public ObjectiveStatusDto Status { get; init; } = default!;
    public ObjectiveAreaDto Area { get; init; } = default!;
    public ObjectiveDto Objective { get; init; } = default!;
}
