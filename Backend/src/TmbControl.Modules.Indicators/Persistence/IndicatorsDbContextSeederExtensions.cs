using Microsoft.Extensions.DependencyInjection;

namespace TmbControl.Modules.Indicators.Persistence;

public static class IndicatorsDbContextSeederExtensions
{
    public static async Task UseIndicatorsSeederAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<IndicatorsDbContext>();
        await IndicatorsDbContextSeeder.SeedAsync(context);
    }
}
