namespace TmbControl.Shared.Services;

public interface IEmailService
{
    Task SendAsync(EmailDto email);
}


public class EmailDto
{
    public string To { get; set; } = default!;
    public string Subject { get; set; } = default!;
    public string Body { get; set; } = default!;
}