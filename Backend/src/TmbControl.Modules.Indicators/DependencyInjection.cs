using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TmbControl.Modules.Indicators.Features.Create;
using TmbControl.Modules.Indicators.Features.Delete;
using TmbControl.Modules.Indicators.Features.Example;
using TmbControl.Modules.Indicators.Features.GetAll;
using TmbControl.Modules.Indicators.Features.GetAllWithHistory;
using TmbControl.Modules.Indicators.Features.GetByCategory;
using TmbControl.Modules.Indicators.Features.GetByCategoryWithHistory;
using TmbControl.Modules.Indicators.Features.GetById;
using TmbControl.Modules.Indicators.Features.GetMasterData;
using TmbControl.Modules.Indicators.Features.History;
using TmbControl.Modules.Indicators.Features.IngestMany;
using TmbControl.Modules.Indicators.Features.Notifications;
using TmbControl.Modules.Indicators.Features.Shared;
using TmbControl.Modules.Indicators.Features.Update;
using TmbControl.Modules.Indicators.Features.UpdateValue;
using TmbControl.Modules.Indicators.Persistence;
using TmbControl.Shared.Enums;


namespace TmbControl.Modules.Indicators;

public static class DependencyInjection
{
    public static IServiceCollection AddIndicatorsModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<IndicatorsDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                .UseSnakeCaseNamingConvention()
                .EnableSensitiveDataLogging()
                .EnableDetailedErrors()

            );

        services.AddScoped<IndicatorUpdater>();

        return services;
    }

    public static WebApplication MapIndicatorsEndpoints(this WebApplication app)
    {

        // Group protected by authentication and CORS policy
        var apiGroup = app.MapGroup("/api/indicators")
            .RequireCors(PoliciyCoors.FrontendPolicy.ToString())
            .RequireAuthorization(PoliciySecurity.Bearer.ToString());

        apiGroup.MapPingIndicators();
        apiGroup.MapGetAllIndicators();
        apiGroup.MapGetAllIndicatorsWithHistory();
        apiGroup.MapGetIndicatorsByCategory();
        apiGroup.MapGetIndicatorsByCategoryWithHistory();
        apiGroup.MapCreateIndicator();
        apiGroup.MapUpdateIndicator();
        apiGroup.MapDeleteIndicator();
        apiGroup.MapGetIndicatorById();
        apiGroup.MapGetIndicatorHistory();
        apiGroup.MapUpdateIndicatorValue();
        apiGroup.MapIngestManyIndicatorValues();
        apiGroup.MapGetIndicatorMasterData();
        apiGroup.MapCreateCategory();

        // Hubs SignalR
        app.MapHub<IndicatorsHub>("/hubs/indicators")
            .RequireCors(PoliciyCoors.FrontendPolicy.ToString())
            .RequireAuthorization(PoliciySecurity.Bearer.ToString());

        return app;


    }
}
