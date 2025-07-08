using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using TmbControl.Shared.Exceptions;
using TmbControl.Shared.Persistence;

namespace TmbControl.Shared.Features.Notifications.Update;

public static class MarkNotificationAsRead
{
    public static void MapMarkNotificationAsRead(this IEndpointRouteBuilder app)
    {
        app.MapPatch("/{id}/read", async (
            Guid id,
            [FromServices] SharedDbContext db,
            HttpContext context) =>
        {
            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrWhiteSpace(userIdClaim))
            {
                return Results.NotFound(
                    CustomProblemDetailsBuilder.NotFound(
                        "User id not found.",
                        "User not found",
                        ErrorCodes.UserNotFound));
            }

            var userId = Guid.Parse(userIdClaim);

            var notification = await db.UserNotifications
                .FirstOrDefaultAsync(n => n.Id == id && n.UserId == userId);

            if (notification is null)
            {
                return Results.NotFound(
                    CustomProblemDetailsBuilder.NotFound(
                        $"Notification {id} not found for this user.",
                        "Notification not found",
                        ErrorCodes.NotificationNotFound));
            }

            if (!notification.IsRead)
            {
                notification.IsRead = true;
                notification.ReadAt = DateTime.UtcNow;
                await db.SaveChangesAsync();
            }

            return Results.NoContent();
        })
        .WithName("MarkNotificationAsRead")
        .WithTags("Notifications")
        .WithDescription("Mark a specific notification as read by the current user")
        .WithSummary("Mark notification as read")
        .Produces(StatusCodes.Status204NoContent)
        .Produces<CustomProblemDetails>(StatusCodes.Status404NotFound)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .RequireAuthorization()
        .WithOpenApi(operation =>
        {
            operation.Parameters.First(p => p.Name == "id").Description = "ID of the user notification";
            return operation;
        });
    }
}
