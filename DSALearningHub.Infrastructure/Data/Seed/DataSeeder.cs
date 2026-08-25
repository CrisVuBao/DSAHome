using System.Text.Json;
using DSALearningHub.Core.Models;

namespace DSALearningHub.Infrastructure.Data.Seed;

public static class DataSeeder
{
    public static async Task SeedDataAsync(AppDbContext context, string contentPath)
    {
        await context.Database.EnsureCreatedAsync();

        if (context.Topics.Any())
        {
            return; // Db has been seeded
        }

        var options = new JsonSerializerOptions { PropertyNameCaseInsensitive = true };

        // Seed Topics
        var topicsPath = Path.Combine(contentPath, "topics");
        if (Directory.Exists(topicsPath))
        {
            var files = Directory.GetFiles(topicsPath, "*.json");
            foreach (var file in files)
            {
                var json = await File.ReadAllTextAsync(file);
                var topic = JsonSerializer.Deserialize<Topic>(json, options);
                if (topic != null)
                {
                    topic.Id = 0; // Let DB generate ID
                    context.Topics.Add(topic);
                }
            }
            await context.SaveChangesAsync();
        }

        // Seed Questions
        var questionsPath = Path.Combine(contentPath, "questions");
        if (Directory.Exists(questionsPath))
        {
            var files = Directory.GetFiles(questionsPath, "*.json");
            foreach (var file in files)
            {
                var json = await File.ReadAllTextAsync(file);
                var questions = JsonSerializer.Deserialize<List<Question>>(json, options);
                if (questions != null && questions.Any())
                {
                    foreach (var q in questions) q.Id = 0;
                    context.Questions.AddRange(questions);
                }
            }
            await context.SaveChangesAsync();
        }

        // Seed Flashcards
        var flashcardsPath = Path.Combine(contentPath, "flashcards");
        if (Directory.Exists(flashcardsPath))
        {
            var files = Directory.GetFiles(flashcardsPath, "*.json");
            foreach (var file in files)
            {
                var json = await File.ReadAllTextAsync(file);
                var flashcards = JsonSerializer.Deserialize<List<Flashcard>>(json, options);
                if (flashcards != null && flashcards.Any())
                {
                    foreach (var f in flashcards) f.Id = 0;
                    context.Flashcards.AddRange(flashcards);
                }
            }
            await context.SaveChangesAsync();
        }
    }
}
