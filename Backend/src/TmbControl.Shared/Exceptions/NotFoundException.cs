using TmbControl.Shared.Exceptions;

namespace TmbControl.Shared.Exceptions;

public class NotFoundException(string message) : Exception(message), IHasErrorCode
{
    public string ErrorCode => ErrorCodes.CommunicationNotFound;
}
