namespace TmbControl.Modules.Indicators.Entities;

public class IndicatorHistory
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid IndicatorId { get; set; }
    public Indicator Indicator { get; set; } = default!;

    public DateTime Timestamp { get; set; }
    public double Value { get; set; }

    public int StatusId { get; set; }
    public Status Status { get; set; } = default!;
}
