namespace TmbControl.Modules.Communications.Entities;

public class Status
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;

    public ICollection<Communication> Communications { get; set; } = new List<Communication>();
}
