using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TmbControl.Modules.OperationalControl.Features.Create;
using TmbControl.Modules.OperationalControl.Features.Delete;
using TmbControl.Modules.OperationalControl.Features.Example;
using TmbControl.Modules.OperationalControl.Features.Finish;
using TmbControl.Modules.OperationalControl.Features.GetAll;
using TmbControl.Modules.OperationalControl.Features.GetById;
using TmbControl.Modules.OperationalControl.Features.GetMasterData;
using TmbControl.Modules.OperationalControl.Features.Update;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Modules.OperationalControl.Services;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Services;

namespace TmbControl.Modules.OperationalControl;

public static class DependencyInjection
{
    public static IServiceCollection AddOperationalControlModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<OperationalControlDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention()
                   .EnableSensitiveDataLogging()
                   .EnableDetailedErrors()
        );

        // Here i can add all the services that i need for the module
        services.AddScoped<IDailyAlertProvider, OperationalControlAlertProvider>();


        return services;
    }

    public static WebApplication MapOperationalControlEndpoints(this WebApplication app)
    {
        // Group protected by authentication and CORS policy
        var apiGroup = app.MapGroup("/api/operational-control")
            .RequireCors(PoliciyCoors.FrontendPolicy.ToString())
            .RequireAuthorization(PoliciySecurity.Bearer.ToString());

        apiGroup.MapPingOperationalControl();
        apiGroup.MapCreateActualControl();
        apiGroup.MapDeleteActualControl();
        apiGroup.MapGetAllActualControls();
        apiGroup.MapGetActualControlById();
        apiGroup.MapUpdateActualControl();
        apiGroup.MapFinish();
        apiGroup.MapGetControlMasterData();
        apiGroup.MapCreateGroup();
        apiGroup.MapCreateFrequency();


        return app;
    }
}
