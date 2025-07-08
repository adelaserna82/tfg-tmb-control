namespace TmbControl.Modules.Communications.Entities;

public class Communication
{
    public Guid Id { get; set; }

    public int CategoryId { get; set; }
    public Category Category { get; set; } = default!;

    public int OriginId { get; set; }
    public Origin Origin { get; set; } = default!;
    public DateOnly Date { get; set; }
        // Is the due date of the communication
    public DateOnly? DueDate { get; set; } 

    public string Description { get; set; } = default!;
    public ICollection<Responsible> Responsibles { get; set; } = [];
    public string? FileName { get; set; }
    public string? FilePath { get; set; }
    public int StatusId { get; set; }
    public Status Status { get; set; } = default!;

    public int? FormatId { get; set; }
    public Format? Format { get; set; } = default!;

    public Guid? RelatedId { get; set; }
    public Communication? Related { get; set; }
    public ICollection<Communication> RelatedTo { get; set; } = [];


    // Audit
    public DateTime CreatedAt { get; set; }
    public string CreatedBy { get; set; } = default!;
    public DateTime? UpdatedAt { get; set; }
    public string? UpdatedBy { get; set; }
}
