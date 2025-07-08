namespace TmbControl.Modules.Indicators.Features.Shared;

public record IndicatorHistoryDto
{
    public double Value { get; init; }
    public int StatusId { get; init; }
    public DateTime Timestamp { get; init; }
}
