using Microsoft.Extensions.DependencyInjection;

namespace TmbControl.Modules.Objectives.Persistence;

public static class ObjectivesDbContextSeederExtensions
{
    public static async Task UseObjectivesSeederAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ObjectivesDbContext>();
        await ObjectivesDbContextSeeder.SeedAsync(context);
    }
}
