namespace TmbControl.Modules.Indicators.Features.Shared;

public record IndicatorDto
{
    public required Guid Id { get; init; }
    public required string Code { get; init; }
    public required string Name { get; init; }
    public string? Description { get; init; }
    public double? Value { get; init; }
    public required string Unit { get; init; }
    public DateOnly? Date { get; init; }
    public required IndicatorCategoryDto Category { get; init; }
    public required IndicatorStatusDto Status { get; init; }
    public required IndicatorFrequencyDto Frequency { get; init; }

    public double Min { get; set; }
    public double Max { get; set; }

    public double XLocation { get; set; }
    public double YLocation { get; set; }

    public bool IsErrorConfigured { get; set; }
    public double? MinError { get; set; }
    public double? MaxError { get; set; }

    public bool IsAlertConfigured { get; set; }
    public double? MinAlert { get; set; }
    public double? MaxAlert { get; set; }

    public List<IndicatorHistoryDto> History { get; init; } = new();

}