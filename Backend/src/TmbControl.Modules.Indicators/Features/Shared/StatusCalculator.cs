namespace TmbControl.Modules.Indicators.Features.Shared;

public static class StatusCalculator
{
    /// <summary>
    /// Determina el estado del indicador: 1 (Alerta), 2 (Peligro), 3 (Correcto)
    /// </summary>
    public static int CalculateStatus(
        double value,
        double min,
        double max,
        bool isAlertConfigured,
        double? minAlert,
        double? maxAlert,
        bool isErrorConfigured,
        double? minError,
        double? maxError)
    {
        var isInRange = value >= min && value <= max;
        if (isInRange)
            return 3; // Correcto

        if (!isAlertConfigured && !isErrorConfigured)
            return 2; // Siempre peligro si no hay configuración

        if (isErrorConfigured &&
            ((minError.HasValue && value <= minError.Value) ||
             (maxError.HasValue && value >= maxError.Value)))
        {
            return 2; // Peligro
        }

        if (isAlertConfigured &&
            ((minAlert.HasValue && value <= minAlert.Value) ||
             (maxAlert.HasValue && value >= maxAlert.Value)))
        {
            return 1; // Alerta
        }

        return 2; // Fallback: Peligro
    }
}
