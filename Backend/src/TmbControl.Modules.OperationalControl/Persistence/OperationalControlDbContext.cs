using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.OperationalControl.Entities;

namespace TmbControl.Modules.OperationalControl.Persistence;

public class OperationalControlDbContext : DbContext
{
    public OperationalControlDbContext(DbContextOptions<OperationalControlDbContext> options)
        : base(options) { }

    public DbSet<ActualControl> ActualControls => Set<ActualControl>();
    public DbSet<Revision> Revisions => Set<Revision>();
    public DbSet<Status> Statuses => Set<Status>();
    public DbSet<Frequency> Frequencies => Set<Frequency>();
    public DbSet<Group> Groups => Set<Group>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("operational_control");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(OperationalControlDbContext).Assembly);

        modelBuilder.Entity<ActualControl>()
            .HasOne(ac => ac.Group)
            .WithMany(g => g.ActualControls)
            .HasForeignKey(ac => ac.GroupId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ActualControl>()
            .HasOne(ac => ac.Frequency)
            .WithMany(f => f.ActualControls)
            .HasForeignKey(ac => ac.FrequencyId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<ActualControl>()
            .HasOne(ac => ac.Status)
            .WithMany(s => s.ActualControls)
            .HasForeignKey(ac => ac.StatusId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Revision>()
            .HasOne(r => r.ActualControl)
            .WithMany(ac => ac.Revisions)
            .HasForeignKey(r => r.ActualControlId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Revision>()
            .HasOne(r => r.Frequency)
            .WithMany(f=> f.Revisions)
            .HasForeignKey(r => r.FrequencyId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Revision>()
            .HasOne(r => r.Status)
            .WithMany(r=> r.Revisions)
            .HasForeignKey(r => r.StatusId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
