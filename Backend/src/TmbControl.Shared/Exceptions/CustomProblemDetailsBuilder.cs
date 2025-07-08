using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TmbControl.Shared.Exceptions;

public static class CustomProblemDetailsBuilder
{
    public static CustomProblemDetails BadRequest(string detail, string? title = null, string? errorCode = null) =>
        Create(StatusCodes.Status400BadRequest, detail, title, errorCode);

    public static CustomProblemDetails Unauthorized(string detail, string? title = null, string? errorCode = null) =>
        Create(StatusCodes.Status401Unauthorized, detail, title, errorCode);

    public static CustomProblemDetails Forbidden(string detail, string? title = null, string? errorCode = null) =>
        Create(StatusCodes.Status403Forbidden, detail, title, errorCode);

    public static CustomProblemDetails NotFound(string detail, string? title = null, string? errorCode = null) =>
        Create(StatusCodes.Status404NotFound, detail, title, errorCode);

    public static CustomProblemDetails Conflict(string detail, string? title = null, string? errorCode = null) =>
        Create(StatusCodes.Status409Conflict, detail, title, errorCode);

    public static CustomProblemDetails InternalServerError(string detail, string? title = null, string? errorCode = null) =>
        Create(StatusCodes.Status500InternalServerError, detail, title, errorCode);

    public static CustomProblemDetails Create(int statusCode, string detail, string? title = null, string? errorCode = null)
    {
        return new CustomProblemDetails
        {
            Status = statusCode,
            Title = title ?? GetDefaultTitle(statusCode),
            Detail = detail,
            Type = $"https://httpstatuses.com/{statusCode}",
            ErrorCode = errorCode
        };
    }

    private static string GetDefaultTitle(int statusCode) => statusCode switch
    {
        400 => "Bad Request",
        401 => "Unauthorized",
        403 => "Forbidden",
        404 => "Not Found",
        409 => "Conflict",
        500 => "Internal Server Error",
        _   => "Error"
    };
}
