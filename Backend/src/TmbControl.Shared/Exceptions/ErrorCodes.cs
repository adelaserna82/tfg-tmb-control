namespace TmbControl.Shared.Exceptions;

public static class ErrorCodes
{
    public const string ActionPlanNotFound = "OACTION_PLAN_NOT_FOUND";
    public const string ActualControlNotFound = "ACTUAL_CONTROL_NOT_FOUND";
    public const string AuthError = "AUTH_ERROR";
    public const string CommunicationHasChildren = "COMMUNICATION_HAS_CHILDREN";
    public const string CommunicationNotFound = "COMMUNICATION_NOT_FOUND";
    public const string IndicatorNotFound = "INDICATOR_NOT_FOUND";
    public const string IndicatorAlreadyExists = "INDICATOR_ALREADY_EXISTS";

    public const string FormatAlreadyExists = "FORMAT_ALREADY_EXISTS";
    public const string ObjectiveNotFound = "OBJECTIVE_NOT_FOUND";
    public const string OriginAlreadyExists = "ORIGIN_ALREADY_EXISTS";
    public const string InternalServerError = "INTERNAL_SERVER_ERROR";
    public const string NotAccepable = "NOT_ACCEPTABLE";
    public const string SiteNotFound = "SITE_NOT_FOUND";
    public const string UserUnauthorized = "USER_UNAUTHORIZED";
    public const string UserNotFound = "USER_NOT_FOUND";

    public const string RoleAlreadyExists = "ROLE_ALREADY_EXISTS";
    public const string RoleNotFound = "ROLE_NOT_FOUND";

    public const string PermissionNotFound = "PERMISSION_NOT_FOUND";
    public const string PermissionDenied = "PERMISSION_DENIED";

    public const string NotificationNotFound = "NOTIFICATION_NOT_FOUND";
}
