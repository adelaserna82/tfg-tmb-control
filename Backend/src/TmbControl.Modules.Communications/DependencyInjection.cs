using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TmbControl.Modules.Communications.Features.Create;
using TmbControl.Modules.Communications.Features.Delete;
using TmbControl.Modules.Communications.Features.Example;
using TmbControl.Modules.Communications.Features.GetAll;
using TmbControl.Modules.Communications.Features.GetByCategory;
using TmbControl.Modules.Communications.Features.GetById;
using TmbControl.Modules.Communications.Features.GetMasterData;
using TmbControl.Modules.Communications.Features.Thread;
using TmbControl.Modules.Communications.Features.Update;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Modules.Communications.Services;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Services;

namespace TmbControl.Modules.Communications;

public static class DependencyInjection
{
    public static IServiceCollection AddCommunicationsModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<CommunicationsDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention()
                   .EnableSensitiveDataLogging()
                   .EnableDetailedErrors()
        );

        // Here i can add all the services that i need for the module
        services.AddScoped<IDailyAlertProvider, CommunicationsAlertProvider>();

        return services;
    }

    public static WebApplication MapCommunicationsEndpoints(this WebApplication app)
    {

        // Group protected by authentication and CORS policy
        var apiGroup = app.MapGroup("/api/communications")
            .RequireCors(PoliciyCoors.FrontendPolicy.ToString())
            .RequireAuthorization(PoliciySecurity.Bearer.ToString());

        apiGroup.MapPingCommunications();
        apiGroup.MapGetAllCommunications();
        apiGroup.MapGetCommunicationsByCategory();
        apiGroup.MapGetCommunicationById();
        apiGroup.MapGetCommunicationThread();
        apiGroup.MapCreateCommunication();
        apiGroup.MapUpdateCommunication();
        apiGroup.MapDeleteCommunication();
        apiGroup.MapGetCommunicationMasterData();
        apiGroup.MapCreateOrigin();
        apiGroup.MapCreateFormat();

        return app;
    }
}
