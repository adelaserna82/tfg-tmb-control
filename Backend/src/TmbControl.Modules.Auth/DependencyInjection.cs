using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TmbControl.Modules.Auth.Features.Login;
using TmbControl.Modules.Auth.Services;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Auth;

public static class DependencyInjection
{
    public static IServiceCollection AddAuthModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddScoped<IAuthService, AuthService>();
        return services;
    }

    public static WebApplication MapAuthEndpoints(this WebApplication app)
    {
        // Group protected by authentication and CORS policy
        var apiGroup = app.MapGroup("/api/auth")
            .RequireCors(PoliciyCoors.FrontendPolicy.ToString())
            .RequireAuthorization(PoliciySecurity.ApiKey.ToString());

        apiGroup.MapLogin();
        apiGroup.MapPingAuth();

        return app;
    }
}
