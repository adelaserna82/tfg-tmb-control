
using TmbControl.Modules.Objectives.Features.Shared;

namespace TmbControl.Modules.Objectives.Features.GetMasterData;

public class ObjectiveMasterDataDto
{
    public List<ObjectiveYearDto> Years { get; set; } = [];
    public List<ObjectiveStatusDto> Statuses { get; set; } = [];
    public List<ObjectiveAreaDto> Areas { get; set; } = [];
    public List<ObjectiveDto> Objectives { get; set; } = [];

}