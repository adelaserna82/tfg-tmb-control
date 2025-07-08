using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Communications.Features.Example;

public static class Ping
{
    public static IEndpointRouteBuilder MapPingCommunications(this IEndpointRouteBuilder app)
    {
        app.MapGet("/ping", () =>
        {
            return Results.Ok(new { message = "Pong from Communications module 📄" });
        })
        .WithName("PingCommunications")
        .WithTags("Communications")
        .WithDescription("Ping endpoint for the Communications module")
        .WithSummary("Ping Communications")
        .WithMetadata(new[] { "Ping", "Communications" })
        .WithOpenApi()
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<CustomProblemDetails>(StatusCodes.Status403Forbidden)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .RequireAuthorization("ApiKeyOnly");

        return app;
    }
}
