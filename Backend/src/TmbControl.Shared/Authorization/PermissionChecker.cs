using Microsoft.AspNetCore.Http;

namespace TmbControl.Shared.Authorization;
public static class PermissionChecker
{
    public static bool HasPermission(HttpContext context, string module, string action)
    {
        var permissionClaims = context.User.FindAll("permission");
        if (permissionClaims is null || !permissionClaims.Any()) return false;

        var required = $"{module}:{action}";
        return permissionClaims.Any(c => c.Value == required);


    }
}