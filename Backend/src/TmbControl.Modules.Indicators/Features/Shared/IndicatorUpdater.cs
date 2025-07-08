using TmbControl.Modules.Indicators.Entities;
using TmbControl.Modules.Indicators.Persistence;
using Microsoft.EntityFrameworkCore;
using TmbControl.Shared.Services;
using TmbControl.Modules.Indicators.Enums;
using TmbControl.Shared.Enums;
using TmbControl.Modules.Shared.Enums;

namespace TmbControl.Modules.Indicators.Features.Shared;

public class IndicatorUpdater(IndicatorsDbContext db, INotificationService notificationService)
{
    private readonly IndicatorsDbContext _db = db;
    private readonly INotificationService _notificationService = notificationService;
    public async Task UpdateOrInsertValueAsync(Indicator indicator, double newValue, DateOnly newDate, string updatedBy)
    {
        var now = DateTime.UtcNow;

        // Calculate the new status based on the new value
        var calculatedStatus = StatusCalculator.CalculateStatus(
            newValue,
            indicator.Min,
            indicator.Max,
            indicator.IsAlertConfigured,
            indicator.MinAlert,
            indicator.MaxAlert,
            indicator.IsErrorConfigured,
            indicator.MinError,
            indicator.MaxError
        );

        // If the new date is before the current indicator date, we do not update it
        if (newDate > indicator.Date)
        {
            // Update the indicator
            indicator.Value = newValue;
            indicator.Date = newDate;
            indicator.StatusId = calculatedStatus;
            indicator.UpdatedAt = now;
            indicator.UpdatedBy = updatedBy;
        }


        // Now we check the history to see if we need to insert a new entry or update the existing one
        var utcNewDate = DateTime.SpecifyKind(newDate.ToDateTime(new TimeOnly()), DateTimeKind.Utc);

        var existingHistory = await _db.IndicatorHistories
            .Where(h => h.IndicatorId == indicator.Id && h.Timestamp.Date == utcNewDate.Date)
            .OrderByDescending(h => h.Timestamp)
            .FirstOrDefaultAsync();

        if (existingHistory != null)
        {
            bool sameHistoricValue = Math.Abs(existingHistory.Value - newValue) < 0.0001;
            bool sameHistoricStatus = existingHistory.StatusId == calculatedStatus;

            if (!sameHistoricValue || !sameHistoricStatus)
            {
                // Update the existing history entry
                existingHistory.Value = newValue;
                existingHistory.StatusId = calculatedStatus;
                existingHistory.Timestamp = utcNewDate;
            }

        }
        else
        {
            // If the value is different, we create a new history entry
            _db.IndicatorHistories.Add(new IndicatorHistory
            {
                Id = Guid.NewGuid(),
                IndicatorId = indicator.Id,
                Value = newValue,
                StatusId = calculatedStatus,
                Timestamp = utcNewDate
            });
        }

        // Send notification only if the indicator date is today
        if (newDate == DateOnly.FromDateTime(DateTime.UtcNow))
        {
            // Check if the indicator has a notification error or warning configured
            // calculatedStatus => 2 = Alert, 3 = Error
            if (indicator.IsAlertConfigured && (indicator.MinAlert != null || indicator.MaxAlert != null))
            {
                if (calculatedStatus == (int)ActualStatus.Alert)
                {
                    await _notificationService.CreateAsync(
                        title: "Atención",
                        message: $"El indicador '{indicator.Name}' está en alerta. Valor: {newValue}",
                        type: NotificationType.Warning,
                        module: PermissionModule.Indicators,
                        link: null,
                        createdBy: updatedBy
                    );
                }
            }
            else if (indicator.IsErrorConfigured && (indicator.MinError != null || indicator.MaxError != null))
            {
                if (calculatedStatus == (int)ActualStatus.Error)
                {
                    await _notificationService.CreateAsync(
                        title: "Error",
                        message: $"El indicador '{indicator.Name}' tiene un error. Valor: {newValue}",
                        type: NotificationType.Error,
                        module: PermissionModule.Indicators,
                        link: null,
                        createdBy: updatedBy
                    );
                }
            }
        }
    }
}



