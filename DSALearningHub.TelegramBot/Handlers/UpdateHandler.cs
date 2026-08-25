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
            else if (messageText.StartsWith("/review"))
            {
                await HandleReviewCommand(botClient, chatId, userId, cancellationToken);
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
        else if (data.StartsWith("show_back_"))
        {
            await HandleShowBackAsync(botClient, callbackQuery, cancellationToken);
        }
        else if (data.StartsWith("rate_"))
        {
            await HandleRateAsync(botClient, callbackQuery, cancellationToken);
        }
        else if (data == "next_review")
        {
            await botClient.AnswerCallbackQuery(callbackQuery.Id, cancellationToken: cancellationToken);
            await HandleReviewCommand(botClient, callbackQuery.Message!.Chat.Id, callbackQuery.From.Id, cancellationToken);
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

    private async Task HandleReviewCommand(ITelegramBotClient botClient, long chatId, long userId, CancellationToken cancellationToken)
    {
        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Tìm flashcard cần ôn (đến hạn)
        var now = DateTime.UtcNow;
        var schedule = await db.ReviewSchedules
            .Include(r => r.Flashcard)
            .Where(r => r.UserId == userId && r.NextReviewDate <= now)
            .OrderBy(r => r.NextReviewDate)
            .FirstOrDefaultAsync(cancellationToken);

        Flashcard? flashcardToReview = schedule?.Flashcard;

        // Nếu không có card đến hạn, tìm 1 card mới chưa từng học
        if (flashcardToReview == null)
        {
            var learnedFlashcardIds = await db.ReviewSchedules
                .Where(r => r.UserId == userId)
                .Select(r => r.FlashcardId)
                .ToListAsync(cancellationToken);

            flashcardToReview = await db.Flashcards
                .Where(f => !learnedFlashcardIds.Contains(f.Id))
                .FirstOrDefaultAsync(cancellationToken);
        }

        if (flashcardToReview == null)
        {
            await botClient.SendMessage(chatId: chatId, text: "🎉 Tuyệt vời! Bạn đã ôn tập hết tất cả thẻ ghi nhớ hiện có.", cancellationToken: cancellationToken);
            return;
        }

        var inlineKeyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup(
            new[] { Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Lật thẻ (Xem đáp án) 🔄", $"show_back_{flashcardToReview.Id}") }
        );

        string text = $"🃏 **Flashcard Ôn Tập**\n\n**Câu hỏi:** {flashcardToReview.Front}";

        await botClient.SendMessage(
            chatId: chatId,
            text: text,
            parseMode: ParseMode.Markdown,
            replyMarkup: inlineKeyboard,
            cancellationToken: cancellationToken);
    }

    private async Task HandleShowBackAsync(ITelegramBotClient botClient, CallbackQuery callbackQuery, CancellationToken cancellationToken)
    {
        var parts = callbackQuery.Data!.Split('_');
        if (parts.Length != 3 || !int.TryParse(parts[2], out int flashcardId)) return;

        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var flashcard = await db.Flashcards.FindAsync(new object[] { flashcardId }, cancellationToken);
        if (flashcard == null) return;

        var inlineKeyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup(
            new[]
            {
                new[]
                {
                    Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("😰 Quên (0)", $"rate_{flashcardId}_0"),
                    Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("🤔 Khó (1)", $"rate_{flashcardId}_1"),
                },
                new[]
                {
                    Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("😊 Bình thường (2)", $"rate_{flashcardId}_2"),
                    Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("🎯 Quá dễ (3)", $"rate_{flashcardId}_3")
                }
            }
        );

        string text = $"🃏 **Flashcard Ôn Tập**\n\n**Câu hỏi:** {flashcard.Front}\n\n---\n\n**Đáp án:** {flashcard.Back}\n\n_Bạn thấy câu này thế nào?_";

        await botClient.AnswerCallbackQuery(callbackQuery.Id, cancellationToken: cancellationToken);
        await botClient.EditMessageText(
            chatId: callbackQuery.Message!.Chat.Id,
            messageId: callbackQuery.Message.MessageId,
            text: text,
            parseMode: ParseMode.Markdown,
            replyMarkup: inlineKeyboard,
            cancellationToken: cancellationToken);
    }

    private async Task HandleRateAsync(ITelegramBotClient botClient, CallbackQuery callbackQuery, CancellationToken cancellationToken)
    {
        var parts = callbackQuery.Data!.Split('_');
        if (parts.Length != 3 || !int.TryParse(parts[1], out int flashcardId) || !int.TryParse(parts[2], out int rating)) return;

        using var scope = _serviceProvider.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        var schedule = await db.ReviewSchedules.FirstOrDefaultAsync(r => r.UserId == callbackQuery.From.Id && r.FlashcardId == flashcardId, cancellationToken);
        
        if (schedule == null)
        {
            schedule = new ReviewSchedule
            {
                UserId = callbackQuery.From.Id,
                FlashcardId = flashcardId,
                Interval = 0,
                EaseFactor = 2.5,
                RepetitionCount = 0
            };
            db.ReviewSchedules.Add(schedule);
        }

        // SM-2 Algorithm (simplified)
        // Rating: 0 (Blackout), 1 (Hard), 2 (Good), 3 (Easy)
        // In SM-2 it's 0-5, we map 0->0, 1->2, 2->4, 3->5
        int sm2Rating = rating switch {
            0 => 0,
            1 => 2,
            2 => 4,
            3 => 5,
            _ => 0
        };

        if (sm2Rating >= 3)
        {
            if (schedule.RepetitionCount == 0)
                schedule.Interval = 1;
            else if (schedule.RepetitionCount == 1)
                schedule.Interval = 6;
            else
                schedule.Interval = (int)Math.Round(schedule.Interval * schedule.EaseFactor);
                
            schedule.RepetitionCount++;
        }
        else
        {
            schedule.RepetitionCount = 0;
            schedule.Interval = 1;
        }

        schedule.EaseFactor = schedule.EaseFactor + (0.1 - (5 - sm2Rating) * (0.08 + (5 - sm2Rating) * 0.02));
        if (schedule.EaseFactor < 1.3) schedule.EaseFactor = 1.3;

        schedule.NextReviewDate = DateTime.UtcNow.AddDays(schedule.Interval);
        
        await db.SaveChangesAsync(cancellationToken);

        string nextReviewStr = schedule.Interval == 1 ? "ngày mai" : $"sau {schedule.Interval} ngày nữa";

        var inlineKeyboard = new Telegram.Bot.Types.ReplyMarkups.InlineKeyboardMarkup(
            new[] { Telegram.Bot.Types.ReplyMarkups.InlineKeyboardButton.WithCallbackData("Ôn câu tiếp theo 🔄", "next_review") }
        );

        await botClient.AnswerCallbackQuery(callbackQuery.Id, cancellationToken: cancellationToken);
        await botClient.EditMessageText(
            chatId: callbackQuery.Message!.Chat.Id,
            messageId: callbackQuery.Message.MessageId,
            text: $"Đã ghi nhận! Bạn sẽ ôn lại câu này **{nextReviewStr}**.",
            parseMode: ParseMode.Markdown,
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
