using DSALearningHub.TelegramBot;

using DSALearningHub.Infrastructure.Data;
using DSALearningHub.TelegramBot.Handlers;
using DSALearningHub.TelegramBot.Services;
using Microsoft.EntityFrameworkCore;
using Telegram.Bot;
using Telegram.Bot.Polling;

var builder = Host.CreateApplicationBuilder(args);

// DbContext
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Telegram Bot Client
var botToken = builder.Configuration["TelegramBot:Token"];
if (string.IsNullOrEmpty(botToken) || botToken == "YOUR_BOT_TOKEN_HERE")
{
    // Don't crash immediately if token is not set, just log it.
    // The hosted service might fail, but it's better than failing at build time.
    botToken = "INVALID_TOKEN";
}
builder.Services.AddHttpClient("tgclient")
    .AddTypedClient<ITelegramBotClient>(httpClient => new TelegramBotClient(botToken, httpClient));

builder.Services.AddSingleton<IUpdateHandler, UpdateHandler>();
builder.Services.AddHostedService<BotHostedService>();

var host = builder.Build();
host.Run();
