using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TmbControl.Modules.Sites.Features.Create;
using TmbControl.Modules.Sites.Features.Delete;
using TmbControl.Modules.Sites.Features.Example;
using TmbControl.Modules.Sites.Features.GetAll;
using TmbControl.Modules.Sites.Features.GetById;
using TmbControl.Modules.Sites.Features.Update;
using TmbControl.Modules.Sites.Persistence;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Sites;

public static class DependencyInjection
{
    public static IServiceCollection AddSitesModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<SitesDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention()
                   .EnableSensitiveDataLogging()
                   .EnableDetailedErrors());

        return services;
    }

    public static WebApplication MapSitesEndpoints(this WebApplication app)
    {
        // Group protected by authentication and CORS policy
        var apiGroup = app.MapGroup("/api/sites")
            .RequireCors(PoliciyCoors.FrontendPolicy.ToString())
            .RequireAuthorization(PoliciySecurity.Bearer.ToString());

        apiGroup.MapPingSites();
        apiGroup.MapGetAllSites();
        apiGroup.MapGetSiteById();
        apiGroup.MapCreateSite();
        apiGroup.MapUpdateSite();
        apiGroup.MapDeleteSite();

        return app;
    }
}
