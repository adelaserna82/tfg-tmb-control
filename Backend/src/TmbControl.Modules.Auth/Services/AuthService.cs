using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Modules.Auth.Features.Login;
using TmbControl.Shared.Exceptions;
using Microsoft.Extensions.Configuration;
using TmbControl.Shared.Services.Users;

namespace TmbControl.Modules.Auth.Services;

public interface IAuthService
{
    Task<LoginResponse> LoginAsync(LoginRequest request);
}

public class AuthService(IUserLoginService userService, IConfiguration config) : IAuthService
{
    private readonly IUserLoginService _userService = userService;
    private readonly IConfiguration _config = config;

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userService.GetUserByEmailAsync(request.Email);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            throw new AuthException("Invalid credentials");

        if (!user.IsActive)
            throw new AuthException("User is inactive");



        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);
        var expires = DateTime.UtcNow.AddHours(1);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim("email", user.Email),
            new Claim("role", user.RoleCode),
            new Claim("name", user.Name )
        };

        foreach (var permission in user.Permissions)
        {
            // Combine Module and Action as a string, e.g., "Module:Action"
            claims.Add(new Claim("permission", $"{permission.Module}:{permission.Action}"));
        }

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);

        return new LoginResponse(tokenHandler.WriteToken(token), expires);
    }
}
