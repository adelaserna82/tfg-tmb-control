namespace TmbControl.Modules.Communications.Entities;

public class Responsible
{
    public Guid CommunicationId { get; set; }
    public Communication Communication { get; set; } = default!;

    public Guid UserId { get; set; }
    // Si tienes acceso a la entidad User, puedes añadir la navegación:
    // public User User { get; set; } = default!;
}