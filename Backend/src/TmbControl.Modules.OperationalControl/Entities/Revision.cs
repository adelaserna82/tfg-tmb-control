namespace TmbControl.Modules.OperationalControl.Entities;

public class Revision
{
    public Guid Id { get; set; }

    public Guid ActualControlId { get; set; }
    public ActualControl ActualControl { get; set; } = default!;

    public DateOnly? Date { get; set; }
    public DateOnly? NextReview { get; set; }

    public int FrequencyId { get; set; }
    public Frequency Frequency { get; set; } = default!;

    public int StatusId { get; set; }
    public Status Status { get; set; } = default!;

    public string? Observations { get; set; }

    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
}

