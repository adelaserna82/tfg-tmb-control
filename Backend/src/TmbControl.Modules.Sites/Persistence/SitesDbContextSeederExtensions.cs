using Microsoft.Extensions.DependencyInjection;

namespace TmbControl.Modules.Sites.Persistence;

public static class SitesDbContextSeederExtensions
{
    public static async Task UseSitesSeederAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<SitesDbContext>();
        await SitesDbContextSeeder.SeedAsync(db);
    }
}
