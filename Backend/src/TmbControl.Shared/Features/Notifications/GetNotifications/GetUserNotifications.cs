using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.EntityFrameworkCore;
using TmbControl.Shared.Persistence;
using TmbControl.Shared.Exceptions;
using System.Security.Claims;

namespace TmbControl.Shared.Features.Notifications.GetNotifications;

public static class GetUserNotifications
{
    public static void MapGetUserNotifications(this IEndpointRouteBuilder app)
    {
        app.MapGet("/me", async (
            [FromQuery] int? limit,
            [FromQuery] bool unreadOnly,
            [FromServices] SharedDbContext db,
            HttpContext context) =>
        {
            // var userIdClaim = context.User.FindAll("sub").Select(c => c.Value).FirstOrDefault();
            var userIdClaim = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (userIdClaim is null || userIdClaim.Length == 0)
                return Results.NotFound(
                    CustomProblemDetailsBuilder
                        .NotFound($"User id not found.",
                            "User not found",
                            ErrorCodes.UserNotFound));

            var userId = Guid.Parse(userIdClaim);

            // var query = db.UserNotifications
            //     .Include(un => un.Notification)
            //     .Where(un => un.UserId == userId)
            //     .OrderByDescending(un => un.CreatedAt)
            //     .Select(un => new UserNotificationDto
            //     {
            //         Id = un.Id,
            //         NotificationId = un.NotificationId,
            //         UserId = un.UserId,
            //         IsRead = un.IsRead,
            //         CreatedAt = un.CreatedAt,
            //         Title = un.Notification.Title,
            //         Message = un.Notification.Message,
            //         Type = un.Notification.Type,
            //         Module = un.Notification.Module,
            //         Link = un.Notification.Link
            //     });

            var baseQuery = db.UserNotifications
                .Include(un => un.Notification)
                .Where(un => un.UserId == userId);

            if (unreadOnly)
            {
                baseQuery = baseQuery.Where(un => !un.IsRead);
            }

            var query = baseQuery
                .OrderByDescending(un => un.CreatedAt)
                .Select(un => new UserNotificationDto
                {
                    Id = un.Id,
                    NotificationId = un.NotificationId,
                    UserId = un.UserId,
                    IsRead = un.IsRead,
                    CreatedAt = un.CreatedAt,
                    Title = un.Notification.Title,
                    Message = un.Notification.Message,
                    Type = un.Notification.Type,
                    Module = un.Notification.Module,
                    Link = un.Notification.Link
                });



            var result = limit.HasValue ? await query.Take(limit.Value).ToListAsync() : await query.ToListAsync();

            return Results.Ok(result);
        })
        .WithName("GetUserNotifications")
        .WithTags("Notifications")
        .WithDescription("Get notifications for the current user")
        .WithSummary("Get user notifications")
        .WithMetadata(["Get", "Notifications"])
        .Produces<List<UserNotificationDto>>(StatusCodes.Status200OK)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError)
        .WithOpenApi(operation =>
            {
                operation.Parameters.First(p => p.Name == "unreadOnly").Description = "If true, only unread notifications will be returned";
                operation.Parameters.First(p => p.Name == "limit").Description = "Limit the number of notifications returned";
                return operation;
            });
    }
}


