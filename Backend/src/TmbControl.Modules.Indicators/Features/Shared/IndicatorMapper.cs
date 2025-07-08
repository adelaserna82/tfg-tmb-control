using System.Linq.Expressions;
using TmbControl.Modules.Indicators.Entities;

namespace TmbControl.Modules.Indicators.Features.Shared;

public static class IndicatorMapper
{
    public static readonly Expression<Func<Indicator, IndicatorDto>> ProjectToDto = i => new IndicatorDto
    {
        Id = i.Id,
        Code = i.Code,
        Name = i.Name,
        Description = i.Description,
        Value = i.Value,
        Unit = i.Unit,
        Date = i.Date,
        Min = i.Min,
        Max = i.Max,
        XLocation = i.XLocation,
        YLocation = i.YLocation,
        IsErrorConfigured = i.IsErrorConfigured,
        MinError = i.MinError,
        MaxError = i.MaxError,
        IsAlertConfigured = i.IsAlertConfigured,
        MinAlert = i.MinAlert,
        MaxAlert = i.MaxAlert,
        Category = new IndicatorCategoryDto
        {
            Id = i.Category.Id,
            Name = i.Category.Name,
            Description = i.Category.Description,
            Order = i.Category.Order
        },
        Status = new IndicatorStatusDto
        {
            Id = i.Status.Id,
            Name = i.Status.Name
        },
        Frequency = new IndicatorFrequencyDto
        {
            Id = i.Frequency.Id,
            Name = i.Frequency.Name
        }
    };

    public static readonly Expression<Func<Indicator, IndicatorDto>> ProjectToDtoWithHistory = i => new IndicatorDto
    {
        Id = i.Id,
        Code = i.Code,
        Name = i.Name,
        Description = i.Description,
        Value = i.Value,
        Unit = i.Unit,
        Date = i.Date,
        Min = i.Min,
        Max = i.Max,
        XLocation = i.XLocation,
        YLocation = i.YLocation,
        IsErrorConfigured = i.IsErrorConfigured,
        MinError = i.MinError,
        MaxError = i.MaxError,
        IsAlertConfigured = i.IsAlertConfigured,
        MinAlert = i.MinAlert,
        MaxAlert = i.MaxAlert,
        Category = new IndicatorCategoryDto
        {
            Id = i.Category.Id,
            Name = i.Category.Name,
            Description = i.Category.Description,
            Order = i.Category.Order
        },
        Status = new IndicatorStatusDto
        {
            Id = i.Status.Id,
            Name = i.Status.Name
        },
        Frequency = new IndicatorFrequencyDto
        {
            Id = i.Frequency.Id,
            Name = i.Frequency.Name
        },
        History = i.Histories
        .OrderByDescending(h => h.Timestamp)
        .Take(10)
        .Select(h => new IndicatorHistoryDto
        {
            Value = h.Value,
            StatusId = h.StatusId,
            Timestamp = h.Timestamp
        }).ToList()
    };
}
