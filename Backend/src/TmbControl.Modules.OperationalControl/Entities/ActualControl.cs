namespace TmbControl.Modules.OperationalControl.Entities;

public class ActualControl
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Concept { get; set; } = default!;
    public string Control { get; set; } = default!;
    public string? Observations { get; set; }

    public DateOnly? LastReview { get; set; }
    public DateOnly? NextReview { get; set; }

    public int GroupId { get; set; }
    public Group Group { get; set; } = default!;

    public int FrequencyId { get; set; }
    public Frequency Frequency { get; set; } = default!;

    public int StatusId { get; set; }
    public Status Status { get; set; } = default!;

    public ICollection<Revision> Revisions { get; set; } = [];

    // Audit
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
