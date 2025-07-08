using Microsoft.OpenApi.Models;
using TmbControl.Modules.Indicators;
using TmbControl.Modules.Indicators.Persistence;
using TmbControl.WebAPI.Middleware;
using TmbControl.Modules.Communications.Persistence;
using TmbControl.Modules.Communications;
using TmbControl.Modules.OperationalControl.Persistence;
using TmbControl.Modules.OperationalControl;
using TmbControl.Modules.Objectives.Persistence;
using TmbControl.Modules.Objectives;
using TmbControl.Modules.Sites;
using TmbControl.Modules.Sites.Persistence;
using TmbControl.Modules.Users;
using TmbControl.Modules.Users.Persistence;
using TmbControl.Shared;
using TmbControl.Shared.Persistence;

using Microsoft.IdentityModel.Tokens;
using System.Text;
using TmbControl.Modules.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication;
using TmbControl.WebAPI.Security;
using TmbControl.Shared.Enums;

var builder = WebApplication.CreateBuilder(args);

// Add SignalR for real-time communication
builder.Services.AddSignalR();


// Services
builder.Services.AddEndpointsApiExplorer();

// Register services
builder.Services.AddAuthModule(builder.Configuration);
builder.Services.AddSharedModule(builder.Configuration);
builder.Services.AddIndicatorsModule(builder.Configuration);
builder.Services.AddCommunicationsModule(builder.Configuration);
builder.Services.AddOperationalControlModule(builder.Configuration);
builder.Services.AddObjectivesModule(builder.Configuration);
builder.Services.AddSitesModule(builder.Configuration);
builder.Services.AddUsersModule(builder.Configuration);


builder.Services.AddProblemDetails();

// Middleware to handle exceptions
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();


// Middleware to handle authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
{
    options.TokenValidationParameters = new()
    {
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            var accessToken = context.Request.Query["access_token"];
            var path = context.HttpContext.Request.Path;

            if (!string.IsNullOrEmpty(accessToken) &&
                (path.StartsWithSegments("/hubs/indicators")))
            {
                context.Token = accessToken;
            }

            return Task.CompletedTask;
        }
    };
})
.AddScheme<AuthenticationSchemeOptions, ApiKeyAuthenticationHandler>(
        "ApiKey", _ => { });



// Middleware to handle authorization
builder.Services.AddAuthorization(options =>
{
    // Scheme only to authentique ApiKey
    options.AddPolicy(PoliciySecurity.ApiKey.ToString(), p => p
        .AddAuthenticationSchemes("ApiKey")
        .RequireAuthenticatedUser());

    // Scheme only to authentique Bearer
    options.AddPolicy(PoliciySecurity.Bearer.ToString(), p => p
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser());

    // Scheme only to authentique ApiKey or Bearer
    options.AddPolicy("ApiKeyOrBearer", p => p
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .AddAuthenticationSchemes("ApiKey")
        .RequireAuthenticatedUser());

});

builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new() { Title = "TMB Control API", Version = "v1" });

    // JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header
    });

    // API‑Key
    c.AddSecurityDefinition("x-api-key", new OpenApiSecurityScheme
    {
        Name = "x-api-key",
        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Description = "Clave de acceso que acompaña a cada petición"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        // JWT
        {
            new OpenApiSecurityScheme
            { Reference = new() { Type = ReferenceType.SecurityScheme, Id = "Bearer"} }, new List<string>()
        },
        // API‑Key
        {
            new OpenApiSecurityScheme
            { Reference = new() { Type = ReferenceType.SecurityScheme, Id = "x-api-key"} }, new List<string>()
        }
    });
});

// Middleware to handle CORS
builder.Services.AddCors(opt =>
{
    opt.AddPolicy(PoliciyCoors.FrontendPolicy.ToString(), p =>
    {
        var allowedOrigins = builder.Configuration
                                    .GetSection("Cors:AllowedOrigins")
                                    .Get<string[]>();

        if (allowedOrigins != null && allowedOrigins.Length > 0)
        {
            p.WithOrigins(allowedOrigins)
             .AllowAnyHeader()
             .AllowAnyMethod()
             .AllowCredentials();
        }
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    // Load development data

    await app.Services.UseSharedSeederAsync();
    await app.Services.UseIndicatorsSeederAsync();
    await app.Services.UseCommunicationsSeederAsync();
    await app.Services.UseOperationalControlSeederAsync();
    await app.Services.UseObjectivesSeederAsync();
    await app.Services.UseSitesSeederAsync();
    await app.Services.UseUsersSeederAsync();


}

// Middleware to handle exceptions
app.UseSwagger();
app.UseSwaggerUI();


// Middleware to handle exceptions
app.UseExceptionHandler();

// Middleware to handle CORS
// I commented becouse the Worker cant use CORS, this translate into de module dependency inyector
// app.UseCors("FrontendPolicy");   
app.UseCors();

// Middleware to secure the API
app.UseAuthentication();
app.UseAuthorization();


// Middelware to map the endpoints
app.MapAuthEndpoints();
app.MapSharedEndpoints();
app.MapIndicatorsEndpoints();
app.MapCommunicationsEndpoints();
app.MapOperationalControlEndpoints();
app.MapObjectivesEndpoints();
app.MapSitesEndpoints();
app.MapUsersEndpoints();


app.Run();
