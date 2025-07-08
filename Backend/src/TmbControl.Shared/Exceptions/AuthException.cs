namespace TmbControl.Shared.Exceptions;

public class AuthException(string message) : Exception(message), IHasErrorCode
{
    public string ErrorCode => ErrorCodes.AuthError;
}

