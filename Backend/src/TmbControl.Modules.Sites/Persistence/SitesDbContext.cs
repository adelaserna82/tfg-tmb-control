using Microsoft.EntityFrameworkCore;
using TmbControl.Modules.Sites.Entities;

namespace TmbControl.Modules.Sites.Persistence;

public class SitesDbContext : DbContext
{
    public SitesDbContext(DbContextOptions<SitesDbContext> options) : base(options) {}

    public DbSet<Site> Sites => Set<Site>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema("sites");
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(SitesDbContext).Assembly);
    }
}
