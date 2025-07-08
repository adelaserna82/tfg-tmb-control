namespace TmbControl.Modules.Auth.Features.Login;

public record LoginResponse(string Token, DateTime ExpiresAt);
