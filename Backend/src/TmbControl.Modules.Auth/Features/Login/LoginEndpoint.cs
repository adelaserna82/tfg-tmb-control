using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TmbControl.Modules.Auth.Services;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Modules.Auth.Features.Login;

public static class LoginEndpoint
{
    public static void MapLogin(this IEndpointRouteBuilder app)
    {
        app.MapPost("/login", async (
            [FromBody] LoginRequest request,
            [FromServices] IAuthService authService) =>
        {
            try
            {
                var result = await authService.LoginAsync(request);
                return Results.Ok(result);
            }
            catch (AuthException ex)
            {
                return Results.BadRequest(CustomProblemDetailsBuilder
                    .BadRequest(ex.Message, "Error on login", ex.ErrorCode));
            }

        })
        .WithName("Login")
        .WithTags("Auth")
        .WithOpenApi()
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status401Unauthorized)
        .Produces<CustomProblemDetails>(StatusCodes.Status403Forbidden)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        ;
    }
}
