using Microsoft.Extensions.DependencyInjection;

namespace TmbControl.Shared.Persistence;

public static class SharedDbContextSeederExtensions
{
    public static async Task UseSharedSeederAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<SharedDbContext>();
        await SharedDbContextSeeder.SeedAsync(db);
    }
}
