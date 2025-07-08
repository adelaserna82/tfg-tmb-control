using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Communications.Entities;

namespace TmbControl.Modules.Communications.Persistence;

public class CommunicationsDbContext : DbContext
{
    public CommunicationsDbContext(DbContextOptions<CommunicationsDbContext> options) : base(options) { }

    public DbSet<Communication> Communications => Set<Communication>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Status> Statuses => Set<Status>();
    public DbSet<Origin> Origins => Set<Origin>();
    public DbSet<Responsible> Responsibles => Set<Responsible>();
    public DbSet<Format> Formats => Set<Format>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("communications");
        // This is where we apply all the configurations from the assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(CommunicationsDbContext).Assembly);

        // Configure the composite key for the Responsible entity
        modelBuilder.Entity<Responsible>()
        .HasKey(r => new { r.CommunicationId, r.UserId });

        modelBuilder.Entity<Communication>()
            .HasOne(c => c.Category)
            .WithMany(c => c.Communications)
            .HasForeignKey(c => c.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Communication>()
            .HasOne(c => c.Origin)
            .WithMany(o => o.Communications)
            .HasForeignKey(c => c.OriginId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Communication>()
            .HasOne(c => c.Format)
            .WithMany(f => f.Communications)
            .HasForeignKey(c => c.FormatId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Communication>()
            .HasOne(c => c.Status)
            .WithMany(s => s.Communications)
            .HasForeignKey(c => c.StatusId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
