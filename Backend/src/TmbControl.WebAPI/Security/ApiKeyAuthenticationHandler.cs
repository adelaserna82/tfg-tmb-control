using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Options;
using System.Security.Claims;
using System.Text.Encodings.Web;

namespace TmbControl.WebAPI.Security;

public class ApiKeyAuthenticationHandler
    : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly IConfiguration _cfg;

    // ✅  ctor SIN ISystemClock
    public ApiKeyAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        IConfiguration cfg)          // inyectamos la config aquí
        : base(options, logger, encoder)
    {
        _cfg = cfg;
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (Request.Method == HttpMethods.Options)
            return Task.FromResult(AuthenticateResult.NoResult());

        const string header = "x-api-key";
        if (!Request.Headers.TryGetValue(header, out var value))
            return Task.FromResult(AuthenticateResult.NoResult());

        var apiKeys = _cfg.GetSection("ApiKeys").Get<List<Dictionary<string, string>>>();
        if (apiKeys == null || !apiKeys.Any(k => k.TryGetValue("key", out var kValue) && kValue == value))
            return Task.FromResult(AuthenticateResult.Fail("Invalid API Key"));

        var claims  = new[] { new Claim(ClaimTypes.Name, "ApiKeyUser") };
        var identity = new ClaimsIdentity(claims, Scheme.Name);
        var ticket   = new AuthenticationTicket(new ClaimsPrincipal(identity), Scheme.Name);

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
