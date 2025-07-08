using Microsoft.Extensions.DependencyInjection;

namespace TmbControl.Modules.Communications.Persistence;

public static class CommunicationsDbContextSeederExtensions
{
    public static async Task UseCommunicationsSeederAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<CommunicationsDbContext>();
        await CommunicationsDbContextSeeder.SeedAsync(context);
    }
}
