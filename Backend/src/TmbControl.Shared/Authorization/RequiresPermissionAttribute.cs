
using Microsoft.AspNetCore.Http;
using TmbControl.Shared.Enums;
using TmbControl.Shared.Exceptions;

namespace TmbControl.Shared.Authorization;

public class RequiresPermissionAttribute(PermissionModule module, PermissionAction action) : Attribute, IEndpointFilter
{
    private readonly string _module = module.ToString();
    private readonly string _action = action.ToString();

    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        var httpContext = context.HttpContext;
        if (!PermissionChecker.HasPermission(httpContext, _module, _action))
        {
            return Results.BadRequest(
            CustomProblemDetailsBuilder.BadRequest(
                $"User does not have required permission: {_module}.{_action}.",
                "Permission denied",
                ErrorCodes.PermissionDenied));
        }

        return await next(context);
    }
}