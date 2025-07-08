namespace TmbControl.Shared.Services;

using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;

public class SmtpEmailService(IOptions<SmtpSettings> options) : IEmailService
{
    private readonly SmtpSettings _settings = options.Value;

    public async Task SendAsync(EmailDto email)
    {
        using var client = new SmtpClient(_settings.Host, _settings.Port)
        {
            Credentials = new NetworkCredential(_settings.Username, _settings.Password),
            EnableSsl = _settings.UseSsl
        };

        var message = new MailMessage
        {
            From = new MailAddress(_settings.From),
            Subject = email.Subject,
            Body = email.Body,
            IsBodyHtml = false
        };

        message.To.Add(email.To);

        await client.SendMailAsync(message);
    }
}

public class SmtpSettings
{
    public string Host { get; set; } = default!;
    public int Port { get; set; }
    public string Username { get; set; } = default!;
    public string Password { get; set; } = default!;
    public string From { get; set; } = default!;
    public bool UseSsl { get; set; }
}