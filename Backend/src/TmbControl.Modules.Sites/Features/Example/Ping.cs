using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Sites.Features.Example;

public static class Ping
{
    public static IEndpointRouteBuilder MapPingSites(this IEndpointRouteBuilder app)
    {
        app.MapGet("/ping", () =>
        {
            return Results.Ok(new { message = "Pong from Sites module 🛰️" });
        })
        .WithName("PingSites")
        .WithTags("Sites")
        .WithOpenApi()
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<CustomProblemDetails>(StatusCodes.Status403Forbidden)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .RequireAuthorization("ApiKeyOnly");

        return app;
    }
}
