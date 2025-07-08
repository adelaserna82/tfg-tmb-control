using Microsoft.AspNetCore.Mvc;

namespace TmbControl.Shared.Exceptions;

public sealed class CustomProblemDetails : ProblemDetails
{
    public string? ErrorCode { get; set; }
}
