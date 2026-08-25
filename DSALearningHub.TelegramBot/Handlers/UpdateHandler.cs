using Telegram.Bot;
using Telegram.Bot.Exceptions;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;
using Telegram.Bot.Types.Enums;
using DSALearningHub.Infrastructure.Data;
using DSALearningHub.Core.Models;
using Microsoft.EntityFrameworkCore;

namespace DSALearningHub.TelegramBot.Handlers;

public class UpdateHandler : IUpdateHandler
{
    private readonly IServiceProvider _serviceProvider;
    private readonly ILogger<UpdateHandler> _logger;

    public UpdateHandler(IServiceProvider serviceProvider, ILogger<UpdateHandler> logger)
    {
        _serviceProvider = serviceProvider;
        _logger = logger;
    }

    public async Task HandleUpdateAsync(ITelegramBotClient botClient, Update update, CancellationToken cancellationToken)
    {
        // Handle CallbackQuery
        if (update.Type == UpdateType.CallbackQuery)
        {
            await HandleCallbackQueryAsync(botClient, update.CallbackQuery!, cancellationToken);
            return;
        }

        // Only process Message updates
        if (update.Type != UpdateType.Message)
            return;

        // Only process text messages
        if (update.Message!.Type != MessageType.Text)
            return;

        var chatId = update.Message.Chat.Id;
        var messageText = update.Message.Text;
        var userId = update.Message.From?.Id ?? 0;

        _logger.LogInformation("Received a '{MessageText}' message in chat {ChatId}.", messageText, chatId);

        try
        {
            // Simple command routing
            if (messageText!.StartsWith("/start"))
            {
                await HandleStartCommand(botClient, chatId, userId, cancellationToken);
            }
            else if (messageText.StartsWith("/help"))
            {
                await HandleHelpCommand(botClient, chatId, cancellationToken);
            }
            else if (messageText.StartsWith("/learn"))
            {
                await HandleLearnCommand(botClient, chatId, cancellationToken);
            }
            else if (messageText.StartsWith("/quiz"))
            {
                await HandleQuizCommand(botClient, chatId, cancellationToken);
            }
            else if (messageText.StartsWith("/progress"))
            {
                await HandleProgressCommand(botClient, chatId, userId, cancellationToken);
            }
            else
            {
                // Echo for now
                await botClient.SendMessage(
                    chatId: chatId,
                    text: $"Bạn nói: {messageText}\nGõ /help để xem các lệnh hỗ trợ.",
                    cancellationToken: cancellationToken);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error handling message");
        }
    }

    private async Task HandleStartCommand(ITelegramBotClient botClient, long chatId, long userId, CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        string welcomeText = "👋 Chào mừng bạn đến với **DSA Learning Hub**!\n\n" +
                             "Tôi là trợ lý AI giúp bạn học Cấu trúc Dữ liệu & Giải thuật một cách dễ dàng và hiệu quả.\n\n" +
                             "Gõ /help để xem danh sách các lệnh.";

        await botClient.SendMessage(
            chatId: chatId,
            text: welcomeText,
            parseMode: ParseMode.Markdown,
            cancellationToken: cancellationToken);
    }

    private async Task HandleHelpCommand(ITelegramBotClient botClient, long chatId, CancellationToken cancellationToken)
    {
        string helpText = "📚 **Các lệnh hỗ trợ:**\n\n" +
                          "/start - Bắt đầu lại bot\n" +
                          "/learn - Khám phá các chủ đề DSA\n" +
                          "/quiz - Làm bài tập trắc nghiệm\n" +
                          "/progress - Xem tiến độ học tập\n" +
                          "/review - Ôn tập Flashcards (Spaced Repetition)\n";

        await botClient.SendMessage(
            chatId: chatId,
            text: helpText,
            parseMode: ParseMode.Markdown,
            cancellationToken: cancellationToken);
    }

    private async Task HandleLearnCommand(ITelegramBotClient botClient, long chatId, CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var topics = await db.Topics.OrderBy(t => t.Order).ToListAsync(cancellationToken);
        
        string text = "📖 **Danh sách chủ đề DSA:**\n\n";
        foreach (var topic in topics)
        {
            text += $"🔹 {topic.Order}. {topic.Name} - {topic.Difficulty}\n";
        }

        await botClient.SendMessage(
            chatId: chatId,
            text: text,
            parseMode: ParseMode.Markdown,
            cancellationToken: cancellationToken);
    }

    private async Task HandleQuizCommand(ITelegramBotClient botClient, long chatId, CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Lấy ngẫu nhiên 1 câu hỏi
        var question = await db.Questions.Include(q => q.Topic).OrderBy(r => Guid.NewGuid()).FirstOrDefaultAsync(cancellationToken);
        
        if (question == null)
        {
            await botClient.SendMessage(chatId: chatId, text: "Chưa có câu hỏi nào trong hệ thống.", cancellationToken: cancellationToken);
            return;
        }

        var options = System.Text.Json.JsonSerializer.Deserialize<List<string>>(question.Options);
        if (options == null || !options.Any()) return;

        var inlineKeyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup(
            options.Select((opt, index) => new[] { Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData(opt, $"quiz_{question.Id}_{index}") }).ToArray()
        );

        string text = $"❓ **Quiz: {question.Topic?.Name}**\n\n{question.Content}";

        await botClient.SendMessage(
            chatId: chatId,
            text: text,
            parseMode: ParseMode.Markdown,
            replyMarkup: inlineKeyboard,
            cancellationToken: cancellationToken);
    }

    private async Task HandleProgressCommand(ITelegramBotClient botClient, long chatId, long userId, CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var progress = await db.UserProgresses.Where(p => p.UserId == userId).ToListAsync(cancellationToken);
        
        int totalXP = progress.Sum(p => p.XP);
        int level = (totalXP / 100) + 1; // Simple leveling
        int totalCorrect = progress.Sum(p => p.CorrectAnswers);

        string text = $"📈 **Tiến độ học tập của bạn:**\n\n" +
                      $"🏆 Cấp độ: {level} (🌟 {totalXP} XP)\n" +
                      $"✅ Câu trả lời đúng: {totalCorrect}\n\n";
                      
        if (!progress.Any())
        {
            text += "Bạn chưa hoàn thành bài tập nào. Hãy bắt đầu với /quiz nhé!";
        }

        await botClient.SendMessage(
            chatId: chatId,
            text: text,
            parseMode: ParseMode.Markdown,
            cancellationToken: cancellationToken);
    }

    private async Task HandleCallbackQueryAsync(ITelegramBotClient botClient, CallbackQuery callbackQuery, CancellationToken cancellationToken)
    {
        var data = callbackQuery.Data;
        if (string.IsNullOrEmpty(data)) return;

        if (data.StartsWith("quiz_"))
        {
            await HandleQuizAnswerAsync(botClient, callbackQuery, cancellationToken);
        }
        else if (data == "next_quiz")
        {
            await botClient.AnswerCallbackQuery(callbackQuery.Id, cancellationToken: cancellationToken);
            await HandleQuizCommand(botClient, callbackQuery.Message!.Chat.Id, cancellationToken);
        }
    }

    private async Task HandleQuizAnswerAsync(ITelegramBotClient botClient, CallbackQuery callbackQuery, CancellationToken cancellationToken)
    {
        // data format: quiz_{questionId}_{selectedIndex}
        var parts = callbackQuery.Data!.Split('_');
        if (parts.Length != 3) return;

        if (!int.TryParse(parts[1], out int questionId) || !int.TryParse(parts[2], out int selectedIndex))
            return;

        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var question = await db.Questions.FindAsync(new object[] { questionId }, cancellationToken);
        if (question == null) return;

        var options = System.Text.Json.JsonSerializer.Deserialize<List<string>>(question.Options);
        if (options == null || selectedIndex < 0 || selectedIndex >= options.Count) return;

        string selectedAnswer = options[selectedIndex];
        bool isCorrect = selectedAnswer == question.CorrectAnswer;

        // Update progress
        var progress = await db.UserProgresses.FirstOrDefaultAsync(p => p.UserId == callbackQuery.From.Id && p.TopicId == question.TopicId, cancellationToken);
        if (progress == null)
        {
            progress = new UserProgress
            {
                UserId = callbackQuery.From.Id,
                TopicId = question.TopicId,
                QuestionsAnswered = 0,
                CorrectAnswers = 0,
                XP = 0
            };
            db.UserProgresses.Add(progress);
        }

        progress.QuestionsAnswered++;
        if (isCorrect)
        {
            progress.CorrectAnswers++;
            progress.XP += 10;
        }
        progress.LastActiveDate = DateTime.UtcNow;
        await db.SaveChangesAsync(cancellationToken);

        string responseText = isCorrect ? "✅ Chính xác! (+10 XP)\n\n" : $"❌ Sai rồi! Đáp án đúng là: {question.CorrectAnswer}\n\n";
        responseText += $"💡 Giải thích: {question.Explanation}";

        // Trả lời callback query để ẩn trạng thái "loading" trên nút bấm
        await botClient.AnswerCallbackQuery(
            callbackQueryId: callbackQuery.Id,
            text: isCorrect ? "Đúng rồi!" : "Sai rồi!",
            cancellationToken: cancellationToken);

        // Edit message để hiển thị kết quả và bỏ các nút bấm
        await botClient.EditMessageText(
            chatId: callbackQuery.Message!.Chat.Id,
            messageId: callbackQuery.Message.MessageId,
            text: $"❓ **Quiz:** {question.Content}\n\n{responseText}",
            parseMode: ParseMode.Markdown,
            cancellationToken: cancellationToken);
            
        // Gửi thông báo muốn làm tiếp không
        var inlineKeyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup(
            new[] { Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Làm câu tiếp theo 🔄", "next_quiz") }
        );
        await botClient.SendMessage(
            chatId: callbackQuery.Message.Chat.Id,
            text: "Bạn muốn làm tiếp quiz không?",
            replyMarkup: inlineKeyboard,
            cancellationToken: cancellationToken);
    }

    public Task HandleErrorAsync(ITelegramBotClient botClient, Exception exception, HandleErrorSource source, CancellationToken cancellationToken)
    {
        var ErrorMessage = exception switch
        {
            ApiRequestException apiRequestException
                => $"Telegram API Error:\n[{apiRequestException.ErrorCode}]\n{apiRequestException.Message}",
            _ => exception.ToString()
        };

        _logger.LogError("Polling error from {Source}: {ErrorMessage}", source, ErrorMessage);
        return Task.CompletedTask;
    }
}
