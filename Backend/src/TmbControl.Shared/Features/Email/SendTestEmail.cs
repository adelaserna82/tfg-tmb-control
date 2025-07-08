using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Services;

namespace TmbControl.Shared.Features.Email;

public static class SendTestEmail
{
    public static void MapSendTestEmail(this IEndpointRouteBuilder app)
    {
        app.MapPost("/email/test", async (
            [FromBody] EmailDto dto,
            [FromServices] IEmailService emailService) =>
        {
            await emailService.SendAsync(dto);
            return Results.Ok("Correo de prueba enviado.");
        })
        .WithName("SendTestEmail")
        .WithTags("Email")
        .WithDescription("Envía un email de prueba (desarrollo)")
        .WithSummary("Email de prueba")
        .Produces(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithMetadata(["Post", "Email"])
        .WithOpenApi();
    }
}
