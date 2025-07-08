namespace TmbControl.Modules.Communications.Features.Shared;

public class CommunicationDto
{
    public Guid Id { get; init; }
    public CommunicationOriginDto Origin { get; init; } = default!;
    public DateOnly Date { get; init; }
    public DateOnly? DueDate { get; init; } 
    public string Description { get; init; } = default!;
    public string? FileName { get; init; }
    public string? FilePath { get; init; }
    public IEnumerable<CommunicationResponsibleDto> Responsibles { get; init; } = default!;
    public CommunicationCategoryDto Category { get; init; } = default!;
    public CommunicationStatusDto Status { get; init; } = default!;
    public CommunicationFormatDto? Format { get; init; }
    public Guid? RelatedId { get; init; }
    public CommunicationRelatedDto? Related { get; init; }
}
