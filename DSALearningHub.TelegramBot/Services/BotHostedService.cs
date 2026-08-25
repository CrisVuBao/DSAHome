using Telegram.Bot;
using Telegram.Bot.Polling;
using DSALearningHub.TelegramBot.Handlers;

namespace DSALearningHub.TelegramBot.Services;

public class BotHostedService : BackgroundService
{
    private readonly ITelegramBotClient _botClient;
    private readonly IUpdateHandler _updateHandler;
    private readonly ILogger<BotHostedService> _logger;

    public BotHostedService(
        ITelegramBotClient botClient,
        IUpdateHandler updateHandler,
        ILogger<BotHostedService> logger)
    {
        _botClient = botClient;
        _updateHandler = updateHandler;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Starting Telegram Bot Polling...");
        
        var receiverOptions = new ReceiverOptions
        {
            AllowedUpdates = [] // receive all update types
        };

        _botClient.StartReceiving(
            updateHandler: _updateHandler,
            receiverOptions: receiverOptions,
            cancellationToken: stoppingToken
        );

        var me = await _botClient.GetMe(stoppingToken);
        _logger.LogInformation("Bot started successfully. Listening for @{BotName}", me.Username);
        
        // Wait forever
        await Task.Delay(Timeout.Infinite, stoppingToken);
    }
}
