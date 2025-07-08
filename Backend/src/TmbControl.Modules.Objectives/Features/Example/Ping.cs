using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Mvc;
using TmbControl.Shared.Exceptions;


namespace TmbControl.Modules.Objectives.Features.Example;

public static class Ping
{
    public static IEndpointRouteBuilder MapPingObjectives(this IEndpointRouteBuilder app)
    {
        app.MapGet("/ping", () =>
        {
            return Results.Ok(new { message = "Pong from Objetives module 📨" });
        })
        .WithName("PingObjectives")
        .WithTags("ActionPlans")
        .WithDescription("Ping endpoint for the Objectives module")
        .WithSummary("Ping endpoint for the Objectives module")
        .WithMetadata(["Ping", "ActionPlans"])
        .WithOpenApi()
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<CustomProblemDetails>(StatusCodes.Status403Forbidden)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .RequireAuthorization("ApiKeyOnly");

        return app;
    }
}
