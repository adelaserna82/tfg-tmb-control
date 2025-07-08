using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Indicators.Entities;

namespace TmbControl.Modules.Indicators.Persistence;

public class IndicatorsDbContext : DbContext
{
    public IndicatorsDbContext(DbContextOptions<IndicatorsDbContext> options) : base(options) { }

    public DbSet<Indicator> Indicators => Set<Indicator>();
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Status> Statuses => Set<Status>();
    public DbSet<Frequency> Frequencies => Set<Frequency>();
    public DbSet<IndicatorHistory> IndicatorHistories => Set<IndicatorHistory>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("indicators");
        // This will apply all configurations in the assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(IndicatorsDbContext).Assembly);

        // Relación Indicator → Category
        modelBuilder.Entity<Indicator>()
            .HasOne(i => i.Category)
            .WithMany(c => c.Indicators)
            .HasForeignKey(i => i.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación Indicator → Frequency
        modelBuilder.Entity<Indicator>()
            .HasOne(i => i.Frequency)
            .WithMany(f => f.Indicators)
            .HasForeignKey(i => i.FrequencyId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación Indicator → Status
        modelBuilder.Entity<Indicator>()
            .HasOne(i => i.Status)
            .WithMany(s => s.Indicators)
            .HasForeignKey(i => i.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relación IndicatorHistory → Indicator
        modelBuilder.Entity<IndicatorHistory>()
            .HasOne(h => h.Indicator)
            .WithMany(i => i.Histories)
            .HasForeignKey(h => h.IndicatorId)
            .OnDelete(DeleteBehavior.Cascade);

        // Relación IndicatorHistory → Status
        modelBuilder.Entity<IndicatorHistory>()
            .HasOne(h => h.Status)
            .WithMany()
            .HasForeignKey(h => h.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
