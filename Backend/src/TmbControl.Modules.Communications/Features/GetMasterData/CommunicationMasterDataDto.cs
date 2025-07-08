using TmbControl.Modules.Communications.Features.Shared;

namespace TmbControl.Modules.Communications.Features.GetMasterData;

public class CommunicationMasterDataDto
{
    public List<CommunicationYearDto> Years { get; set; } = [];
    public List<CommunicationCategoryDto> Categories { get; set; } = [];
    public List<CommunicationStatusDto> Statuses { get; set; } = [];
    public List<CommunicationOriginDto> Origins { get; set; } = [];
    public List<CommunicationResponsibleDto> Responsibles { get; set; } = [];
    public List<CommunicationFormatDto> Formats { get; set; } = [];
}