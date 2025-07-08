namespace TmbControl.Modules.Communications.Features.Shared;

public class CommunicationRelatedDto
{
    public Guid Id { get; init; }

    public CommunicationOriginDto Origin { get; init; } = default!;
    public DateOnly Date { get; init; }
    public string Description { get; init; } = default!;
 
}