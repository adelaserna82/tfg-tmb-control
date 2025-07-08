namespace TmbControl.Modules.Indicators.Entities;

public class Status
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public ICollection<Indicator> Indicators { get; set; } = [];
    
    // Audit
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
