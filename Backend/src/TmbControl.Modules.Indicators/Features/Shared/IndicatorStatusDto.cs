namespace TmbControl.Modules.Indicators.Features.Shared;

public record IndicatorStatusDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
}
