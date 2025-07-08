using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Objectives.Entities;

namespace TmbControl.Modules.Objectives.Persistence;

public class ObjectivesDbContext : DbContext
{
    public ObjectivesDbContext(DbContextOptions<ObjectivesDbContext> options) : base(options) {}

    public DbSet<Area> Areas => Set<Area>();
    public DbSet<Status> Statuses => Set<Status>();
    public DbSet<Objective> Objectives => Set<Objective>();
    public DbSet<Entities.ActionPlan> ActionPlans => base.Set<Entities.ActionPlan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("objectives");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ObjectivesDbContext).Assembly);

        modelBuilder.Entity<Entities.ActionPlan>()
            .HasOne(oa => oa.Area)
            .WithMany(a => a.ActionPlans)
            .HasForeignKey(oa => oa.AreaId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Entities.ActionPlan>()
            .HasOne(oa => oa.Objective)
            .WithMany(o => o.ActionPlans)
            .HasForeignKey(oa => oa.ObjectiveId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Entities.ActionPlan>()
            .HasOne(oa => oa.Status)
            .WithMany(s => s.ActionsPlans)
            .HasForeignKey(oa => oa.StatusId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
