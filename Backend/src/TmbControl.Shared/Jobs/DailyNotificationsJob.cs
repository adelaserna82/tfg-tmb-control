using Microsoft.EntityFrameworkCore;
using Quartz;
using TmbControl.Modules.Shared.Enums;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Features.Notifications.GetNotifications;
using TmbControl.Shared.Persistence;
using TmbControl.Shared.Services;

namespace TmbControl.Shared.Jobs;

public class DailyNotificationsJob(
    IEnumerable<IDailyAlertProvider> dailyAlertProviders,
    INotificationService notificationService,
    IEmailService emailService,
    IUserRecipientService userRecipientService,
    SharedDbContext sharedDbContext
    ) : IJob
{
    private readonly IEnumerable<IDailyAlertProvider> _dailyAlertProviders = dailyAlertProviders;
    private readonly INotificationService _notificationService = notificationService;
    private readonly IEmailService _emailService = emailService;
    private readonly IUserRecipientService _userRecipientService = userRecipientService;
    private readonly SharedDbContext _sharedDbContext = sharedDbContext;




    public async Task Execute(IJobExecutionContext context)
    {
        var allNotifications = new List<NotificationDto>();

        foreach (var provider in _dailyAlertProviders)
        {
            var alerts = await provider.GetDailyNotificationsAsync();
            foreach (var alert in alerts)
            {
                await _notificationService.CreateAsync(
                    title: alert.Title,
                    message: alert.Message,
                    type: Enum.Parse<NotificationType>(alert.Type),
                    module: Enum.Parse<PermissionModule>(alert.Module),
                    link: alert.Link,
                    createdBy: "System"
                );
                allNotifications.Add(alert);
            }
        }

        // In the email, we must include the las notifications of indicators module
        var lastNotifications = await _sharedDbContext.Notifications
            .Where(n => n.Module == PermissionModule.Indicators.ToString())
            .OrderByDescending(n => n.CreatedAt)
            .Take(5)
            .ToListAsync();


        // Add the last notifications to the email
        allNotifications.AddRange(lastNotifications.Select(n => new NotificationDto
        {
            Id = n.Id,
            Title = n.Title,
            Message = n.Message ?? "",
            Type = n.Type,
            Module = n.Module ?? "",
            CreatedAt = n.CreatedAt
        }));

        // Get users with permission to see the notifications grouped by module
        var usersWithPermissionInIndicators = await _userRecipientService.GetUsersWithPermissionAsync(
            PermissionModule.Indicators,
            PermissionAction.ReceiveNotification
        );

        var usersWithPermissionInOperationalControl = await _userRecipientService.GetUsersWithPermissionAsync(
            PermissionModule.OperationalControl,
            PermissionAction.ReceiveNotification
        );

        var usersWithPermissionInCommunications = await _userRecipientService.GetUsersWithPermissionAsync(
            PermissionModule.Communications,
            PermissionAction.ReceiveNotification
        );



        // Send email to users with permission to see the notifications in the indicators module, before filter by module
        foreach (var user in usersWithPermissionInIndicators)
        {
            var userNotifications = allNotifications
                .Where(n => n.Module == PermissionModule.Indicators.ToString())
                .ToList();

            if (userNotifications.Count != 0)
            {
                var resumen = string.Join("\n", userNotifications.Select(n => $"- {n.Message}"));
                await _emailService.SendAsync(new EmailDto
                {
                    To = user.Email,
                    Subject = "Resumen diario de alertas TMB en el módulo de indicadores",
                    Body = $"Notificaciones generadas:\n\n{resumen}"
                });
            }
        }


        // Send email to users with permission to see the notifications in the operational control module, before filter by module
        foreach (var user in usersWithPermissionInOperationalControl)
        {
            var userNotifications = allNotifications
                .Where(n => n.Module == PermissionModule.OperationalControl.ToString())
                .ToList();

            if (userNotifications.Count != 0)
            {
                var resumen = string.Join("\n", userNotifications.Select(n => $"- {n.Message}"));
                await _emailService.SendAsync(new EmailDto
                {
                    To = user.Email,
                    Subject = "Resumen diario de alertas TMB en el módulo de control operativo",
                    Body = $"Notificaciones generadas:\n\n{resumen}"
                });
            }
        }

        // Send email to users with permission to see the notifications in the communications module, before filter by module
        foreach (var user in usersWithPermissionInCommunications)
        {
            var userNotifications = allNotifications
                .Where(n => n.Module == PermissionModule.Communications.ToString())
                .ToList();

            if (userNotifications.Count != 0)
            {
                var resumen = string.Join("\n", userNotifications.Select(n => $"- {n.Message}"));
                await _emailService.SendAsync(new EmailDto
                {
                    To = user.Email,
                    Subject = "Resumen diario de alertas TMB en el módulo de comunicaciones",
                    Body = $"Notificaciones generadas:\n\n{resumen}"
                });
            }
        }
        

        


    }
}
