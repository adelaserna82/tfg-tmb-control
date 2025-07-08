namespace TmbControl.Modules.Indicators.Features.Shared;

public record IndicatorCategoryDto
{
    public required int Id { get; init; }
    public required string Name { get; init; }
    public required string Description { get; init; }
    public required int Order { get; init; }
}