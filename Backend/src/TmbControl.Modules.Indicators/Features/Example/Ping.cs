using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using TmbControl.Shared.Exceptions;


namespace TmbControl.Modules.Indicators.Features.Example;

public static class Ping
{
    public static IEndpointRouteBuilder MapPingIndicators(this IEndpointRouteBuilder app)
    {
        app.MapGet("/ping", () =>
        {
            return Results.Ok(new { message = "Pong from Indicators module 📊" });
        })
        .WithName("PingIndicators")
        .WithTags("Indicators")
        .WithDescription("Ping endpoint for the Indicators module")
        .WithSummary("Ping endpoint for the Indicators module")
        .WithMetadata(["Ping", "Indicators"])
        .WithOpenApi()
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<CustomProblemDetails>(StatusCodes.Status403Forbidden)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .RequireAuthorization("ApiKeyOnly");

        return app;
    }
}
