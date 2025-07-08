namespace TmbControl.Modules.OperationalControl.Features.Shared;

public class ActualControlDto
{
    public Guid Id { get; init; }
    public string Concept { get; init; } = default!;
    public string Control { get; init; } = default!;
    public string? Observations { get; init; }
    public DateOnly? LastReview { get; init; }
    public DateOnly? NextReview { get; init; }

    public OperationalControlGroupDto Group { get; init; } = default!;
    public OperationalControlFrequencyDto Frequency { get; init; } = default!;
    public OperationalControlStatusDto Status { get; init; } = default!;

    public List<OperationalControlRevisionDto> Revisions { get; init; } = new();
}
