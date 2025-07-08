namespace TmbControl.Shared.Services.Users;

public interface IUserLoginService
{
    Task<UserLoginData?> GetUserByEmailAsync(string email);
}
