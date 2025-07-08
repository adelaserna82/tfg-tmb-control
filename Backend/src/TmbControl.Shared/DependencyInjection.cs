using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Quartz;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Features.Email;
using TmbControl.Shared.Features.Notifications.GetNotifications;
using TmbControl.Shared.Features.Notifications.Update;
using TmbControl.Shared.Jobs;
using TmbControl.Shared.Persistence;
using TmbControl.Shared.Services;

namespace TmbControl.Shared;

public static class DependencyInjection
{
    public static IServiceCollection AddSharedModule(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<SharedDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection"))
                   .UseSnakeCaseNamingConvention()
                   .EnableSensitiveDataLogging()
                   .EnableDetailedErrors());

        services.AddScoped<INotificationService, NotificationService>();
        services.Configure<SmtpSettings>(configuration.GetSection("Smtp"));
        services.AddScoped<IEmailService, SmtpEmailService>();

        services.AddQuartz(q =>
        {
            var jobKey = new JobKey("DailyNotificationsJob");

            q.AddJob<DailyNotificationsJob>(opts => opts.WithIdentity(jobKey));
            q.AddTrigger(opts => opts
                .ForJob(jobKey)
                .WithIdentity("DailyNotificationsTrigger")
                .WithCronSchedule("0 0 5 * * ?")); // A las 5:00 AM UTC
        });

        // This wait for jobs to complete before shutting down the application
        services.AddQuartzHostedService(q => q.WaitForJobsToComplete = true);

        return services;
    }

    public static WebApplication MapSharedEndpoints(this WebApplication app)
    {

        // Group protected by authentication and CORS policy
        var apiGroup = app.MapGroup("/api/notifications")
            .RequireCors(PoliciyCoors.FrontendPolicy.ToString())
            .RequireAuthorization(PoliciySecurity.Bearer.ToString());

        apiGroup.MapGetUserNotifications();
        apiGroup.MapMarkNotificationAsRead();

        if (app.Environment.IsDevelopment())
        {
            // In development, we can send test emails
            apiGroup.MapSendTestEmail();
        }

        return app;
    }
}
