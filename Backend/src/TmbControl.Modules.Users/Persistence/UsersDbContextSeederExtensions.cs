using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using TmbControl.Modules.Users.Options;

namespace TmbControl.Modules.Users.Persistence;

public static class UsersDbContextSeederExtensions
{
    public static async Task UseUsersSeederAsync(this IServiceProvider services)
    {
        using var scope = services.CreateScope();

        var db = scope.ServiceProvider.GetRequiredService<UsersDbContext>();
        var adminOptions = scope.ServiceProvider.GetRequiredService<IOptions<AdminUserOptions>>();


        await UsersDbContextSeeder.SeedAsync(db, adminOptions.Value);
    }
}
