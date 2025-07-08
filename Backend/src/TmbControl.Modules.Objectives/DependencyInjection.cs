using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TmbControl.Modules.Communications.Features.GetMasterData;
using TmbControl.Modules.Objectives.Features.Create;
using TmbControl.Modules.Objectives.Features.Delete;
using TmbControl.Modules.Objectives.Features.Duplicate;
using TmbControl.Modules.Objectives.Features.Example;
using TmbControl.Modules.Objectives.Features.GetAll;
using TmbControl.Modules.Objectives.Features.GetById;
using TmbControl.Modules.Objectives.Features.Update;
using TmbControl.Modules.Objectives.Persistence;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Objectives;

public static class DependencyInjection
{
    public static IServiceCollection AddObjectivesModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<ObjectivesDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention()
                   .EnableSensitiveDataLogging()
                   .EnableDetailedErrors());

        return services;
    }

    public static WebApplication MapObjectivesEndpoints(this WebApplication app)
    {
        // Group protected by authentication and CORS policy
        var apiGroup = app.MapGroup("/api/action-plans")
            .RequireCors(PoliciyCoors.FrontendPolicy.ToString())
            .RequireAuthorization(PoliciySecurity.Bearer.ToString());

        apiGroup.MapPingObjectives();
        apiGroup.MapGetAllActionPlans();
        apiGroup.MapGetActionPlanById();
        apiGroup.MapCreateActionPlan();
        apiGroup.MapUpdateActionPlan();
        apiGroup.MapDeleteActionPlan();
        apiGroup.MapDuplicateActionPlansByYear();
        apiGroup.MapGetObjectiveMasterData();
        apiGroup.MapCreateArea();
        apiGroup.MapCreateObjective();

        return app;
    }
}
