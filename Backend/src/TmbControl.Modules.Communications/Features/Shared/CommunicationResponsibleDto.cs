namespace TmbControl.Modules.Communications.Features.Shared;

public class CommunicationResponsibleDto
{
    public Guid Id { get; init; }
    public string Name { get; init; } = default!;
    public string Email { get; init; } = default!;

}
