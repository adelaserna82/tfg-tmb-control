using TmbControl.Modules.Indicators.Features.Shared;

namespace TmbControl.Modules.Indicators.Features.GetMasterData;

public class IndicatorsMasterDataDto
{
    public List<IndicatorCategoryDto> Categories { get; set; } = [];
    public List<IndicatorFrequencyDto> Frequencies { get; set; } = [];
}
