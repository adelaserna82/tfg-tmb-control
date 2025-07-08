using Microsoft.Extensions.DependencyInjection;

namespace TmbControl.Modules.OperationalControl.Persistence;

public static class OperationalControlDbContextSeederExtensions
{
    public static async Task UseOperationalControlSeederAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<OperationalControlDbContext>();
        await OperationalControlDbContextSeeder.SeedAsync(db);
    }
}
