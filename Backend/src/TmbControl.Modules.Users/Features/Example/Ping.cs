using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Users.Features.Example;

public static class Ping
{
    public static IEndpointRouteBuilder MapPingUsers(this IEndpointRouteBuilder app)
    {
        app.MapGet("/ping", () =>
        {
            return Results.Ok(new { message = "Pong from Users module 👤" });
        })
        .WithName("PingUsers")
        .WithTags("Users")
        .WithDescription("Ping endpoint for the Users module")
        .WithSummary("Ping endpoint for the Users module")
        .WithMetadata(["Ping", "Users"])
        .WithOpenApi()
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<CustomProblemDetails>(StatusCodes.Status403Forbidden)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .RequireAuthorization("ApiKeyOnly");

        return app;
    }
}
