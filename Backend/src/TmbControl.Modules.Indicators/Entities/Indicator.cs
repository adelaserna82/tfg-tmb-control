namespace   TmbControl.Modules.Indicators.Entities;

public class Indicator
{
    public Guid Id { get; set; }
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public double? Value { get; set; }
    public DateOnly? Date { get; set; }

    public int FrequencyId { get; set; }
    public Frequency Frequency { get; set; } = default!;
    public int CategoryId { get; set; }
    public Category Category { get; set; } = default!;

    public int StatusId { get; set; }
    public Status Status { get; set; } = default!;

    public double Min { get; set; }
    public double Max { get; set; }
    public string Unit { get; set; } = default!;

    public double XLocation { get; set; }
    public double YLocation { get; set; }

    public bool IsErrorConfigured { get; set; }
    public double? MinError { get; set; }
    public double? MaxError { get; set; }

    public bool IsAlertConfigured { get; set; }
    public double? MinAlert { get; set; }
    public double? MaxAlert { get; set; }

    // Auditoría
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }

    public ICollection<IndicatorHistory> Histories { get; set; } = [];
}
