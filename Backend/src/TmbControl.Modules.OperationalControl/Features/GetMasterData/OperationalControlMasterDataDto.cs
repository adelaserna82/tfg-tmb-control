using TmbControl.Modules.OperationalControl.Features.Shared;

namespace TmbControl.Modules.OperationalControl.Features.GetMasterData;

public class OperationalControlMasterDataDto
{
    public List<OperationalControlYearDto> Years { get; set; } = [];
    public List<OperationalControlGroupDto> Groups { get; set; } = [];
    public List<OperationalControlFrequencyDto> Frequencies { get; set; } = [];
    public List<OperationalControlStatusDto> Statuses { get; set; } = [];
}
