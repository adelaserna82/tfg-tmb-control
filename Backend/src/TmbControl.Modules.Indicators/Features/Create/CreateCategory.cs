using Microsoft.AspNetCore.Mvc;
using TmbControl.Modules.Indicators.Persistence;
using TmbControl.Modules.Indicators.Entities;
using Microsoft.AspNetCore.Routing;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using TmbControl.Shared.Exceptions;
using Microsoft.EntityFrameworkCore;
using TmbControl.Shared.Authorization;
using TmbControl.Shared.Enums;

namespace TmbControl.Modules.Indicators.Features.Create;

public static class CreateCategory
{
    public static void MapCreateCategory(this IEndpointRouteBuilder app)
    {
        app.MapPost("categories", async (
            [FromBody] CreateCategoryRequest request,
            [FromServices] IndicatorsDbContext db) =>
        {
            var category = new Category
            {
                Name = request.Name,
                Description = request.Name,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = "System",
                Order = await db.Categories.CountAsync() + 1
            };

            db.Categories.Add(category);
            await db.SaveChangesAsync();

            return Results.Created($"/api/indicators/categories/{category.Id}", category.Id);
        })
        .AddEndpointFilter(new RequiresPermissionAttribute(PermissionModule.Indicators, PermissionAction.Create))
        .WithName("CreateCategory")
        .WithTags("Indicators")
        .WithDescription("Create a new indicator category")
        .WithSummary("Create a new indicator category")
        .WithMetadata(["Post", "Indicators"])
        .Accepts<CreateCategoryRequest>("application/json")
        .Produces<int>(StatusCodes.Status201Created)
        .Produces<CustomProblemDetails>(StatusCodes.Status400BadRequest)
        .Produces<CustomProblemDetails>(StatusCodes.Status500InternalServerError);
    }
}

public record CreateCategoryRequest
{
    public string Name { get; init; } = default!;
}
