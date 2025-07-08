using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using TmbControl.Modules.Users.Features.Create;
using TmbControl.Modules.Users.Features.Delete;
using TmbControl.Modules.Users.Features.Example;
using TmbControl.Modules.Users.Features.GetAll;
using TmbControl.Modules.Users.Features.GetById;
using TmbControl.Modules.Users.Features.GetMasterData;
using TmbControl.Modules.Users.Features.Update;
using TmbControl.Modules.Users.Options;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Modules.Users.Services;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Services;
using TmbControl.Shared.Services.Users;

namespace TmbControl.Modules.Users;

public static class DependencyInjection
{
    public static IServiceCollection AddUsersModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<UsersDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention()
                   .EnableSensitiveDataLogging()
                   .EnableDetailedErrors());

        services.AddScoped<IUserRecipientService, UserRecipientService>();
        services.AddScoped<IUserLoginService, UserLoginService>();
        services.Configure<AdminUserOptions>(configuration.GetSection("AdminUser"));

        return services;
    }

    public static WebApplication MapUsersEndpoints(this WebApplication app)
    {
        // Group protected by authentication and CORS policy
        var apiGroup = app.MapGroup("/api/users")
            .RequireCors(PoliciyCoors.FrontendPolicy.ToString())
            .RequireAuthorization(PoliciySecurity.Bearer.ToString());

        apiGroup.MapPingUsers();
        apiGroup.MapGetAllUsers();
        apiGroup.MapGetUserById();
        apiGroup.MapCreateUser();
        apiGroup.MapUpdateUser();
        apiGroup.MapDeleteUser();
        apiGroup.MapGetUserMasterData();
        apiGroup.MapCreateRole();
        apiGroup.MapUpdateRole();

        return app;
    }
}
