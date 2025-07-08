namespace TmbControl.Modules.Communications.Entities
{
    public class Format
    {
        public int Id { get; set; }
        public string Name { get; set; } = default!;
        public string Description { get; set; } = default!;

        public ICollection<Communication> Communications { get; set; } = new List<Communication>();

        public DateTime CreatedAt { get; set; }
        public string CreatedBy { get; set; } = default!;

    }
}