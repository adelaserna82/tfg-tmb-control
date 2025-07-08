namespace TmbControl.Modules.OperationalControl.Features.Shared;

public class OperationalControlRevisionDto
{
    public DateOnly? Date { get; init; }
    public DateOnly? NextReview { get; init; }
    public OperationalControlFrequencyDto Frequency { get; init; } = default!;
    public OperationalControlStatusDto Status { get; init; } = default!;
    public string? Observations { get; init; }
}
