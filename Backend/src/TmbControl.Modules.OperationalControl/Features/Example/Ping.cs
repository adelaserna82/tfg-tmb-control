using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using TmbControl.Shared.Exceptions;


namespace TmbControl.Modules.OperationalControl.Features.Example;

public static class Ping
{
    public static IEndpointRouteBuilder MapPingOperationalControl(this IEndpointRouteBuilder app)
    {
        app.MapGet("/ping", () =>
        {
            return Results.Ok(new { message = "Pong from Operational Control module 📨" });
        })
        .WithName("PingOperationalControl")
        .WithTags("OperationalControl")
        .WithDescription("Ping endpoint for the Operational Control module")
        .WithSummary("Ping endpoint for the Operational Control module")
        .WithMetadata(["Ping", "Operational Control"])
        .WithOpenApi()
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<CustomProblemDetails>(StatusCodes.Status403Forbidden)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .RequireAuthorization("ApiKeyOnly");

        return app;
    }
}
