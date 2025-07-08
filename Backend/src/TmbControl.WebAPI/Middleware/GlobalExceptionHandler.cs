using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using TmbControl.Shared.Exceptions;

namespace TmbControl.WebAPI.Middleware;

internal sealed class GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger) : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger = logger;

    public async ValueTask<bool> TryHandleAsync(HttpContext httpContext, Exception exception, CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Exception occurred: {Message}", exception.Message);

        var (statusCode, title) = exception switch
        {
            NotFoundException             => (StatusCodes.Status404NotFound, "Not Found"),
            NotAcceptableException        => (StatusCodes.Status406NotAcceptable, "Not Acceptable"),
            ElementAlreadyExistException  => (StatusCodes.Status409Conflict, "Conflict"),
            AuthException                 => (StatusCodes.Status401Unauthorized, "Unauthorized"),
            _                             => (StatusCodes.Status500InternalServerError, "Internal Server Error")
        };

        // Si la excepción implementa IHasErrorCode => usar CustomProblemDetails
        var problemDetails = CreateProblemDetails(exception, statusCode, title);

        httpContext.Response.StatusCode = statusCode;
        httpContext.Response.ContentType = "application/problem+json";
        await httpContext.Response.WriteAsJsonAsync(problemDetails, cancellationToken);

        return true;
    }

    private static ProblemDetails CreateProblemDetails(Exception exception, int statusCode, string title)
    {
        if (exception is IHasErrorCode exWithCode)
        {
            return new CustomProblemDetails
            {
                Status = statusCode,
                Title = title,
                Detail = exception.Message,
                ErrorCode = exWithCode.ErrorCode,
                Type = $"https://httpstatuses.com/{statusCode}"
            };
        }

        return new ProblemDetails
        {
            Status = statusCode,
            Title = title,
            Detail = exception.Message,
            Type = $"https://httpstatuses.com/{statusCode}"
        };
    }
}
