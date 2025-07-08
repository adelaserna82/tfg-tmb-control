namespace TmbControl.Shared.Exceptions;

public class ElementAlreadyExistException : Exception
{
    public string ErrorCode { get; } = "conflict";

    public ElementAlreadyExistException(string message) : base(message)
    {
    }
}
