namespace TmbControl.Shared.Exceptions;

public class NotAcceptableException(string message) : Exception(message), IHasErrorCode
{
    public string ErrorCode => ErrorCodes.NotAccepable;
}
